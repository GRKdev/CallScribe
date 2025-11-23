import openai
from db_connection import db, processed_files_collection
import os
import dotenv
import requests
import json
import uuid
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from queue import Queue
from datetime import datetime


dotenv.load_dotenv()

openai.api_key = os.environ["OPENAI_API_KEY"]
HELICONE_SESSION = os.getenv("HELICONE_SESSION")
HELICONE_AUTH = os.getenv("HELICONE_AUTH")


headers = {
    "x-gladia-key": os.environ["GLADIA_KEY"],
    "accept": "application/json",
}
GLADIA_UPLOAD_ENDPOINT = os.getenv("GLADIA_UPLOAD_ENDPOINT", "https://api.gladia.io/v2/upload")
GLADIA_TRANSCRIBE_ENDPOINT = os.getenv(
    "GLADIA_TRANSCRIBE_ENDPOINT", "https://api.gladia.io/v2/transcription"
)
file_queue = Queue()


class FileCreatedHandler(FileSystemEventHandler):
    def on_created(self, event):
        print("Detected a new file:", event.src_path)
        if event.is_directory:
            return
        if event.src_path.endswith(".mp3") or event.src_path.endswith(".wav"):
            print("Adding to queue:", event.src_path)
            file_queue.put(event.src_path)


observer = Observer()
observer.schedule(FileCreatedHandler(), path="./audio", recursive=False)
observer.start()


def normalize_speaker_label(raw_speaker, speaker_map):
    """
    Gladia has changed diarization formats a few times.
    Keep numeric speakers when provided, otherwise assign incremental numbers per unique label.
    """
    if raw_speaker is None or raw_speaker == "":
        key = "unknown"
    else:
        key = str(raw_speaker).strip()

    digits = None
    cleaned = key.replace("_", " ").lower()
    if cleaned.startswith("speaker"):
        cleaned = cleaned[len("speaker") :].strip(" :-")
    if cleaned.replace(" ", "").isdigit():
        digits = cleaned.replace(" ", "")

    if digits is not None:
        return f"Speaker {digits}", key.lower()

    if cleaned not in speaker_map:
        speaker_map[cleaned] = len(speaker_map)
    return f"Speaker {speaker_map[cleaned]}", cleaned


def extract_diarized_segments(output):
    """
    Support old and new Gladia response shapes:
    - {"prediction": [{"speaker": 0, "transcription": "..."}]}
    - {"results": [{"speaker": 0, "text": "..."}]}
    - {"prediction": {"utterances": [{"speaker": "...", "text": "..."}]}}
    - {"result": {"transcription": {"utterances": [...]}}}
    """
    candidates = []
    if isinstance(output, dict):
        for key in ("prediction", "results", "utterances", "segments"):
            if key in output:
                candidates.append(output[key])
        if "result" in output and isinstance(output["result"], dict):
            for key in ("utterances", "segments", "prediction", "transcription"):
                if key in output["result"]:
                    candidates.append(output["result"][key])
                if (
                    key == "transcription"
                    and isinstance(output["result"].get("transcription"), dict)
                    and "utterances" in output["result"]["transcription"]
                ):
                    candidates.append(output["result"]["transcription"]["utterances"])
    segments = []
    for candidate in candidates:
        if isinstance(candidate, dict):
            nested = candidate.get("utterances") or candidate.get("segments")
            if nested and isinstance(nested, list):
                candidate = nested
            else:
                continue
        if not isinstance(candidate, list):
            continue
        for item in candidate:
            if not isinstance(item, dict):
                continue
            text = (
                item.get("transcription")
                or item.get("text")
                or " ".join(item.get("words", []))
            )
            if not text:
                continue
            speaker = (
                item.get("speaker")
                or item.get("speaker_id")
                or item.get("speaker_label")
            )
            segments.append({"speaker": speaker, "text": text})
    return segments


def transform_transcribe_output(json_output):
    if isinstance(json_output, str):
        try:
            output = json.loads(json_output)
        except json.JSONDecodeError:
            return json_output
    else:
        output = json_output

    segments = extract_diarized_segments(output)
    if not segments and isinstance(output, dict):
        fallback_text = (
            output.get("text")
            or output.get("transcription")
            or output.get("result", {}).get("transcription")
        )
        if isinstance(fallback_text, dict):
            if "utterances" in fallback_text and isinstance(fallback_text["utterances"], list):
                segments = [
                    {"speaker": item.get("speaker"), "text": item.get("text")}
                    for item in fallback_text["utterances"]
                    if isinstance(item, dict)
                ]
            else:
                fallback_text = fallback_text.get("text") or fallback_text.get("transcription")
        if fallback_text and not segments:
            return str(fallback_text)
        return ""

    speaker_map = {}
    merged_segments = []

    if segments:
        # If Gladia returned a duplicated utterance stream (first half == second half), drop the repeat.
        if len(segments) % 2 == 0:
            half = len(segments) // 2
            if segments[:half] == segments[half:]:
                segments = segments[:half]

        normalized = []
        for seg in segments:
            label, _ = normalize_speaker_label(seg.get("speaker"), speaker_map)
            normalized.append({"speaker": label, "text": seg.get("text", "")})
        current_speaker = normalized[0]["speaker"]
        current_text = normalized[0]["text"]

        for seg in normalized[1:]:
            if seg["speaker"] == current_speaker:
                if seg["text"]:
                    current_text += " " + seg["text"]
            else:
                merged_segments.append(f"{current_speaker}: {current_text.strip()}")
                current_speaker = seg["speaker"]
                current_text = seg["text"]
        merged_segments.append(f"{current_speaker}: {current_text.strip()}")

    formatted_output = "\n\n".join(merged_segments)

    # Gladia occasionally returns duplicated utterance streams; drop exact contiguous repeats.
    if formatted_output:
        parts = formatted_output.split("\n\n")
        if len(parts) % 2 == 0 and parts[: len(parts) // 2] == parts[len(parts) // 2 :]:
            parts = parts[: len(parts) // 2]
        formatted_output = "\n\n".join(parts)

    return formatted_output


def ensure_directories():
    for path in ("./txt", "./json", "./gladia_responses"):
        os.makedirs(path, exist_ok=True)


def upload_audio_to_gladia(file_path, content_type):
    with open(file_path, "rb") as f:
        files = {"audio": (os.path.basename(file_path), f, content_type)}
        response = requests.post(GLADIA_UPLOAD_ENDPOINT, headers=headers, files=files)
    response.raise_for_status()
    data = response.json()
    audio_url = data.get("audio_url")
    if not audio_url:
        raise RuntimeError("Gladia upload response missing audio_url")
    return audio_url, data


def start_gladia_transcription(audio_url):
    payload = {
        "audio_url": audio_url,
        "diarization": True,
        "diarization_config": {"min_speakers": 2, "max_speakers": 4},
        "sentences": False,
        "subtitles": False,
    }
    response = requests.post(GLADIA_TRANSCRIBE_ENDPOINT, headers=headers, json=payload)
    response.raise_for_status()
    data = response.json()
    transcription_id = data.get("id") or data.get("job_id") or data.get("transcription_id")
    if not transcription_id:
        raise RuntimeError("Gladia transcription init missing id")
    return transcription_id, data


def poll_gladia_transcription(transcription_id, timeout_seconds=300, poll_interval=3):
    deadline = time.time() + timeout_seconds
    last_response = None
    while time.time() < deadline:
        response = requests.get(
            f"{GLADIA_TRANSCRIBE_ENDPOINT}/{transcription_id}", headers=headers
        )
        if response.status_code >= 400:
            raise RuntimeError(f"Gladia poll error {response.status_code}: {response.text}")
        last_response = response.json()
        status = last_response.get("status") or last_response.get("result", {}).get("status")
        if status == "done" or status == "completed":
            return last_response
        if status == "error":
            raise RuntimeError(f"Gladia transcription failed: {last_response}")
        time.sleep(poll_interval)
    raise TimeoutError("Timed out waiting for Gladia transcription job to finish")


def save_gladia_response(base_name, response_content):
    ensure_directories()
    response_path = f"./gladia_responses/{base_name}.json"
    with open(response_path, "w", encoding="utf-8") as response_file:
        if isinstance(response_content, (dict, list)):
            json.dump(response_content, response_file, indent=2, ensure_ascii=False)
        else:
            response_file.write(str(response_content))
    print(f"- Saved raw Gladia response to {response_path}")


def has_been_processed(file_path):
    base_name = os.path.basename(file_path)
    return processed_files_collection.find_one({"file_name": base_name}) is not None


def mark_as_processed(file_path):
    base_name = os.path.basename(file_path)
    processed_files_collection.insert_one({"file_name": base_name})


def process_audio_file(file_path):
    if has_been_processed(file_path):
        print(f"File {file_path} has already been processed.")
        return

    ensure_directories()
    file_name, file_extension = os.path.splitext(file_path)
    content_type = "audio/" + file_extension[1:] if file_extension else "application/octet-stream"
    base_name = os.path.basename(file_path).split(".")[0]

    print("- Uploading audio to Gladia:", file_name)
    audio_url, upload_resp = upload_audio_to_gladia(file_path, content_type)
    save_gladia_response(f"{base_name}-upload", upload_resp)

    print("- Starting transcription job")
    transcription_id, init_resp = start_gladia_transcription(audio_url)
    save_gladia_response(f"{base_name}-init", init_resp)

    print(f"- Polling transcription job {transcription_id}")
    final_resp = poll_gladia_transcription(transcription_id)
    save_gladia_response(base_name, final_resp)

    print("- Request successful for file:", file_name)
    transformed_output = transform_transcribe_output(final_resp)
    if "speaker_not_activated" in json.dumps(final_resp):
        print(
            "- Warning: Gladia returned 'speaker_not_activated'. Diarization may not be enabled."
        )

    name_parts = base_name.split("-")
    user = name_parts[0]
    date_str = "-".join(name_parts[1:4])
    time_str = ":".join(name_parts[4:6])

    date_time_str = f"{date_str} {time_str}"
    date_time_obj = datetime.strptime(date_time_str, "%Y-%m-%d %H:%M")

    txt_file_path = "./txt/" + base_name + ".txt"
    with open(txt_file_path, "w", encoding="utf-8") as text_file:
        text_file.write(transformed_output)
    print(f"- Transcription stored in {txt_file_path}")

    chat_prompt = (
        f"Given the following text from a file named {base_name}, please analyze the content and generate a JSON response. The response should include a brief summary (20-40 words) that accurately describes the conversation and identifies the speakers with inferred roles or names when possible. Also include sentiment analysis (categorized as Neutral, Positive, or Negative), ONLY maximum 4 relevant tags, and extract speakers/role from the file name. The JSON response should be structured for use in a MongoDB database\n\n"
        f"Text from File ({base_name}):\n{transformed_output}\n\nResponse:"
    )
    json_format = {
        "summary": "",
        "sentiment": "",
        "tags": [],
        "speaker_0": {"name": "", "role": ""},
        "speaker_1": {"name": "", "role": ""},
    }
    json_format_str = json.dumps(json_format)

    openai.base_url = "https://oai.hconeai.com/v1/"
    openai.default_headers = {
        "Helicone-Auth": HELICONE_AUTH,
        "Helicone-Property-Session": HELICONE_SESSION,
    }
    chat_response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": f"You are a helpful assistant. Only provide a json object with This format: {json_format_str}",
            },
            {"role": "user", "content": chat_prompt},
        ],
    )
    chat_response_raw = chat_response.choices[0].message.content

    start_index = chat_response_raw.find("{")
    end_index = chat_response_raw.rfind("}")

    analysis_result = {}
    if start_index != -1 and end_index != -1 and start_index < end_index:
        json_str = chat_response_raw[start_index : end_index + 1]
        try:
            analysis_result = json.loads(json_str)
        except json.JSONDecodeError as e:
            print("JSON parsing error:", e)
            print("Faulty JSON content:", json_str)
    else:
        print("No JSON content found in the response.")

    with open(txt_file_path, "r", encoding="utf-8") as text_file:
        all_text = text_file.read()

    analysis_result["all_text"] = all_text
    analysis_result["user"] = user.title()
    analysis_result["datetime"] = date_time_obj.isoformat()
    analysis_result["file_name"] = base_name
    analysis_result["conversation_id"] = str(uuid.uuid4())
    analysis_result["status"] = "Not Read"

    json_file_path = "./json/" + base_name + ".json"
    with open(json_file_path, "w") as json_file:
        json.dump(analysis_result, json_file, indent=6)
    print(f"- Analysis with transcription stored in {json_file_path}")

    with open(json_file_path, "r") as json_file:
        data = json.load(json_file)

    db.callcenter.insert_one(data)
    print("- Data inserted into MongoDB collection 'callcenter'")
    mark_as_processed(file_path)


try:
    print("Starting file monitoring...")
    while True:
        try:
            while not file_queue.empty():
                file_path = file_queue.get()
                print("Processing file:", file_path)
                process_audio_file(file_path)
        except Exception as e:
            print(f"An error occurred: {e}")

        time.sleep(1)

except KeyboardInterrupt:
    observer.stop()
    observer.join()
    print("File monitoring stopped.")
