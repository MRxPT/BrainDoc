import shutil
import asyncio
import traceback
from pathlib import Path
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status, BackgroundTasks
from bson import ObjectId

from app.auth import get_current_user
from app.database import get_db, client as mongo_client
from app.models import DocumentResponse
from app.config import get_settings
from app.rag_service import extract_text_from_pdf_bytes, chunk_text, build_faiss_index

router = APIRouter(prefix="/documents", tags=["Documents"])
settings = get_settings()

ALLOWED_TYPES = {
    "application/pdf",
    "application/octet-stream",   # Some browsers send this for PDFs
    "application/x-pdf",
    "binary/octet-stream",
}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB — scanned PDFs can be large


def _process_document_sync(doc_id: str, content: bytes, db_name: str):
    """
    Pure sync background worker — runs in a thread via asyncio.to_thread.
    Gets its own Motor client so it's not tied to the request's DB session.
    """
    import motor.motor_asyncio

    async def _run():
        # Own DB connection for this background job
        _client = motor.motor_asyncio.AsyncIOMotorClient(settings.mongo_uri)
        _db = _client[db_name]
        try:
            print(f"[RAG] Processing document {doc_id}...")
            text = extract_text_from_pdf_bytes(content)
            chunks = chunk_text(text, chunk_size=500, overlap=50)
            count = build_faiss_index(doc_id, chunks)
            await _db["documents"].update_one(
                {"_id": ObjectId(doc_id)},
                {"$set": {"status": "ready", "chunk_count": count}},
            )
            print(f"[RAG] Document {doc_id} ready — {count} chunks.")
        except Exception as e:
            err_msg = str(e)
            print(f"[RAG] ERROR processing {doc_id}: {err_msg}")
            traceback.print_exc()
            await _db["documents"].update_one(
                {"_id": ObjectId(doc_id)},
                {"$set": {"status": "error", "error": err_msg}},
            )
        finally:
            _client.close()

    # Run the async work inside a fresh event loop in this thread
    asyncio.run(_run())


@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
    db=Depends(get_db),
):
    # Accept if .pdf extension OR a known PDF MIME type (browsers vary on Windows)
    is_pdf_by_ext = (file.filename or "").lower().endswith(".pdf")
    is_pdf_by_mime = file.content_type in ALLOWED_TYPES
    if not is_pdf_by_ext and not is_pdf_by_mime:
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 50 MB)")

    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)

    # Insert DB record first to get the ID
    doc = {
        "user_id": str(current_user["_id"]),
        "original_name": file.filename,
        "size": len(content),
        "chunk_count": 0,
        "status": "processing",
        "created_at": datetime.now(timezone.utc),
    }
    result = await db["documents"].insert_one(doc)
    doc_id = str(result.inserted_id)

    # Ephemeral RAG: Skip writing PDF to disk
    # file_path = str(upload_dir / f"{doc_id}.pdf")
    # with open(file_path, "wb") as f:
    #     f.write(content)

    await db["documents"].update_one(
        {"_id": result.inserted_id},
        {"$set": {"filename": f"{doc_id}.pdf"}},
    )

    # Run processing in a background thread (not blocking the event loop)
    background_tasks.add_task(
        _process_document_sync, doc_id, content, settings.db_name
    )

    return DocumentResponse(
        id=doc_id,
        filename=f"{doc_id}.pdf",
        original_name=file.filename,
        size=len(content),
        chunk_count=0,
        status="processing",
        created_at=doc["created_at"],
    )


@router.get("/", response_model=list[DocumentResponse])
async def list_documents(current_user=Depends(get_current_user), db=Depends(get_db)):
    cursor = db["documents"].find(
        {"user_id": str(current_user["_id"])}
    ).sort("created_at", -1)
    docs = await cursor.to_list(length=100)
    return [_to_response(d) for d in docs]


@router.get("/{doc_id}", response_model=DocumentResponse)
async def get_document(
    doc_id: str,
    current_user=Depends(get_current_user),
    db=Depends(get_db),
):
    doc = await db["documents"].find_one(
        {"_id": ObjectId(doc_id), "user_id": str(current_user["_id"])}
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return _to_response(doc)


@router.delete("/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    doc_id: str,
    current_user=Depends(get_current_user),
    db=Depends(get_db),
):
    doc = await db["documents"].find_one(
        {"_id": ObjectId(doc_id), "user_id": str(current_user["_id"])}
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    file_path = Path(settings.upload_dir) / f"{doc_id}.pdf"
    if file_path.exists():
        file_path.unlink()

    faiss_dir = Path(settings.faiss_index_dir) / doc_id
    if faiss_dir.exists():
        shutil.rmtree(faiss_dir)

    await db["documents"].delete_one({"_id": ObjectId(doc_id)})
    await db["chat_sessions"].delete_many({"document_id": doc_id})

    # Evict from in-memory FAISS cache
    from app.rag_service import _faiss_cache
    _faiss_cache.pop(doc_id, None)


def _to_response(d: dict) -> DocumentResponse:
    return DocumentResponse(
        id=str(d["_id"]),
        filename=d.get("filename", ""),
        original_name=d.get("original_name", ""),
        size=d.get("size", 0),
        chunk_count=d.get("chunk_count", 0),
        status=d.get("status", "processing"),
        created_at=d["created_at"],
    )
