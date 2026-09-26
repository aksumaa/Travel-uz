from datetime import timedelta
import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.config import settings
from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.agency import Agency
from app.schemas.auth import UserRegister, UserLogin, Token, UserOut
from app.api.deps import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    get_current_user
)

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=dict)
async def register(user_in: UserRegister, db: AsyncSession = Depends(get_db)):
    # Check if email exists
    result = await db.execute(select(User).where(User.email == user_in.email.lower()))
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    role = user_in.role if user_in.role in [UserRole.ADMIN, UserRole.AGENCY_OWNER, UserRole.AGENCY_STAFF, UserRole.CLIENT] else UserRole.AGENCY_OWNER
    
    new_user = User(
        email=user_in.email.lower(),
        password_hash=get_password_hash(user_in.password),
        name=user_in.name,
        role=role,
        avatar=f"https://api.dicebear.com/7.x/bottts/svg?seed={user_in.name}"
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    access_token = create_access_token(data={"sub": str(new_user.id), "email": new_user.email, "role": new_user.role})
    refresh_token = create_refresh_token(data={"sub": str(new_user.id)})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "name": new_user.name,
            "role": new_user.role,
            "avatar": new_user.avatar
        }
    }

@router.post("/login", response_model=dict)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == credentials.email.lower()))
    user = result.scalars().first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email, "role": user.role})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    # Fetch agency ID if associated
    agency_res = await db.execute(select(Agency).where(Agency.owner_user_id == user.id))
    agency = agency_res.scalars().first()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name or user.email.split("@")[0],
            "role": user.role,
            "avatar": user.avatar or f"https://api.dicebear.com/7.x/bottts/svg?seed={user.id}",
            "agency_id": agency.id if agency else None
        }
    }

@router.post("/refresh", response_model=Token)
async def refresh_token(refresh_token_str: str, db: AsyncSession = Depends(get_db)):
    try:
        payload = jwt.decode(refresh_token_str, settings.JWT_SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user_id = int(payload.get("sub"))
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_access_token = create_access_token(data={"sub": str(user.id), "email": user.email, "role": user.role})
    new_refresh_token = create_refresh_token(data={"sub": str(user.id)})
    return Token(access_token=new_access_token, refresh_token=new_refresh_token)

@router.get("/me", response_model=dict)
async def get_me(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    agency_res = await db.execute(select(Agency).where(Agency.owner_user_id == current_user.id))
    agency = agency_res.scalars().first()
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name or current_user.email.split("@")[0],
        "role": current_user.role,
        "avatar": current_user.avatar or f"https://api.dicebear.com/7.x/bottts/svg?seed={current_user.id}",
        "agency_id": agency.id if agency else None,
        "agency": {
            "id": agency.id,
            "name": agency.name,
            "subscription_tier": agency.subscription_tier
        } if agency else None
    }
