from fastapi import APIRouter, Depends, HTTPException, Query, status, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import func
from typing import List, Optional, Any

from app.db.session import get_db
from app.models.user import User
from app.models.destination import Destination, Place
from app.models.guide import Guide
from app.models.agency import Agency
from app.models.review import Review
from app.api.deps import get_current_user
from app.services.notification_service import create_notification

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.get("", response_model=List[dict])
async def list_reviews(
    destination_id: Optional[int] = None,
    place_id: Optional[int] = None,
    guide_id: Optional[int] = None,
    agency_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Review).options(selectinload(Review.user))
    if destination_id:
        query = query.where(Review.destination_id == destination_id)
    if place_id:
        query = query.where(Review.place_id == place_id)
    if guide_id:
        query = query.where(Review.guide_id == guide_id)
    if agency_id:
        query = query.where(Review.agency_id == agency_id)

    query = query.order_by(Review.created_at.desc())
    res = await db.execute(query)
    reviews = res.scalars().all()

    return [
        {
            "id": r.id,
            "user_id": r.user_id,
            "user_name": r.user.name if r.user else "Traveler",
            "user_avatar": r.user.avatar if r.user else None,
            "destination_id": r.destination_id,
            "place_id": r.place_id,
            "guide_id": r.guide_id,
            "agency_id": r.agency_id,
            "rating": r.rating,
            "comment": r.comment,
            "text": r.comment,
            "created_at": r.created_at.isoformat()
        }
        for r in reviews
    ]

@router.post("", response_model=dict)
async def create_review(
    review_in: Any = Body(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    data = review_in if isinstance(review_in, dict) else review_in.dict()

    rating = int(data.get("rating", 5))
    if rating < 1 or rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5.")

    comment = data.get("comment") or data.get("text") or "Wonderful experience exploring Uzbekistan!"
    destination_id = data.get("destination_id")
    place_id = data.get("place_id")
    guide_id = data.get("guide_id")
    agency_id = data.get("agency_id")

    # If target_type / target_id format used:
    target_type = data.get("target_type")
    target_id = data.get("target_id")
    if target_type and target_id:
        try:
            tid = int(target_id)
            if target_type == "guide":
                guide_id = tid
            elif target_type == "agency":
                agency_id = tid
            elif target_type == "destination":
                destination_id = tid
            elif target_type == "place":
                place_id = tid
        except Exception:
            pass

    if not any([destination_id, place_id, guide_id, agency_id]):
        raise HTTPException(
            status_code=400,
            detail="Review must specify a destination_id, place_id, guide_id, or agency_id."
        )

    new_review = Review(
        user_id=current_user.id,
        destination_id=destination_id,
        place_id=place_id,
        guide_id=guide_id,
        agency_id=agency_id,
        rating=rating,
        comment=comment
    )
    db.add(new_review)
    await db.flush()

    # Recalculate Guide rating if guide_id
    if guide_id:
        g_res = await db.execute(select(Guide).where(Guide.id == guide_id))
        guide = g_res.scalars().first()
        if guide:
            avg_res = await db.execute(select(func.avg(Review.rating), func.count(Review.id)).where(Review.guide_id == guide_id))
            avg_r, cnt_r = avg_res.first()
            guide.rating = round(float(avg_r), 1) if avg_r else float(rating)
            guide.reviews_count = cnt_r or 1
            db.add(guide)

            # Generate NOTIFICATION for guide!
            await create_notification(
                db=db,
                user_id=guide.user_id,
                notification_type="review",
                title="New Review Received!",
                content=f"{current_user.name or current_user.email} left you a {rating}-star review: '{comment[:60]}...'",
                action_url=f"/guides/{guide.id}",
                entity_type="review",
                entity_id=new_review.id
            )

    # Recalculate Agency rating if agency_id
    if agency_id:
        ag_res = await db.execute(select(Agency).where(Agency.id == agency_id))
        agency = ag_res.scalars().first()
        if agency:
            avg_res = await db.execute(select(func.avg(Review.rating), func.count(Review.id)).where(Review.agency_id == agency_id))
            avg_r, cnt_r = avg_res.first()
            agency.rating = round(float(avg_r), 1) if avg_r else float(rating)
            agency.reviews_count = cnt_r or 1
            db.add(agency)

            # Generate NOTIFICATION for agency owner!
            await create_notification(
                db=db,
                user_id=agency.owner_user_id,
                notification_type="review",
                title="New Agency Review!",
                content=f"{current_user.name or current_user.email} rated your agency {rating} stars: '{comment[:60]}...'",
                action_url=f"/agencies/{agency.id}",
                entity_type="review",
                entity_id=new_review.id
            )

    await db.commit()
    await db.refresh(new_review)

    return {
        "id": new_review.id,
        "user_id": new_review.user_id,
        "rating": new_review.rating,
        "comment": new_review.comment,
        "created_at": new_review.created_at.isoformat()
    }
