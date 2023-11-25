
# FastAPI Call Center Application

This FastAPI application provides a backend for managing call center conversations. It includes endpoints for listing conversations, updating conversation states, and filtering based on different criteria. The application uses MongoDB for storage and includes CORS settings for frontend integration.

## Features

- List conversations with various filters (time, status, search query, custom date).
- Update conversation states.
- Custom JSON encoder to handle MongoDB ObjectId.
- CORS enabled for frontend integration.

## Installation

1. Clone the repository:
   ```bash
   git clone [REPOSITORY URL]
   ```
2. Install dependencies:
   ```bash
   pip install fastapi uvicorn pymongo python-dotenv
   ```
3. Set up your `.env` file with the following variables:
   - `MONGO_URI`: URI for your MongoDB instance.
   - `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS.

## Usage

Start the server with:

```bash
uvicorn main:app --reload
```

## Endpoints

- `GET /conversations`: List all conversations with optional filters.
- `PUT /conversations/{conversation_id}/state`: Update the state of a specific conversation.

## Environment Variables

- `MONGO_URI`: Connection string for MongoDB.
- `ALLOWED_ORIGINS`: List of origins allowed to access the backend.

