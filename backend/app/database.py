from motor.motor_asyncio import AsyncIOMotorClient
from app.config import get_settings

settings = get_settings()

client: AsyncIOMotorClient = None
db = None


async def connect_db():
    global client, db
    try:
        client = AsyncIOMotorClient(
            settings.mongo_uri,
            serverSelectionTimeoutMS=5000,  # 5s timeout — don't hang forever
        )
        db = client[settings.db_name]
        # Ping to verify connection
        await client.admin.command("ping")
        print(f"[DB] Connected to MongoDB: {settings.db_name}")
    except Exception as e:
        print(f"[DB] WARNING: MongoDB connection failed: {e}")
        print("[DB] App will start but DB operations will fail until MongoDB is reachable.")
        # Don't raise — let the app start so health checks pass


async def close_db():
    global client
    if client:
        client.close()
        print("[DB] MongoDB connection closed")


def get_db():
    return db
