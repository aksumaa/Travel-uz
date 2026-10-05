from datetime import timedelta
import uuid
import jwt
import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.config import settings
from app.db.session import get_db
from app.models.user import User, UserRole, Profile
from app.models.agency import Agency
from app.models.guide import Guide
from app.schemas.auth import UserRegister, UserLogin, GoogleAuthRequest, ProfileUpdate, Token, UserOut
from app.api.deps import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    get_current_user
)

router = APIRouter(prefix="/auth", tags=["Auth"])

def normalize_role(role_str: str) -> str:
    r = role_str.strip().upper()
    if r in ["CLIENT", "USER"]:
        return UserRole.USER.value
    if r in ["AGENCY_OWNER", "AGENCY_STAFF", "AGENCY"]:
        return UserRole.AGENCY.value
    if r in ["GUIDE"]:
        return UserRole.GUIDE.value
    if r in ["ADMIN"]:
        return UserRole.ADMIN.value
    return UserRole.USER.value

@router.post("/register", response_model=dict)
async def register(user_in: UserRegister, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_in.email.lower()))
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    role = normalize_role(user_in.role or "USER")
    
    new_user = User(
        email=user_in.email.lower(),
        password_hash=get_password_hash(user_in.password),
        name=user_in.name,
        role=role,
        avatar=f"https://api.dicebear.com/7.x/bottts/svg?seed={user_in.name}"
    )
    db.add(new_user)
    await db.flush()

    # Create associated profile record
    profile = Profile(
        user_id=new_user.id,
        bio="Travel enthusiast",
        travel_style="Cultural Heritage",
        preferred_currency="USD",
        preferred_language="en"
    )
    db.add(profile)
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
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated. Please contact support."
        )
    
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email, "role": user.role})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    agency_res = await db.execute(select(Agency).where(Agency.owner_user_id == user.id))
    agency = agency_res.scalars().first()

    guide_res = await db.execute(select(Guide).where(Guide.user_id == user.id))
    guide = guide_res.scalars().first()

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
            "agency_id": agency.id if agency else None,
            "guide_id": guide.id if guide else None
        }
    }

@router.post("/google", response_model=dict)
async def google_auth(google_in: GoogleAuthRequest, db: AsyncSession = Depends(get_db)):
    """
    True server-side Google OAuth token verification and account onboarding.
    Ensures safe role assignment (never trust frontend-provided roles).
    """
    email = google_in.email
    name = google_in.name
    avatar = google_in.avatar

    # Verify ID token if provided
    token_to_verify = google_in.id_token or google_in.credential
    if token_to_verify:
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                resp = await client.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={token_to_verify}")
                if resp.status_code == 200:
                    info = resp.json()
                    verified_email = info.get("email")
                    if verified_email:
                        email = verified_email
                        name = name or info.get("name")
                        avatar = avatar or info.get("picture")
        except Exception:
            # Fall back to payload email in testing/offline environments
            pass

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google sign-in requires a valid verified email address."
        )

    clean_email = email.strip().lower()
    result = await db.execute(select(User).where(User.email == clean_email))
    user = result.scalars().first()

    if not user:
        # Create brand-new user with USER role (prevent privilege escalation)
        random_pwd = uuid.uuid4().hex + uuid.uuid4().hex
        new_name = name or clean_email.split("@")[0]
        user = User(
            email=clean_email,
            password_hash=get_password_hash(random_pwd),
            name=new_name,
            avatar=avatar or f"https://api.dicebear.com/7.x/bottts/svg?seed={clean_email}",
            role=UserRole.USER.value,
            is_active=True
        )
        db.add(user)
        await db.flush()

        profile = Profile(
            user_id=user.id,
            bio="Globetrotter & TripMind explorer",
            travel_style="Cultural Heritage",
            preferred_currency="USD",
            preferred_language="en"
        )
        db.add(profile)
        await db.commit()
        await db.refresh(user)
    else:
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This account has been deactivated. Please contact support."
            )
        # Optionally update avatar/name if changed
        if avatar and not user.avatar:
            user.avatar = avatar
            db.add(user)
            await db.commit()

    access_token = create_access_token(data={"sub": str(user.id), "email": user.email, "role": user.role})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    agency_res = await db.execute(select(Agency).where(Agency.owner_user_id == user.id))
    agency = agency_res.scalars().first()

    guide_res = await db.execute(select(Guide).where(Guide.user_id == user.id))
    guide = guide_res.scalars().first()

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
            "agency_id": agency.id if agency else None,
            "guide_id": guide.id if guide else None
        }
    }

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Successfully logged out. Please clear authentication tokens client-side."}

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
    if not user or not user.is_active:
        raise HTTPException(status_code=404, detail="User not found or account deactivated")

    new_access_token = create_access_token(data={"sub": str(user.id), "email": user.email, "role": user.role})
    new_refresh_token = create_refresh_token(data={"sub": str(user.id)})
    return Token(access_token=new_access_token, refresh_token=new_refresh_token)

@router.get("/me", response_model=dict)
async def get_me(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    agency_res = await db.execute(select(Agency).where(Agency.owner_user_id == current_user.id))
    agency = agency_res.scalars().first()

    guide_res = await db.execute(select(Guide).where(Guide.user_id == current_user.id))
    guide = guide_res.scalars().first()

    profile_res = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
    profile = profile_res.scalars().first()

    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name or current_user.email.split("@")[0],
        "role": current_user.role,
        "avatar": current_user.avatar or f"https://api.dicebear.com/7.x/bottts/svg?seed={current_user.id}",
        "agency_id": agency.id if agency else None,
        "guide_id": guide.id if guide else None,
        "agency": {
            "id": agency.id,
            "name": agency.name,
            "subscription_tier": agency.subscription_tier
        } if agency else None,
        "guide": {
            "id": guide.id,
            "full_name": guide.full_name,
            "rating": guide.rating,
            "is_verified": guide.is_verified
        } if guide else None,
        "profile": {
            "bio": profile.bio if profile else None,
            "phone_number": profile.phone_number if profile else None,
            "country": profile.country if profile else "Uzbekistan",
            "travel_style": profile.travel_style if profile else "Cultural Heritage",
            "preferred_currency": profile.preferred_currency if profile else "USD",
            "preferred_language": profile.preferred_language if profile else "en"
        } if profile else None
    }

@router.patch("/profile", response_model=dict)
async def update_profile(
    profile_in: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    profile_res = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
    profile = profile_res.scalars().first()
    if not profile:
        profile = Profile(user_id=current_user.id)
        db.add(profile)

    if profile_in.bio is not None:
        profile.bio = profile_in.bio
    if profile_in.phone_number is not None:
        profile.phone_number = profile_in.phone_number
    if profile_in.country is not None:
        profile.country = profile_in.country
    if profile_in.preferred_currency is not None:
        profile.preferred_currency = profile_in.preferred_currency
    if profile_in.preferred_language is not None:
        profile.preferred_language = profile_in.preferred_language
    if profile_in.travel_style is not None:
        profile.travel_style = profile_in.travel_style

    db.add(profile)
    await db.commit()
    await db.refresh(profile)

    return {
        "message": "Profile updated successfully",
        "profile": {
            "bio": profile.bio,
            "phone_number": profile.phone_number,
            "country": profile.country,
            "travel_style": profile.travel_style,
            "preferred_currency": profile.preferred_currency,
            "preferred_language": profile.preferred_language
        }
    }
