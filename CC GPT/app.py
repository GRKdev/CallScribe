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
}
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


def transform_transcribe_output(json_output):
    output = json.loads(json_output)

    transcriptions_and_speakers = [
        (item["transcription"], item["speaker"]) for item in output["prediction"]
    ]

    merged_transcriptions_and_speakers = []
    current_speaker = transcriptions_and_speakers[0][1]
    current_transcription = transcriptions_and_speakers[0][0]
    for transcription, speaker in transcriptions_and_speakers[1:]:
        if speaker == current_speaker:
            current_transcription += " " + transcription
        else:
            merged_transcriptions_and_speakers.append(
                f"Speaker {current_speaker}: {current_transcription}"
            )
            current_speaker = speaker
            current_transcription = transcription
    merged_transcriptions_and_speakers.append(
        f"Speaker_{current_speaker}: {current_transcription}"
    )

    formatted_output = "\n\n".join(merged_transcriptions_and_speakers)
    return formatted_output.replace("Speaker_", "Speaker ")


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

    file_name, file_extension = os.path.splitext(file_path)

    with open(file_path, "rb") as f:
        files = {
            "audio": (file_name, f, "audio/" + file_extension[1:]),
            "toggle_diarization": (None, "true"),
        }
        print("- Sending request to Gladia API for file:", file_name)
        response = requests.post(
            "https://api.gladia.io/audio/text/audio-transcription/",
            headers=headers,
            files=files,
        )

        if response.status_code == 200:
            print("- Request successful for file:", file_name)
            transformed_output = transform_transcribe_output(response.text)

            base_name = os.path.basename(file_path).split(".")[0]
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
                model="gpt-3.5-turbo-1106",
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
        else:
            print("- Request failed for file:", file_name)
            print(response.json())


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
