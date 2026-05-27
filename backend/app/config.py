from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List


class Settings(BaseSettings):
    mongo_uri: str = "mongodb://localhost:27017"
    db_name: str = "fullstack_app"
    secret_key: str = "your-super-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    openai_api_key: str = ""
    upload_dir: str = "uploads"
    faiss_index_dir: str = "faiss_indexes"
    # Production: set FRONTEND_URL to your Vercel/Netlify URL
    frontend_url: str = ""

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
