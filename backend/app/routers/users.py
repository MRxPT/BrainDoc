from fastapi import APIRouter, HTTPException, status, Depends
from app.models import UserResponse, UserUpdate
from app.auth import get_current_user
from app.database import get_db
from bson import ObjectId
from datetime import datetime, timezone

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
async def get_me(current_user=Depends(get_current_user)):
    return UserResponse(
        id=str(current_user["_id"]),
        username=current_user["username"],
        email=current_user["email"],
        created_at=current_user["created_at"],
    )


@router.put("/me", response_model=UserResponse)
async def update_me(
    update_data: UserUpdate,
    current_user=Depends(get_current_user),
    db=Depends(get_db),
):
    updates = {k: v for k, v in update_data.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update",
        )

    # Check uniqueness if email or username is being changed
    if "email" in updates:
        existing = await db["users"].find_one(
            {"email": updates["email"], "_id": {"$ne": current_user["_id"]}}
        )
        if existing:
            raise HTTPException(status_code=400, detail="Email already in use")

    if "username" in updates:
        existing = await db["users"].find_one(
            {"username": updates["username"], "_id": {"$ne": current_user["_id"]}}
        )
        if existing:
            raise HTTPException(status_code=400, detail="Username already taken")

    await db["users"].update_one(
        {"_id": current_user["_id"]}, {"$set": updates}
    )
    updated = await db["users"].find_one({"_id": current_user["_id"]})
    return UserResponse(
        id=str(updated["_id"]),
        username=updated["username"],
        email=updated["email"],
        created_at=updated["created_at"],
    )


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_me(current_user=Depends(get_current_user), db=Depends(get_db)):
    await db["users"].delete_one({"_id": current_user["_id"]})
