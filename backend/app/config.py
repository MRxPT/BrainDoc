from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    mongo_uri: str = "mongodb://localhost:27017"
    db_name: str = "fullstack_app"
    secret_key: str = "your-super-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    openai_api_key: str = ""
    # Use /tmp on Render (ephemeral), local paths in dev
    upload_dir: str = "/tmp/uploads" if os.environ.get("RENDER") else "uploads"
    faiss_index_dir: str = "/tmp/faiss_indexes" if os.environ.get("RENDER") else "faiss_indexes"
    frontend_url: str = ""

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
