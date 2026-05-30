+
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pathlib import Path

from app.database import connect_db, close_db
from app.routers import auth, users
from app.routers import documents, chat
from app.routers import settings as settings_router
from app.config import get_settings

app_settings = get_settings()

# Allowed frontend origins
_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://brain-doc.vercel.app",
]

if app_settings.frontend_url:
    _origins.append(app_settings.frontend_url)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create storage directories
    try:
        Path(app_settings.upload_dir).mkdir(parents=True, exist_ok=True)
        Path(app_settings.faiss_index_dir).mkdir(parents=True, exist_ok=True)
    except Exception as e:
        print(f"[Startup] Directory creation warning: {e}")

    # Connect MongoDB
    await connect_db()

    # Preload embedding model locally only
    if not os.environ.get("RENDER"):
        import asyncio

        try:
            from app.rag_service import get_embedder

            loop = asyncio.get_running_loop()
            await loop.run_in_executor(None, get_embedder)

            print("[Startup] Embedding model pre-warmed.")

        except Exception as e:
            print(f"[Startup] Embedding pre-warm skipped: {e}")

    else:
        print("[Startup] Render detected — embedding model will load on first use.")

    yield

    await close_db()


app = FastAPI(
    title="BrainDoc API",
    description="AI-powered PDF document intelligence — RAG + semantic search",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(documents.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(settings_router.router, prefix="/api")


@app.get("/")
async def root():
    return {
        "message": "BrainDoc API is running",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "ok"}

