
# CallScribe
This comprehensive system integrates audio file processing, backend management, and frontend display to handle call center conversations. It processes audio files for transcription and analysis, manages conversation data via a FastAPI backend, and displays conversation details through a Next.js frontend.

## Overview

### 1. Audio File Processing and Analysis
- **Function**: Transcribes audio files and performs sentiment analysis and conversation summaries.
- **Key Features**:
  - Monitors a directory for new audio files.
  - Uses Gladia API for transcription and OpenAI's GPT-3.5 for analysis.
  - Integrates with MongoDB for data storage.
  - Avoids reprocessing with duplication checks.
- **Tech Stack**: Python, Gladia API, OpenAI GPT-3.5, MongoDB.

### 2. FastAPI Backend Application
- **Function**: Manages conversation data and provides RESTful API endpoints.
- **Key Features**:
  - Lists and updates conversation records.
  - Custom JSON encoder for MongoDB ObjectId.
  - CORS support for frontend integration.
- **Tech Stack**: FastAPI, Uvicorn, MongoDB, Python.

### 3. Next.js Frontend Application
- **Function**: Displays conversation information retrieved from the backend.
- **Tech Stack**: Next.js, React.
- **Features**:
  - Dynamic display of conversation cards.
  - Interactive filters for time, status, and custom date.
  - Search functionality for specific conversations.
  - Responsive design for various screen sizes.
  - Sentiment analysis visualization.
  - Enables status updates of conversations.

## Setup and Installation

### Common Requirements
- Python and MongoDB installed.
- Set environment variables for API keys and MongoDB URI.

### Audio Processor
1. Install dependencies: `pip install pymongo watchdog requests openai python-dotenv`
2. Run script: `python app.py`

### FastAPI Backend
1. Clone repository and install dependencies.
2. Start server: `uvicorn main:app --reload`

### Next.js Frontend
1. Set up Next.js environment.
2. Configure to connect with the FastAPI backend.

## Usage

1. Place audio files in the monitored directory for the Audio Processor.
2. Use the FastAPI backend to manage and retrieve conversation data.
3. Access the Next.js frontend to view conversation details.

## Notes

- Each component is designed to work seamlessly with the others.
- Ensure all environment variables are correctly set for smooth operation.

## Author

GRKdev
