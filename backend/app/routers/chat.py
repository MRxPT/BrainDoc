from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

from app.auth import get_current_user
from app.database import get_db
from app.models import AskRequest, AskResponse, ChatSessionResponse, ChatMessage
from app.rag_service import search_faiss, generate_answer

router = APIRouter(prefix="/chat", tags=["Chat"])


async def _get_ai_settings(user_id: str, db) -> tuple[str, str]:
    """Return (provider, api_key). Default to local flan-t5 if no key configured."""
    s = await db["user_settings"].find_one({"user_id": user_id})
    if s and s.get("api_key") and s["api_key"] != "local":
        return s.get("provider", "groq"), s["api_key"]
    return "local", ""


@router.post("/{doc_id}/ask", response_model=AskResponse)
async def ask_question(
    doc_id: str,
    body: AskRequest,
    current_user=Depends(get_current_user),
    db=Depends(get_db),
):
    user_id = str(current_user["_id"])

    # Verify document ownership and readiness
    doc = await db["documents"].find_one(
        {"_id": ObjectId(doc_id), "user_id": user_id}
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if doc.get("status") != "ready":
        raise HTTPException(
            status_code=400,
            detail=f"Document is still processing (status: {doc.get('status')}). "
                   "Please wait a moment and try again.",
        )

    # Get AI settings — local if no key configured
    provider, api_key = await _get_ai_settings(user_id, db)

    # Resolve or create chat session
    session_id = body.session_id
    session = None
    if session_id:
        try:
            session = await db["chat_sessions"].find_one(
                {"_id": ObjectId(session_id), "user_id": user_id}
            )
        except Exception:
            session = None

    if not session:
        new_session = {
            "user_id": user_id,
            "document_id": doc_id,
            "title": body.question[:60],
            "messages": [],
            "created_at": datetime.now(timezone.utc),
        }
        result = await db["chat_sessions"].insert_one(new_session)
        session_id = str(result.inserted_id)
        session = {**new_session, "_id": result.inserted_id}

    # Semantic search
    try:
        results = search_faiss(doc_id, body.question, top_k=6)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

    if not results:
        return AskResponse(
            answer="The uploaded PDF does not contain enough information to answer this.",
            session_id=session_id,
            sources=[],
        )

    context_chunks = [chunk for chunk, _ in results]
    sources = [
        (chunk[:200] + "...") if len(chunk) > 200 else chunk
        for chunk, _ in results[:3]
    ]

    # Generate answer
    try:
        answer = await generate_answer(
            question=body.question,
            context_chunks=context_chunks,
            chat_history=session.get("messages", []),
            provider=provider,
            api_key=api_key,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Answer generation failed: {str(e)}")

    # Persist messages
    now = datetime.now(timezone.utc)
    await db["chat_sessions"].update_one(
        {"_id": ObjectId(session_id)},
        {
            "$push": {
                "messages": {
                    "$each": [
                        {"role": "user", "content": body.question, "created_at": now},
                        {"role": "assistant", "content": answer, "created_at": now},
                    ]
                }
            }
        },
    )

    return AskResponse(answer=answer, session_id=session_id, sources=sources)


@router.get("/{doc_id}/sessions", response_model=list[ChatSessionResponse])
async def list_sessions(
    doc_id: str,
    current_user=Depends(get_current_user),
    db=Depends(get_db),
):
    cursor = db["chat_sessions"].find(
        {"document_id": doc_id, "user_id": str(current_user["_id"])}
    ).sort("created_at", -1)
    sessions = await cursor.to_list(length=50)
    return [_to_response(s) for s in sessions]


@router.get("/sessions/{session_id}", response_model=ChatSessionResponse)
async def get_session(
    session_id: str,
    current_user=Depends(get_current_user),
    db=Depends(get_db),
):
    session = await db["chat_sessions"].find_one(
        {"_id": ObjectId(session_id), "user_id": str(current_user["_id"])}
    )
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return _to_response(session)


@router.delete("/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session(
    session_id: str,
    current_user=Depends(get_current_user),
    db=Depends(get_db),
):
    result = await db["chat_sessions"].delete_one(
        {"_id": ObjectId(session_id), "user_id": str(current_user["_id"])}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Session not found")


def _to_response(s: dict) -> ChatSessionResponse:
    return ChatSessionResponse(
        id=str(s["_id"]),
        document_id=s["document_id"],
        title=s.get("title", "Chat"),
        messages=[
            ChatMessage(role=m["role"], content=m["content"], created_at=m["created_at"])
            for m in s.get("messages", [])
        ],
        created_at=s["created_at"],
    )
