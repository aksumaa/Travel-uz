from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import or_, and_, func
from typing import List, Optional

from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.guide import Guide
from app.models.review import Review
from app.schemas.guide import GuideProfileCreate, GuideProfileUpdate, GuideProfileOut
from app.api.deps import get_current_user

router = APIRouter(prefix="/guides", tags=["Tour Guides"])

@router.get("", response_model=List[GuideProfileOut])
async def list_guides(
    city: Optional[str] = None,
    language: Optional[str] = None,
    min_rating: Optional[float] = None,
    verified_only: bool = False,
    db: AsyncSession = Depends(get_db)
):
    query = select(Guide).options(selectinload(Guide.user))
    if verified_only:
        query = query.where(Guide.is_verified == True)
    if city:
        query = query.where(Guide.cities_covered.ilike(f"%{city}%"))
    if language:
        query = query.where(Guide.languages.ilike(f"%{language}%"))
    if min_rating:
        query = query.where(Guide.rating >= min_rating)

    query = query.order_by(Guide.rating.desc(), Guide.reviews_count.desc())
    res = await db.execute(query)
    guides = res.scalars().all()

    out = []
    for g in guides:
        out.append(GuideProfileOut(
            id=g.id,
            user_id=g.user_id,
            name=g.full_name,
            photo=g.avatar_url,
            bio=g.bio,
            languages=g.languages,
            location=g.cities_covered,
            specialties="Silk Road History, Architecture, Local Cuisine",
            experience=f"{g.experience_years}+ years licensed guide",
            price_per_day=g.daily_rate,
            currency=g.currency,
            rating=g.rating,
            review_count=g.reviews_count,
            availability="available",
            services=[
                {"id": "s-1", "name": "Old City Walking Tour", "duration": "4h", "price": g.daily_rate * 0.6},
                {"id": "s-2", "name": "Full Day Historical Immersion", "duration": "8h", "price": g.daily_rate}
            ],
            created_at=g.created_at
        ))
    return out

@router.get("/{guide_id}", response_model=GuideProfileOut)
async def get_guide(guide_id: int, db: AsyncSession = Depends(get_db)):
    res = await db.execute(
        select(Guide).options(selectinload(Guide.user)).where(Guide.id == guide_id)
    )
    g = res.scalars().first()
    if not g:
        raise HTTPException(status_code=404, detail="Guide not found")

    return GuideProfileOut(
        id=g.id,
        user_id=g.user_id,
        name=g.full_name,
        photo=g.avatar_url,
        bio=g.bio,
        languages=g.languages,
        location=g.cities_covered,
        specialties="Silk Road History, Architecture, Local Cuisine",
        experience=f"{g.experience_years}+ years licensed guide",
        price_per_day=g.daily_rate,
        currency=g.currency,
        rating=g.rating,
        review_count=g.reviews_count,
        availability="available",
        services=[
            {"id": "s-1", "name": "Old City Walking Tour", "duration": "4h", "price": g.daily_rate * 0.6},
            {"id": "s-2", "name": "Full Day Historical Immersion", "duration": "8h", "price": g.daily_rate}
        ],
        created_at=g.created_at
    )

@router.post("", response_model=GuideProfileOut)
async def register_guide_profile(
    guide_in: GuideProfileCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Check if guide profile already exists
    res = await db.execute(select(Guide).where(Guide.user_id == current_user.id))
    if res.scalars().first():
        raise HTTPException(status_code=400, detail="User already has a registered guide profile.")

    # Upgrade role to GUIDE if USER
    if current_user.role == UserRole.USER.value:
        current_user.role = UserRole.GUIDE.value
        db.add(current_user)

    new_guide = Guide(
        user_id=current_user.id,
        full_name=guide_in.name,
        bio=guide_in.bio or f"Professional licensed tour guide based in {guide_in.location}",
        languages=guide_in.languages,
        cities_covered=guide_in.location,
        daily_rate=guide_in.price_per_day,
        currency=guide_in.currency or "USD",
        avatar_url=guide_in.photo or current_user.avatar,
        is_verified=True
    )
    db.add(new_guide)
    await db.commit()
    await db.refresh(new_guide)

    return GuideProfileOut(
        id=new_guide.id,
        user_id=new_guide.user_id,
        name=new_guide.full_name,
        photo=new_guide.avatar_url,
        bio=new_guide.bio,
        languages=new_guide.languages,
        location=new_guide.cities_covered,
        specialties=guide_in.specialties,
        experience=guide_in.experience,
        price_per_day=new_guide.daily_rate,
        currency=new_guide.currency,
        rating=new_guide.rating,
        review_count=new_guide.reviews_count,
        availability="available",
        services=guide_in.services or [],
        created_at=new_guide.created_at
    )

@router.patch("/{guide_id}", response_model=GuideProfileOut)
async def update_guide_profile(
    guide_id: int,
    guide_in: GuideProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Guide).where(Guide.id == guide_id))
    g = res.scalars().first()
    if not g:
        raise HTTPException(status_code=404, detail="Guide not found")

    # Server-side Authorization: Guide cannot modify another guide!
    if g.user_id != current_user.id and current_user.role != UserRole.ADMIN.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: You cannot modify another guide's profile."
        )

    if guide_in.name is not None:
        g.full_name = guide_in.name
    if guide_in.bio is not None:
        g.bio = guide_in.bio
    if guide_in.languages is not None:
        g.languages = guide_in.languages
    if guide_in.location is not None:
        g.cities_covered = guide_in.location
    if guide_in.price_per_day is not None:
        g.daily_rate = guide_in.price_per_day
    if guide_in.currency is not None:
        g.currency = guide_in.currency
    if guide_in.photo is not None:
        g.avatar_url = guide_in.photo

    db.add(g)
    await db.commit()
    await db.refresh(g)

    return GuideProfileOut(
        id=g.id,
        user_id=g.user_id,
        name=g.full_name,
        photo=g.avatar_url,
        bio=g.bio,
        languages=g.languages,
        location=g.cities_covered,
        specialties=guide_in.specialties,
        experience=guide_in.experience or f"{g.experience_years}+ years licensed guide",
        price_per_day=g.daily_rate,
        currency=g.currency,
        rating=g.rating,
        review_count=g.reviews_count,
        availability="available",
        services=guide_in.services or [],
        created_at=g.created_at
    )
