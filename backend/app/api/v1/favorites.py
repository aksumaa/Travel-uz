from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional

from app.db.session import get_db
from app.models.user import User
from app.models.favorite import Favorite
from app.models.destination import Destination, Place
from app.models.package import Package
from app.models.trip import Trip
from app.schemas.favorite import FavoriteCreate, FavoriteOut, FavoriteToggleOut
from app.api.deps import get_current_user

router = APIRouter(prefix="/favorites", tags=["Favorites & Saved Vault"])

async def hydrate_entity_details(db: AsyncSession, entity_type: str, entity_id: int) -> dict:
    details = {}
    try:
        if entity_type == "destination":
            res = await db.execute(select(Destination).where(Destination.id == entity_id))
            d = res.scalars().first()
            if d:
                details = {"title": d.name, "image_url": d.image_url, "region": d.region, "budget_tier": d.budget_tier}
        elif entity_type == "place" or entity_type in ["hotel", "restaurant"]:
            res = await db.execute(select(Place).where(Place.id == entity_id))
            p = res.scalars().first()
            if p:
                details = {"title": p.name, "image_url": p.image_url, "entry_fee": p.entry_fee, "currency": p.currency}
        elif entity_type == "tour" or entity_type == "package":
            res = await db.execute(select(Package).where(Package.id == entity_id))
            pkg = res.scalars().first()
            if pkg:
                details = {"title": pkg.title, "price": pkg.price, "currency": pkg.currency, "days": pkg.days, "image_url": pkg.image_url}
        elif entity_type == "trip":
            res = await db.execute(select(Trip).where(Trip.id == entity_id))
            t = res.scalars().first()
            if t:
                details = {"title": t.title, "destination": t.destination, "days": t.duration_days, "estimated_budget": t.estimated_budget, "currency": t.currency}
    except Exception:
        pass
    return details

@router.post("", response_model=FavoriteToggleOut)
async def toggle_favorite(
    fav_in: FavoriteCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    norm_type = fav_in.entity_type.lower()
    res = await db.execute(
        select(Favorite).where(
            Favorite.user_id == current_user.id,
            Favorite.entity_type == norm_type,
            Favorite.entity_id == fav_in.entity_id
        )
    )
    existing = res.scalars().first()
    if existing:
        await db.delete(existing)
        await db.commit()
        return FavoriteToggleOut(saved=False, message=f"Removed {norm_type} from saved vault.")

    new_fav = Favorite(
        user_id=current_user.id,
        entity_type=norm_type,
        entity_id=fav_in.entity_id,
        notes=fav_in.notes,
        metadata_json=fav_in.metadata_json or {}
    )
    db.add(new_fav)
    await db.commit()
    await db.refresh(new_fav)

    details = await hydrate_entity_details(db, norm_type, fav_in.entity_id)

    fav_out = FavoriteOut(
        id=new_fav.id,
        user_id=new_fav.user_id,
        entity_type=new_fav.entity_type,
        entity_id=new_fav.entity_id,
        notes=new_fav.notes,
        metadata_json=new_fav.metadata_json,
        entity_details=details,
        created_at=new_fav.created_at
    )
    return FavoriteToggleOut(saved=True, message=f"Added {norm_type} to saved vault.", favorite=fav_out)

@router.get("", response_model=List[FavoriteOut])
async def list_favorites(
    entity_type: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Favorite).where(Favorite.user_id == current_user.id)
    if entity_type:
        query = query.where(Favorite.entity_type == entity_type.lower())

    query = query.order_by(Favorite.created_at.desc())
    res = await db.execute(query)
    favorites = res.scalars().all()

    out = []
    for f in favorites:
        details = await hydrate_entity_details(db, f.entity_type, f.entity_id)
        out.append(FavoriteOut(
            id=f.id,
            user_id=f.user_id,
            entity_type=f.entity_type,
            entity_id=f.entity_id,
            notes=f.notes,
            metadata_json=f.metadata_json,
            entity_details=details,
            created_at=f.created_at
        ))
    return out

@router.delete("/{favorite_id}")
async def delete_favorite(
    favorite_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Favorite).where(Favorite.id == favorite_id, Favorite.user_id == current_user.id)
    )
    fav = res.scalars().first()
    if not fav:
        raise HTTPException(status_code=404, detail="Favorite item not found.")

    await db.delete(fav)
    await db.commit()
    return {"message": "Favorite removed successfully"}

@router.delete("/{entity_type}/{entity_id}")
async def delete_favorite_by_entity(
    entity_type: str,
    entity_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Favorite).where(
            Favorite.user_id == current_user.id,
            Favorite.entity_type == entity_type.lower(),
            Favorite.entity_id == entity_id
        )
    )
    fav = res.scalars().first()
    if not fav:
        raise HTTPException(status_code=404, detail="Favorite item not found.")

    await db.delete(fav)
    await db.commit()
    return {"message": "Favorite removed successfully"}
