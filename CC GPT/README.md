# Audio File Processing and Analysis System

This system automatically processes audio files placed in a specific directory, transcribes them using the [Gladia API](https://www.gladia.io/), performs sentiment analysis and conversation summary using OpenAI's GPT-3.5, and stores the results in a MongoDB database.

## Features

- **Continuous Monitoring:** Monitors a specified directory for new audio files.
- **Automatic Transcription:** Transcribes audio files using the Gladia API.
- **Conversation Analysis:** Analyzes conversations using OpenAI's GPT-3.5 to provide summaries, sentiment analysis, and relevant tags.
- **Database Integration:** Stores analysis results and transcription in MongoDB.
- **Duplication Check:** Uses MongoDB to track processed files and avoid reprocessing.

## Setup

1. **Install Dependencies:**
   Ensure Python is installed on your system. Then install the required Python packages:
   ```bash
   pip install pymongo watchdog requests openai python-dotenv
   ```

2. **Environment Variables:**
   Set up the following environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key.
   - `GLADIA_KEY`: Your Gladia API key.
   - `MONGO_URI`: Your MongoDB URI.
   - `HELICONE_SESSION` and `HELICONE_AUTH`: Specific headers for your OpenAI usage.

3. **MongoDB:**
   Make sure MongoDB is running and accessible via the `MONGO_URI`.

4. **Running the Script:**
   Execute the main script to start monitoring and processing audio files:
   ```bash
   python app.py
   ```

## Usage

Place any `.wav` or `.mp3` audio files in the monitored directory (default is `./audio`). The script will automatically pick up the files, process them, and store the results in MongoDB.

## File Processing

The script transcribes the audio file and sends the transcription to OpenAI's GPT-3.5 model for analysis. The analysis results, along with the transcription and metadata (file name, user, date, and time), are stored in a MongoDB collection named `callcenter`.

## Note

- This script is designed to run continuously.
- To stop the script, use a keyboard interrupt (Ctrl+C).
- The processed files are tracked in a MongoDB collection to prevent reprocessing of the same file.

## Author

GRKdev
