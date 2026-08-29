from pymongo import MongoClient
from .config import settings


client = MongoClient(settings.MONGODB_URI)

db = client["Cataract_Detection"]


def connect_to_mongodb():
    try:
        client.admin.command("ping")
        print("MongoDB Atlas connected successfully!")
        print("Database: Cataract_Detection")
    except Exception as e:
        print(f"MongoDB connection failed: {e}")
        raise


def close_mongodb_connection():
    client.close()
    print("MongoDB connection closed")


def get_database():
    return db