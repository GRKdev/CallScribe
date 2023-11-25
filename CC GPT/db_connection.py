from pymongo import MongoClient
import os
import dotenv

dotenv.load_dotenv()

MONGO_URI = os.environ["MONGO_URI"]

client = MongoClient(
    MONGO_URI,
)

db = client.callcenter
processed_files_collection = db.processed_files
