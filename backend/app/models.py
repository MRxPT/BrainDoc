from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[str] = None


class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None


# ── Document / RAG models ──────────────────────────────────────────────────────

class DocumentResponse(BaseModel):
    id: str
    filename: str
    original_name: str
    size: int
    chunk_count: int
    status: str          # "processing" | "ready" | "error"
    created_at: datetime


class ChatMessage(BaseModel):
    role: str            # "user" | "assistant"
    content: str
    created_at: datetime


class ChatSessionResponse(BaseModel):
    id: str
    document_id: str
    title: str
    messages: List[ChatMessage] = []
    created_at: datetime


class AskRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=2000)
    session_id: Optional[str] = None   # if None, creates a new session


class AskResponse(BaseModel):
    answer: str
    session_id: str
    sources: List[str] = []            # relevant chunk excerpts
