from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import or_, func
from typing import List, Optional

from app.db.session import get_db
from app.models.user import User
from app.models.destination import Destination, Category, Place, SavedDestination
from app.models.guide import Guide
from app.models.package import Package
from app.models.trip import CommunityTrip
from app.models.review import Review
from app.schemas.destination import (
    DestinationListItem, DestinationDetailOut, CategoryOut, PlaceOut,
    SavedDestinationOut, UnifiedSearchResponse, SearchResultItem
)
from app.api.deps import get_current_user, get_current_user_optional

router = APIRouter(tags=["Destinations & Places"])

@router.get("/categories", response_model=List[CategoryOut])
async def list_categories(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Category).order_by(Category.name.asc()))
    return res.scalars().all()

@router.get("/destinations", response_model=List[DestinationListItem])
async def list_destinations(
    category: Optional[str] = Query(None, description="Category slug"),
    region: Optional[str] = Query(None, description="Region name"),
    budget_tier: Optional[str] = Query(None, description="budget, moderate, luxury"),
    search: Optional[str] = Query(None, description="Search term in name or description"),
    is_featured: Optional[bool] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    query = select(Destination).options(selectinload(Destination.category))

    if category:
        query = query.join(Category, Destination.category_id == Category.id).where(Category.slug == category.lower())
    if region:
        query = query.where(Destination.region.ilike(f"%{region}%"))
    if budget_tier:
        query = query.where(Destination.budget_tier == budget_tier.lower())
    if is_featured is not None:
        query = query.where(Destination.is_featured == is_featured)
    if search:
        query = query.where(
            or_(
                Destination.name.ilike(f"%{search}%"),
                Destination.description.ilike(f"%{search}%"),
                Destination.region.ilike(f"%{search}%")
            )
        )

    query = query.order_by(Destination.is_featured.desc(), Destination.id.asc()).offset(offset).limit(limit)
    res = await db.execute(query)
    destinations = res.scalars().all()

    # Calculate review ratings for each destination
    results = []
    for d in destinations:
        rev_res = await db.execute(
            select(func.avg(Review.rating), func.count(Review.id))
            .where(Review.destination_id == d.id)
        )
        avg_r, cnt_r = rev_res.first()
        rating = round(float(avg_r), 1) if avg_r else 4.9
        reviews_count = cnt_r or 0

        item = DestinationListItem(
            id=d.id,
            name=d.name,
            slug=d.slug,
            region=d.region,
            description=d.description,
            latitude=d.latitude,
            longitude=d.longitude,
            budget_tier=d.budget_tier,
            average_cost_per_day=d.average_cost_per_day,
            recommended_duration_days=d.recommended_duration_days,
            best_season=d.best_season,
            image_url=d.image_url,
            is_featured=d.is_featured,
            rating=rating,
            reviews_count=reviews_count,
            category=CategoryOut.model_validate(d.category) if d.category else None
        )
        results.append(item)

    return results

@router.get("/destinations/{slug}", response_model=DestinationDetailOut)
async def get_destination_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(
        select(Destination)
        .options(
            selectinload(Destination.category),
            selectinload(Destination.places)
        )
        .where(Destination.slug == slug)
    )
    d = res.scalars().first()
    if not d:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Destination '{slug}' not found.")

    rev_res = await db.execute(
        select(func.avg(Review.rating), func.count(Review.id))
        .where(Review.destination_id == d.id)
    )
    avg_r, cnt_r = rev_res.first()

    return DestinationDetailOut(
        id=d.id,
        name=d.name,
        slug=d.slug,
        region=d.region,
        description=d.description,
        latitude=d.latitude,
        longitude=d.longitude,
        budget_tier=d.budget_tier,
        average_cost_per_day=d.average_cost_per_day,
        recommended_duration_days=d.recommended_duration_days,
        best_season=d.best_season,
        image_url=d.image_url,
        gallery=d.gallery or [],
        is_featured=d.is_featured,
        rating=round(float(avg_r), 1) if avg_r else 4.9,
        reviews_count=cnt_r or 0,
        category=CategoryOut.model_validate(d.category) if d.category else None,
        places=[PlaceOut.model_validate(p) for p in d.places],
        created_at=d.created_at,
        updated_at=d.updated_at
    )

@router.post("/destinations/{destination_id}/save")
async def toggle_save_destination(
    destination_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Check if already saved
    res = await db.execute(
        select(SavedDestination).where(
            SavedDestination.user_id == current_user.id,
            SavedDestination.destination_id == destination_id
        )
    )
    saved = res.scalars().first()
    if saved:
        await db.delete(saved)
        await db.commit()
        return {"saved": False, "message": "Destination removed from saved list."}
    
    # Check destination exists
    d_res = await db.execute(select(Destination).where(Destination.id == destination_id))
    dest = d_res.scalars().first()
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")

    new_saved = SavedDestination(user_id=current_user.id, destination_id=destination_id)
    db.add(new_saved)
    await db.commit()
    return {"saved": True, "message": "Destination saved successfully."}

@router.get("/saved/destinations", response_model=List[SavedDestinationOut])
async def list_saved_destinations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(SavedDestination)
        .options(selectinload(SavedDestination.destination).selectinload(Destination.category))
        .where(SavedDestination.user_id == current_user.id)
        .order_by(SavedDestination.created_at.desc())
    )
    items = res.scalars().all()
    out = []
    for item in items:
        d = item.destination
        out.append(SavedDestinationOut(
            id=item.id,
            user_id=item.user_id,
            destination_id=item.destination_id,
            notes=item.notes,
            created_at=item.created_at,
            destination=DestinationListItem(
                id=d.id,
                name=d.name,
                slug=d.slug,
                region=d.region,
                description=d.description,
                latitude=d.latitude,
                longitude=d.longitude,
                budget_tier=d.budget_tier,
                average_cost_per_day=d.average_cost_per_day,
                recommended_duration_days=d.recommended_duration_days,
                best_season=d.best_season,
                image_url=d.image_url,
                is_featured=d.is_featured,
                category=CategoryOut.model_validate(d.category) if d.category else None
            )
        ))
    return out

@router.get("/places", response_model=List[PlaceOut])
async def list_places(
    destination_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
):
    q = select(Place)
    if destination_id:
        q = q.where(Place.destination_id == destination_id)
    q = q.order_by(Place.name.asc())
    res = await db.execute(q)
    return res.scalars().all()

@router.get("/places/{slug}", response_model=PlaceOut)
async def get_place_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Place).where(Place.slug == slug))
    p = res.scalars().first()
    if not p:
        raise HTTPException(status_code=404, detail="Place not found")
    return p

@router.get("/search", response_model=UnifiedSearchResponse)
async def unified_search(
    q: str = Query(..., min_length=2, description="Search query string"),
    db: AsyncSession = Depends(get_db)
):
    query_str = f"%{q.strip()}%"

    # Search destinations
    d_res = await db.execute(
        select(Destination).where(
            or_(
                Destination.name.ilike(query_str),
                Destination.region.ilike(query_str),
                Destination.description.ilike(query_str)
            )
        ).limit(10)
    )
    destinations = [
        SearchResultItem(
            id=d.id,
            type="destination",
            title=d.name,
            subtitle=d.region,
            description=d.description[:140] + "...",
            image_url=d.image_url,
            slug=d.slug,
            price=d.average_cost_per_day
        )
        for d in d_res.scalars().all()
    ]

    # Search places
    p_res = await db.execute(
        select(Place).where(
            or_(
                Place.name.ilike(query_str),
                Place.description.ilike(query_str)
            )
        ).limit(10)
    )
    places = [
        SearchResultItem(
            id=p.id,
            type="place",
            title=p.name,
            subtitle=f"Entry: ${p.entry_fee} USD",
            description=p.description[:140] + "...",
            image_url=p.image_url,
            slug=p.slug,
            price=p.entry_fee
        )
        for p in p_res.scalars().all()
    ]

    # Search guides
    g_res = await db.execute(
        select(Guide).where(
            or_(
                Guide.full_name.ilike(query_str),
                Guide.cities_covered.ilike(query_str),
                Guide.languages.ilike(query_str)
            )
        ).limit(10)
    )
    guides = [
        SearchResultItem(
            id=g.id,
            type="guide",
            title=g.full_name,
            subtitle=f"{g.cities_covered} | {g.languages}",
            description=g.bio[:140] + "...",
            image_url=g.avatar_url,
            price=g.daily_rate,
            rating=g.rating
        )
        for g in g_res.scalars().all()
    ]

    # Search packages
    pkg_res = await db.execute(
        select(Package).where(
            or_(
                Package.title.ilike(query_str),
                Package.destination.ilike(query_str)
            )
        ).limit(10)
    )
    packages = [
        SearchResultItem(
            id=pkg.id,
            type="package",
            title=pkg.title,
            subtitle=f"{pkg.days} Days in {pkg.destination}",
            description=(pkg.description or "")[:140] + "...",
            image_url=pkg.image_url,
            slug=pkg.slug,
            price=pkg.price
        )
        for pkg in pkg_res.scalars().all()
    ]

    # Search community trips
    ct_res = await db.execute(
        select(CommunityTrip).where(
            or_(
                CommunityTrip.title.ilike(query_str),
                CommunityTrip.destination.ilike(query_str),
                CommunityTrip.description.ilike(query_str)
            )
        ).limit(10)
    )
    community_trips = [
        SearchResultItem(
            id=c.id,
            type="community_trip",
            title=c.title,
            subtitle=f"Destination: {c.destination} ({c.current_participants_count}/{c.max_participants} joined)",
            description=c.description[:140] + "...",
            price=c.estimated_cost_per_person
        )
        for c in ct_res.scalars().all()
    ]

    total = len(destinations) + len(places) + len(guides) + len(packages) + len(community_trips)
    return UnifiedSearchResponse(
        query=q,
        total_results=total,
        destinations=destinations,
        places=places,
        guides=guides,
        packages=packages,
        community_trips=community_trips
    )
