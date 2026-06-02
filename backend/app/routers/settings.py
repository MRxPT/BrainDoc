from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.auth import get_current_user
from app.database import get_db

router = APIRouter(prefix="/settings", tags=["Settings"])

VALID_PROVIDERS = {"openai", "groq", "gemini", "local"}


class AISettingsIn(BaseModel):
    provider: str
    api_key: Optional[str] = None   # None = keep existing key, just update provider


class AISettingsOut(BaseModel):
    provider: str
    api_key_preview: Optional[str] = None
    is_configured: bool


def _preview(key: str) -> str:
    if not key or key == "local":
        return None
    return key[:6] + "••••••••" + key[-4:] if len(key) > 10 else "••••••••"


@router.get("/ai", response_model=AISettingsOut)
async def get_ai_settings(current_user=Depends(get_current_user), db=Depends(get_db)):
    s = await db["user_settings"].find_one({"user_id": str(current_user["_id"])})
    if not s or not s.get("api_key"):
        return AISettingsOut(provider="groq", api_key_preview=None, is_configured=False)
    return AISettingsOut(
        provider=s.get("provider", "groq"),
        api_key_preview=_preview(s["api_key"]),
        is_configured=True,
    )


@router.post("/ai", response_model=AISettingsOut)
async def save_ai_settings(
    body: AISettingsIn,
    current_user=Depends(get_current_user),
    db=Depends(get_db),
):
    if body.provider not in VALID_PROVIDERS:
        raise HTTPException(status_code=400, detail=f"Invalid provider. Choose: {', '.join(VALID_PROVIDERS)}")

    user_id = str(current_user["_id"])

    if body.provider == "local":
        # Local needs no key
        await db["user_settings"].update_one(
            {"user_id": user_id},
            {"$set": {"provider": "local", "api_key": "local"}},
            upsert=True,
        )
        return AISettingsOut(provider="local", api_key_preview=None, is_configured=True)

    # For cloud providers: use new key if provided, else keep existing
    if body.api_key and body.api_key.strip() and body.api_key.strip() != "local":
        new_key = body.api_key.strip()
        await db["user_settings"].update_one(
            {"user_id": user_id},
            {"$set": {"provider": body.provider, "api_key": new_key}},
            upsert=True,
        )
        return AISettingsOut(
            provider=body.provider,
            api_key_preview=_preview(new_key),
            is_configured=True,
        )
    else:
        # No new key — just update the provider, keep existing key
        existing = await db["user_settings"].find_one({"user_id": user_id})
        if not existing or not existing.get("api_key"):
            raise HTTPException(
                status_code=400,
                detail=f"No API key found. Please enter your {body.provider} API key."
            )
        await db["user_settings"].update_one(
            {"user_id": user_id},
            {"$set": {"provider": body.provider}},
        )
        return AISettingsOut(
            provider=body.provider,
            api_key_preview=_preview(existing["api_key"]),
            is_configured=True,
        )


@router.delete("/ai", status_code=204)
async def delete_ai_settings(current_user=Depends(get_current_user), db=Depends(get_db)):
    await db["user_settings"].delete_one({"user_id": str(current_user["_id"])})
