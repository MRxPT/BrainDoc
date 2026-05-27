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

# Build allowed origins — always include localhost for dev,
# plus any FRONTEND_URL set in production environment
_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://localhost:5175",
]
if app_settings.frontend_url:
    _origins.append(app_settings.frontend_url)


async def _warm_embedder():
    """Pre-load embeddings without blocking API startup (auth, login, etc.)."""
    import asyncio
    from app.rag_service import get_embedder

    try:
        loop = asyncio.get_running_loop()
        await loop.run_in_executor(None, get_embedder)
        print("[Startup] Embedding model pre-warmed.")
    except Exception as exc:
        print(f"[Startup] Embedding pre-warm skipped: {exc}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    import asyncio

    Path(app_settings.upload_dir).mkdir(parents=True, exist_ok=True)
    Path(app_settings.faiss_index_dir).mkdir(parents=True, exist_ok=True)
    await connect_db()

    warm_task = asyncio.create_task(_warm_embedder())

    yield

    warm_task.cancel()
    await close_db()


app = FastAPI(
    title="AI Document Search API",
    description="RAG Chatbot — FastAPI + LangChain + FAISS + OpenAI",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(documents.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(settings_router.router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "AI Document Search API is running", "docs": "/docs"}
