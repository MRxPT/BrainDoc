from fastapi import APIRouter, HTTPException, status, Depends
from datetime import timedelta
from app.models import UserCreate, UserLogin, Token, UserResponse
from app.auth import hash_password, verify_password, create_access_token
from app.database import get_db
from app.config import get_settings
from datetime import datetime, timezone

router = APIRouter(prefix="/auth", tags=["Authentication"])
settings = get_settings()


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate, db=Depends(get_db)):
    # Check if email already exists
    existing = await db["users"].find_one({"email": user_data.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Check if username already exists
    existing_username = await db["users"].find_one({"username": user_data.username})
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken",
        )

    new_user = {
        "username": user_data.username,
        "email": user_data.email,
        "password": hash_password(user_data.password),
        "created_at": datetime.now(timezone.utc),
    }
    result = await db["users"].insert_one(new_user)
    created = await db["users"].find_one({"_id": result.inserted_id})

    return UserResponse(
        id=str(created["_id"]),
        username=created["username"],
        email=created["email"],
        created_at=created["created_at"],
    )


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db=Depends(get_db)):
    user = await db["users"].find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(
        data={"sub": str(user["_id"])},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )
    return Token(access_token=token)
