from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import or_, and_, func
from typing import List, Optional
from datetime import datetime, date

from app.db.session import get_db
from app.models.user import User
from app.models.trip import CommunityTrip, TripParticipant, Trip
from app.schemas.community import (
    CommunityTripCreate, CommunityTripUpdate, CommunityTripOut,
    CommunityTripMemberOut, JoinTripRequest
)
from app.api.deps import get_current_user, get_current_user_optional
from app.services.notification_service import create_notification

router = APIRouter(prefix="/community", tags=["Community Trips"])

@router.get("/trips", response_model=List[CommunityTripOut])
async def list_community_trips(
    destination: Optional[str] = None,
    status_filter: Optional[str] = Query("open", description="open, full, completed, all"),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(CommunityTrip)
        .options(
            selectinload(CommunityTrip.creator),
            selectinload(CommunityTrip.participants).selectinload(TripParticipant.user)
        )
    )

    if destination:
        query = query.where(CommunityTrip.destination.ilike(f"%{destination}%"))
    if status_filter and status_filter.lower() != "all":
        query = query.where(CommunityTrip.status == status_filter.lower())

    query = query.order_by(CommunityTrip.created_at.desc())
    res = await db.execute(query)
    trips = res.scalars().all()

    out = []
    for t in trips:
        members = [
            CommunityTripMemberOut(
                id=p.id,
                trip_id=t.id,
                user_id=p.user_id,
                user_name=p.user.name or p.user.email if p.user else "Traveler",
                user_avatar=p.user.avatar if p.user else None,
                status=p.status,
                message=p.notes,
                created_at=p.created_at
            )
            for p in t.participants
        ]

        join_status = None
        is_joined = False
        if current_user:
            if t.creator_user_id == current_user.id:
                join_status = "creator"
                is_joined = True
            else:
                user_part = next((p for p in t.participants if p.user_id == current_user.id), None)
                if user_part:
                    join_status = user_part.status
                    is_joined = user_part.status == "accepted"

        date_str = f"{t.start_date.isoformat()} to {t.end_date.isoformat()}" if t.start_date and t.end_date else "Upcoming"

        out.append(CommunityTripOut(
            id=t.id,
            creator_id=t.creator_user_id,
            creator_name=t.creator.name or t.creator.email if t.creator else "Community Host",
            creator_avatar=t.creator.avatar if t.creator else None,
            title=t.title,
            destination=t.destination,
            dates=date_str,
            budget=f"${t.estimated_cost_per_person} {t.currency}",
            description=t.description,
            max_participants=t.max_participants,
            travel_style="Cultural Heritage",
            status=t.status,
            created_at=t.created_at,
            members_count=t.current_participants_count,
            is_joined=is_joined,
            join_status=join_status,
            members=members
        ))

    return out

@router.post("/trips", response_model=CommunityTripOut)
async def create_community_trip(
    trip_in: CommunityTripCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Parse dates
    today = date.today()
    start_d = today
    end_d = today
    if trip_in.dates:
        parts = trip_in.dates.split(" to ")
        try:
            if len(parts) == 2:
                start_d = date.fromisoformat(parts[0].strip())
                end_d = date.fromisoformat(parts[1].strip())
        except Exception:
            pass

    # Parse budget
    cost = 0.0
    if trip_in.budget:
        clean_b = "".join(c for c in trip_in.budget if c.isdigit() or c == ".")
        try:
            cost = float(clean_b)
        except Exception:
            cost = 250.0

    new_trip = CommunityTrip(
        creator_user_id=current_user.id,
        title=trip_in.title,
        destination=trip_in.destination,
        description=trip_in.description or f"Join me exploring the historic beauty of {trip_in.destination}!",
        start_date=start_d,
        end_date=end_d,
        max_participants=trip_in.max_participants or 8,
        current_participants_count=1,
        estimated_cost_per_person=cost,
        currency="USD",
        status="open"
    )
    db.add(new_trip)
    await db.flush()

    # Automatically add creator as accepted participant
    host_part = TripParticipant(
        community_trip_id=new_trip.id,
        user_id=current_user.id,
        status="accepted",
        notes="Trip Creator / Host"
    )
    db.add(host_part)
    await db.commit()
    await db.refresh(new_trip)

    return CommunityTripOut(
        id=new_trip.id,
        creator_id=current_user.id,
        creator_name=current_user.name or current_user.email,
        creator_avatar=current_user.avatar,
        title=new_trip.title,
        destination=new_trip.destination,
        dates=f"{start_d.isoformat()} to {end_d.isoformat()}",
        budget=f"${cost} USD",
        description=new_trip.description,
        max_participants=new_trip.max_participants,
        travel_style="Cultural Heritage",
        status=new_trip.status,
        created_at=new_trip.created_at,
        members_count=1,
        is_joined=True,
        join_status="creator",
        members=[]
    )

@router.post("/trips/{trip_id}/join")
async def join_community_trip(
    trip_id: int,
    req_body: JoinTripRequest = JoinTripRequest(),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(CommunityTrip)
        .options(selectinload(CommunityTrip.creator))
        .where(CommunityTrip.id == trip_id)
    )
    trip = res.scalars().first()
    if not trip:
        raise HTTPException(status_code=404, detail="Community trip not found")

    if trip.creator_user_id == current_user.id:
        raise HTTPException(status_code=400, detail="You are the creator of this trip.")

    if trip.current_participants_count >= trip.max_participants:
        raise HTTPException(status_code=400, detail="This trip is already full.")

    # Check if already joined/applied
    part_res = await db.execute(
        select(TripParticipant).where(
            TripParticipant.community_trip_id == trip_id,
            TripParticipant.user_id == current_user.id
        )
    )
    existing_p = part_res.scalars().first()
    if existing_p:
        if existing_p.status == "accepted":
            raise HTTPException(status_code=400, detail="You have already joined this trip.")
        elif existing_p.status == "pending":
            raise HTTPException(status_code=400, detail="Your request to join is already pending approval.")
        else:
            existing_p.status = "pending"
            existing_p.notes = req_body.message
            db.add(existing_p)
    else:
        new_p = TripParticipant(
            community_trip_id=trip.id,
            user_id=current_user.id,
            status="pending",
            notes=req_body.message
        )
        db.add(new_p)

    await db.flush()

    # Generate NOTIFICATION for trip join request to trip creator!
    await create_notification(
        db=db,
        user_id=trip.creator_user_id,
        notification_type="trip_join_request",
        title="Trip Join Request",
        content=f"{current_user.name or current_user.email} requested to join your trip '{trip.title}'.",
        action_url="/community",
        entity_type="community_trip",
        entity_id=trip.id
    )
    await db.commit()

    return {"message": "Request to join trip submitted successfully. The host has been notified.", "status": "pending"}

@router.patch("/trips/{trip_id}/participants/{user_id}")
async def review_join_request(
    trip_id: int,
    user_id: int,
    action: str = "accept", # accept or reject
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(CommunityTrip).where(CommunityTrip.id == trip_id))
    trip = res.scalars().first()
    if not trip:
        raise HTTPException(status_code=404, detail="Community trip not found")

    # Server-side Authorization: Only the creator can approve/reject participants
    if trip.creator_user_id != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Forbidden: Only the trip host can manage join requests.")

    p_res = await db.execute(
        select(TripParticipant).where(
            TripParticipant.community_trip_id == trip_id,
            TripParticipant.user_id == user_id
        )
    )
    participant = p_res.scalars().first()
    if not participant:
        raise HTTPException(status_code=404, detail="Participant record not found.")

    new_status = "accepted" if action.lower() in ["accept", "accepted"] else "rejected"
    participant.status = new_status
    db.add(participant)

    if new_status == "accepted":
        trip.current_participants_count += 1
        if trip.current_participants_count >= trip.max_participants:
            trip.status = "full"
        db.add(trip)

        # Generate NOTIFICATION: trip accepted!
        await create_notification(
            db=db,
            user_id=user_id,
            notification_type="trip_accepted",
            title="Trip Join Request Accepted!",
            content=f"You have been accepted to join '{trip.title}'!",
            action_url="/community",
            entity_type="community_trip",
            entity_id=trip.id
        )

    await db.commit()
    return {"message": f"Join request {new_status}.", "status": new_status}
