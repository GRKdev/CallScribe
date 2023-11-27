from fastapi import FastAPI, HTTPException, Request
from typing import List
from datetime import datetime, timedelta
from pymongo import MongoClient
from bson import ObjectId
from pydantic import BaseModel
from enum import Enum
from typing import List, Optional
import os
import pymongo
import dotenv
from fastapi.middleware.cors import CORSMiddleware
import pytz
from starlette.middleware.base import BaseHTTPMiddleware

dotenv.load_dotenv()

app = FastAPI()

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient(os.environ["MONGO_URI"])
db = client["callcenter"]
collection = db["callcenter"]


def custom_jsonable_encoder(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, list):
        return [custom_jsonable_encoder(item) for item in obj]
    if isinstance(obj, dict):
        return {key: custom_jsonable_encoder(value) for key, value in obj.items()}
    return obj


def get_time_range(filter_by: str):
    now = datetime.now()
    if filter_by == "24h":
        return (now - timedelta(hours=24)).strftime("%Y-%m-%dT%H:%M:%S"), now.strftime(
            "%Y-%m-%dT%H:%M:%S"
        )
    elif filter_by == "7d":
        return (now - timedelta(days=7)).strftime("%Y-%m-%dT%H:%M:%S"), now.strftime(
            "%Y-%m-%dT%H:%M:%S"
        )
    elif filter_by == "1m":
        return (now - timedelta(weeks=4)).strftime("%Y-%m-%dT%H:%M:%S"), now.strftime(
            "%Y-%m-%dT%H:%M:%S"
        )
    elif filter_by == "3m":
        return (now - timedelta(weeks=12)).strftime("%Y-%m-%dT%H:%M:%S"), now.strftime(
            "%Y-%m-%dT%H:%M:%S"
        )
    return None, None


@app.on_event("startup")
def create_indexes():
    collection.create_index("conversation_id")
    collection.create_index("datetime")
    collection.create_index([("tags", pymongo.TEXT)])
    collection.create_index("user")


class Status(str, Enum):
    ALL = "all"
    OK = "OK"
    MARKED = "Marked"
    NOT_READ = "Not Read"


class Sentiment(str, Enum):
    ALL = "all"
    POSITIVE = "Positive"
    NEGATIVE = "Negative"
    NEUTRAL = "Neutral"


class ConversationUpdate(BaseModel):
    summary: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[Status] = None
    sentiment: Optional[Sentiment] = None


class UpdateStatus(BaseModel):
    status: Status


class SummaryUpdate(BaseModel):
    summary: str


class TagsUpdate(BaseModel):
    tags: List[str]


@app.get("/conversations")
async def list_conversations(
    time_filter: str = "all",
    status_filter: Status = Status.ALL,
    search: Optional[str] = None,
    custom_start_date: Optional[str] = None,
    sentiment_filter: Sentiment = Sentiment.ALL,
):
    query = {}

    if time_filter != "all":
        start_time, end_time = get_time_range(time_filter)
        query["datetime"] = {"$gte": start_time, "$lt": end_time}
    elif custom_start_date:
        local_timezone = pytz.timezone("Europe/Madrid")
        start_of_day = local_timezone.localize(
            datetime.strptime(custom_start_date, "%Y-%m-%d"), is_dst=None
        )
        end_of_day = start_of_day + timedelta(days=1)
        start_time_utc = start_of_day.astimezone(pytz.utc).strftime("%Y-%m-%dT%H:%M:%S")
        end_time_utc = end_of_day.astimezone(pytz.utc).strftime("%Y-%m-%dT%H:%M:%S")

        query["datetime"] = {"$gte": start_time_utc, "$lt": end_time_utc}

    if status_filter != Status.ALL:
        query["status"] = status_filter.value

    if sentiment_filter != Sentiment.ALL:
        query["sentiment"] = sentiment_filter.value

    if search:
        query["$or"] = [
            {"user": {"$regex": search, "$options": "i"}},
            {"tags": {"$regex": search, "$options": "i"}},
            {"summary": {"$regex": search, "$options": "i"}},
        ]

    conversations = list(collection.find(query).sort("datetime", -1))
    return custom_jsonable_encoder(conversations)


@app.put("/conversations/{conversation_id}/state")
async def update_conversation_state(conversation_id: str, update: UpdateStatus):
    result = collection.update_one(
        {"conversation_id": conversation_id}, {"$set": {"status": update.status}}
    )
    if result.matched_count:
        return {"message": "Conversation updated successfully."}
    else:
        raise HTTPException(status_code=404, detail="Conversation not found")


@app.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str):
    conversation = collection.find_one({"conversation_id": conversation_id})
    if conversation:
        return custom_jsonable_encoder(conversation)
    raise HTTPException(status_code=404, detail="Conversation not found")


@app.patch("/conversations/{conversation_id}/summary")
async def update_summary(conversation_id: str, summary_data: SummaryUpdate):
    result = collection.update_one(
        {"conversation_id": conversation_id},
        {"$set": {"summary": summary_data.summary}},
    )
    if result.modified_count:
        return {"message": "Summary updated successfully."}
    raise HTTPException(
        status_code=404, detail="Conversation not found or no update needed."
    )


@app.patch("/conversations/{conversation_id}/tags")
async def update_tags(conversation_id: str, tags_data: TagsUpdate):
    result = collection.update_one(
        {"conversation_id": conversation_id}, {"$set": {"tags": tags_data.tags}}
    )
    if result.modified_count:
        return {"message": "Tags updated successfully."}
    raise HTTPException(
        status_code=404, detail="Conversation not found or no update needed."
    )


@app.post("/conversations/{conversation_id}/tags/add")
async def add_tag(conversation_id: str, tag: str):
    result = collection.update_one(
        {"conversation_id": conversation_id}, {"$addToSet": {"tags": tag}}
    )
    if result.modified_count:
        return {"message": "Tag added successfully."}
    raise HTTPException(
        status_code=404, detail="Conversation not found or tag already exists."
    )


@app.post("/conversations/{conversation_id}/tags/remove")
async def remove_tag(conversation_id: str, tag: str):
    result = collection.update_one(
        {"conversation_id": conversation_id}, {"$pull": {"tags": tag}}
    )
    if result.modified_count:
        return {"message": "Tag removed successfully."}
    raise HTTPException(
        status_code=404, detail="Conversation not found or tag did not exist."
    )
