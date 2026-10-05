from fastapi import APIRouter, Depends, HTTPException, Query, status, Body
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Optional, Any
import io
from datetime import datetime

from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.agency import Agency
from app.models.itinerary import Itinerary
from app.models.trip import Trip, TripDay, TripActivity, SavedTrip, TripItem
from app.models.destination import Place
from app.schemas.itinerary import TripGenerateRequest, PublicItineraryOut
from app.schemas.trip import (
    TripCreate, TripUpdate, TripOut, TripListItem, SavedTripOut,
    TripDayCreate, TripDayUpdate, TripDayOut,
    TripActivityCreate, TripActivityUpdate, TripActivityOut,
    TripItemCreate, TripItemUpdate, TripItemOut,
    TripPreferencesUpdate, TripAdaptRequest
)
from app.api.deps import get_current_user, get_current_user_optional
from app.services.anthropic_service import generate_trip_itinerary
from app.services.pdf_service import generate_itinerary_pdf

from app.schemas.ai import (
    TripClarifyRequest, TripClarifyResponse,
    TripStrategiesRequest, TripStrategiesResponse,
    TripPlanRequest, StructuredItinerary
)
from app.services.ai.travel_planner import TravelPlannerService

router = APIRouter(prefix="/trips", tags=["Trips & Itineraries"])
ai_planner_service = TravelPlannerService()

@router.post("/clarify", response_model=TripClarifyResponse)
async def clarify_trip_preferences_route(req: TripClarifyRequest):
    try:
        return await ai_planner_service.clarify_trip_preferences(req)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))

@router.post("/strategies", response_model=TripStrategiesResponse)
@router.post("/generate-strategies", response_model=TripStrategiesResponse)
async def generate_trip_strategies_route(req: TripStrategiesRequest):
    try:
        return await ai_planner_service.generate_strategies(req)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))

@router.post("/plan", response_model=StructuredItinerary)
async def plan_trip_structured_route(req: TripPlanRequest, db: AsyncSession = Depends(get_db)):
    try:
        return await ai_planner_service.generate_itinerary(req, db=db)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))

def parse_activities_from_day_json(day_dict: dict) -> List[dict]:
    acts = []
    order = 0
    # Check morning
    if "morning" in day_dict and isinstance(day_dict["morning"], dict):
        m = day_dict["morning"]
        acts.append({
            "title": m.get("activity", "Morning Exploration"),
            "location_name": m.get("location", "Historic Core"),
            "item_type": "attraction",
            "time_slot": "morning",
            "time_start": "09:00",
            "duration_hours": 2.5,
            "estimated_cost": float(m.get("cost", 0.0) or 0.0),
            "currency": "USD",
            "description": m.get("tip"),
            "order_index": order
        })
        order += 1
    # Check lunch
    if "lunch" in day_dict and isinstance(day_dict["lunch"], dict):
        l = day_dict["lunch"]
        acts.append({
            "title": l.get("restaurant", "Local Gastronomy Dining"),
            "location_name": l.get("location", "City Center"),
            "item_type": "restaurant",
            "time_slot": "afternoon",
            "time_start": "12:30",
            "duration_hours": 1.5,
            "estimated_cost": float(l.get("cost", 0.0) or 0.0),
            "currency": "USD",
            "description": f"Cuisine: {l.get('cuisine', 'Traditional')}",
            "order_index": order
        })
        order += 1
    # Check afternoon
    if "afternoon" in day_dict and isinstance(day_dict["afternoon"], dict):
        a = day_dict["afternoon"]
        acts.append({
            "title": a.get("activity", "Afternoon Discovery"),
            "location_name": a.get("location", "Cultural District"),
            "item_type": "attraction",
            "time_slot": "afternoon",
            "time_start": "14:30",
            "duration_hours": 3.0,
            "estimated_cost": float(a.get("cost", 0.0) or 0.0),
            "currency": "USD",
            "description": a.get("tip"),
            "order_index": order
        })
        order += 1
    # Check evening
    if "evening" in day_dict and isinstance(day_dict["evening"], dict):
        e = day_dict["evening"]
        acts.append({
            "title": f"Dinner & Evening at {e.get('restaurant', 'Heritage Restaurant')}",
            "location_name": e.get("address", "City Center"),
            "item_type": "restaurant",
            "time_slot": "evening",
            "time_start": "18:30",
            "duration_hours": 2.0,
            "estimated_cost": float(e.get("cost", 0.0) or 0.0),
            "currency": "USD",
            "description": f"Cuisine: {e.get('cuisine', 'Local Flavors')}",
            "order_index": order
        })
        order += 1
    return acts

@router.post("/generate", response_model=dict)
async def generate_trip(
    req: TripGenerateRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    days_cnt = req.days or 3
    if req.start_date and req.end_date:
        try:
            d1 = datetime.strptime(req.start_date, "%Y-%m-%d")
            d2 = datetime.strptime(req.end_date, "%Y-%m-%d")
            diff = (d2 - d1).days + 1
            if diff > 0:
                days_cnt = diff
        except Exception:
            pass

    content_json = await generate_trip_itinerary(
        destination=req.destination,
        days=days_cnt,
        budget=req.budget or 1200.0,
        travelers=req.travelers or 2,
        style=req.style or "Cultural Heritage",
        language=req.language or "en"
    )

    estimated_total = req.budget or content_json.get("totalCost", 1200.0)
    preferences = {
        "travel_style": req.style or "Cultural Heritage",
        "pace": "balanced",
        "language": req.language or "en"
    }

    # Create relational Trip
    new_trip = Trip(
        user_id=current_user.id if current_user else None,
        title=content_json.get("title", f"Voyage to {req.destination}"),
        destination=req.destination,
        duration_days=days_cnt,
        estimated_budget=estimated_total,
        currency="USD",
        travelers_count=req.travelers or 2,
        travel_style=req.style or "Cultural Heritage",
        status="planned",
        is_public=True,
        content_json=content_json,
        preferences_json=preferences
    )
    db.add(new_trip)
    await db.flush()

    # Populate TripDay and TripItem/TripActivity records
    days_data = content_json.get("days", [])
    for d_idx, day_info in enumerate(days_data, start=1):
        trip_day = TripDay(
            trip_id=new_trip.id,
            day_number=d_idx,
            title=f"Day {d_idx}: {req.destination} Highlights",
            daily_budget=float(day_info.get("dailyCost", 0.0) or (estimated_total / max(days_cnt, 1)))
        )
        db.add(trip_day)
        await db.flush()

        acts = parse_activities_from_day_json(day_info)
        for act in acts:
            activity = TripActivity(
                trip_day_id=trip_day.id,
                title=act["title"],
                location_name=act["location_name"],
                item_type=act["item_type"],
                time_slot=act["time_slot"],
                time_start=act.get("time_start"),
                duration_hours=act["duration_hours"],
                estimated_cost=act["estimated_cost"],
                currency="USD",
                description=act["description"],
                order_index=act["order_index"]
            )
            db.add(activity)

    # Legacy Itinerary table support
    legacy_itin = Itinerary(
        user_id=current_user.id if current_user else None,
        title=new_trip.title,
        destination=new_trip.destination,
        generated_by="ai",
        content_json=content_json,
        share_token=new_trip.share_token
    )
    db.add(legacy_itin)
    await db.commit()
    await db.refresh(new_trip)

    return {
        "id": new_trip.id,
        "share_token": new_trip.share_token,
        "itinerary": content_json,
        "raw_trip_data": content_json,
        "created_at": new_trip.created_at.isoformat(),
        "budget_disclaimer": "Estimates are approximate and subject to seasonal fluctuation and local availability."
    }

@router.get("", response_model=List[TripListItem])
async def list_user_trips(
    status: Optional[str] = None,
    include_archived: bool = False,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Trip).where(Trip.user_id == current_user.id)
    if not include_archived:
        query = query.where(Trip.is_archived == False)
    if status:
        query = query.where(Trip.status == status.lower())
    
    query = query.order_by(Trip.created_at.desc())
    res = await db.execute(query)
    return res.scalars().all()

@router.post("", response_model=TripOut)
async def create_trip(
    trip_in: TripCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    new_trip = Trip(
        user_id=current_user.id,
        destination_id=trip_in.destination_id,
        title=trip_in.title or "My Journey",
        destination=trip_in.destination,
        start_date=trip_in.start_date,
        end_date=trip_in.end_date,
        duration_days=trip_in.duration_days,
        estimated_budget=trip_in.estimated_budget,
        currency=trip_in.currency or "USD",
        travelers_count=trip_in.travelers_count,
        travel_style=trip_in.travel_style,
        status=trip_in.status,
        is_public=trip_in.is_public,
        content_json=trip_in.content_json,
        preferences_json=trip_in.preferences_json or {}
    )
    db.add(new_trip)
    await db.flush()

    # Relational days
    if trip_in.days:
        for d in trip_in.days:
            t_day = TripDay(
                trip_id=new_trip.id,
                day_number=d.day_number,
                date=d.date,
                title=d.title or f"Day {d.day_number}",
                notes=d.notes,
                daily_budget=d.daily_budget
            )
            db.add(t_day)
            await db.flush()

            for act in d.activities:
                t_act = TripActivity(
                    trip_day_id=t_day.id,
                    place_id=act.place_id,
                    title=act.title,
                    description=act.description,
                    location_name=act.location_name,
                    item_type=act.item_type or "attraction",
                    time_slot=act.time_slot,
                    time_start=act.time_start,
                    duration_hours=act.duration_hours,
                    estimated_cost=act.estimated_cost,
                    currency=act.currency or trip_in.currency,
                    latitude=act.latitude,
                    longitude=act.longitude,
                    is_verified=act.is_verified,
                    notes=act.notes,
                    details_json=act.details_json or {},
                    order_index=act.order_index
                )
                db.add(t_act)
    elif trip_in.content_json and isinstance(trip_in.content_json, dict) and "days" in trip_in.content_json:
        for d_idx, day_info in enumerate(trip_in.content_json.get("days", []), start=1):
            t_day = TripDay(
                trip_id=new_trip.id,
                day_number=d_idx,
                title=f"Day {d_idx}: {trip_in.destination}",
                daily_budget=float(day_info.get("dailyCost", 0.0) or 0.0)
            )
            db.add(t_day)
            await db.flush()
            acts = parse_activities_from_day_json(day_info)
            for act in acts:
                db.add(TripActivity(
                    trip_day_id=t_day.id,
                    title=act["title"],
                    location_name=act["location_name"],
                    item_type=act["item_type"],
                    time_slot=act["time_slot"],
                    time_start=act.get("time_start"),
                    duration_hours=act["duration_hours"],
                    estimated_cost=act["estimated_cost"],
                    currency="USD",
                    description=act["description"],
                    order_index=act["order_index"]
                ))

    await db.commit()

    res = await db.execute(
        select(Trip)
        .options(selectinload(Trip.days).selectinload(TripDay.activities))
        .where(Trip.id == new_trip.id)
    )
    return res.scalars().first()

@router.get("/share/{share_token}", response_model=PublicItineraryOut)
async def get_public_trip_by_token(share_token: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(
        select(Trip)
        .options(selectinload(Trip.days).selectinload(TripDay.activities))
        .where(Trip.share_token == share_token)
    )
    trip = res.scalars().first()
    if not trip:
        itin_res = await db.execute(select(Itinerary).where(Itinerary.share_token == share_token))
        itin = itin_res.scalars().first()
        if not itin:
            raise HTTPException(status_code=404, detail="Itinerary not found or invalid share token.")
        return PublicItineraryOut(
            id=itin.id,
            title=itin.title,
            destination=itin.destination,
            content_json=itin.content_json,
            share_token=itin.share_token,
            created_at=itin.created_at,
            agency_name="TripMind Community"
        )

    content = trip.content_json
    if not content:
        content = {
            "title": trip.title,
            "destination": trip.destination,
            "totalCost": trip.estimated_budget,
            "currency": trip.currency,
            "days": [
                {
                    "day": d.day_number,
                    "title": d.title,
                    "dailyCost": d.daily_budget,
                    "activities": [
                        {
                            "title": a.title,
                            "location": a.location_name,
                            "time": a.time_slot,
                            "cost": a.estimated_cost,
                            "item_type": a.item_type
                        }
                        for a in d.activities
                    ]
                }
                for d in trip.days
            ]
        }

    return PublicItineraryOut(
        id=trip.id,
        title=trip.title,
        destination=trip.destination,
        content_json=content,
        share_token=trip.share_token,
        created_at=trip.created_at,
        agency_name="TripMind Member Itinerary"
    )

@router.get("/{trip_id}", response_model=TripOut)
async def get_trip_details(
    trip_id: int,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Trip)
        .options(selectinload(Trip.days).selectinload(TripDay.activities))
        .where(Trip.id == trip_id)
    )
    trip = res.scalars().first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    # Authorization / IDOR Protection
    if not trip.is_public:
        if not current_user:
            raise HTTPException(status_code=401, detail="Authentication required to view private trip.")
        if trip.user_id != current_user.id and current_user.role != UserRole.ADMIN.value:
            raise HTTPException(status_code=403, detail="Forbidden: You do not have permission to view this private trip.")

    return trip

@router.patch("/{trip_id}", response_model=TripOut)
@router.put("/{trip_id}", response_model=TripOut)
async def update_trip(
    trip_id: int,
    trip_update: TripUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Trip)
        .options(selectinload(Trip.days).selectinload(TripDay.activities))
        .where(Trip.id == trip_id)
    )
    trip = res.scalars().first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    # Server-side IDOR check
    if trip.user_id != current_user.id and current_user.role != UserRole.ADMIN.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: You do not have permission to edit another user's trip."
        )

    if trip_update.title is not None:
        trip.title = trip_update.title
    if trip_update.destination is not None:
        trip.destination = trip_update.destination
    if trip_update.start_date is not None:
        trip.start_date = trip_update.start_date
    if trip_update.end_date is not None:
        trip.end_date = trip_update.end_date
    if trip_update.duration_days is not None:
        trip.duration_days = trip_update.duration_days
    if trip_update.estimated_budget is not None:
        trip.estimated_budget = trip_update.estimated_budget
    if trip_update.currency is not None:
        trip.currency = trip_update.currency
    if trip_update.travelers_count is not None:
        trip.travelers_count = trip_update.travelers_count
    if trip_update.travel_style is not None:
        trip.travel_style = trip_update.travel_style
    if trip_update.status is not None:
        trip.status = trip_update.status
    if trip_update.is_public is not None:
        trip.is_public = trip_update.is_public
    if trip_update.is_archived is not None:
        trip.is_archived = trip_update.is_archived
    if trip_update.content_json is not None:
        trip.content_json = trip_update.content_json
    if trip_update.preferences_json is not None:
        trip.preferences_json = trip_update.preferences_json

    db.add(trip)
    await db.commit()
    await db.refresh(trip)
    return trip

@router.delete("/{trip_id}")
async def delete_trip(
    trip_id: int,
    archive: bool = False,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Trip).where(Trip.id == trip_id))
    trip = res.scalars().first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    if trip.user_id != current_user.id and current_user.role != UserRole.ADMIN.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: You cannot delete another user's trip."
        )

    if archive:
        trip.is_archived = True
        trip.status = "archived"
        db.add(trip)
        await db.commit()
        return {"message": "Trip archived successfully.", "is_archived": True}

    await db.delete(trip)
    await db.commit()
    return {"message": "Trip deleted successfully."}

@router.patch("/{trip_id}/preferences", response_model=dict)
@router.post("/{trip_id}/preferences", response_model=dict)
async def update_trip_preferences(
    trip_id: int,
    prefs: TripPreferencesUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Trip).where(Trip.id == trip_id))
    trip = res.scalars().first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    if trip.user_id != current_user.id and current_user.role != UserRole.ADMIN.value:
        raise HTTPException(status_code=403, detail="Forbidden: You cannot modify another user's trip.")

    current_prefs = trip.preferences_json or {}
    update_data = prefs.model_dump(exclude_unset=True)
    current_prefs.update(update_data)
    trip.preferences_json = current_prefs

    if prefs.preferred_currency:
        trip.currency = prefs.preferred_currency

    db.add(trip)
    await db.commit()
    await db.refresh(trip)

    return {
        "message": "Trip preferences updated successfully",
        "trip_id": trip.id,
        "preferences": trip.preferences_json,
        "currency": trip.currency
    }

@router.post("/{trip_id}/modify-itinerary", response_model=dict)
@router.post("/{trip_id}/adapt", response_model=dict)
async def adapt_trip_schedule(
    trip_id: int,
    adapt_req: TripAdaptRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    In-Trip Real-Time Contextual Adaptation Engine.
    Handles triggers: 'I'm tired', 'It's raining', '$40 left today', 'Move activities closer'.
    Generates dynamic schedule mutation and slot rebalancing.
    """
    res = await db.execute(
        select(Trip)
        .options(selectinload(Trip.days).selectinload(TripDay.activities))
        .where(Trip.id == trip_id)
    )
    trip = res.scalars().first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    if trip.user_id != current_user.id and current_user.role != UserRole.ADMIN.value:
        raise HTTPException(status_code=403, detail="Forbidden: You cannot modify another user's trip.")

    target_day_num = adapt_req.current_day_number or 1
    target_day = next((d for d in trip.days if d.day_number == target_day_num), trip.days[0] if trip.days else None)
    if not target_day:
        raise HTTPException(status_code=404, detail="Specified trip day not found.")

    prompt_lower = adapt_req.prompt.lower()
    removals = []
    additions = []
    budget_impact = 0.0

    if "rain" in prompt_lower:
        title_summary = "Rain Adaptation Proposal: Indoor Cultural Highlights"
        removals = ["Open-Air Walking Exploration", "City Center Panoramic Park"]
        additions = [
            {"title": "Covered Historic Market & Artisan Stalls", "location": target_day.title, "type": "shopping", "cost": 0.0},
            {"title": "State Art & History Gallery Exhibition", "location": target_day.title, "type": "attraction", "cost": 6.0}
        ]
        budget_impact = 6.0
    elif "tired" in prompt_lower or "fatigue" in prompt_lower:
        title_summary = "Rest & Relaxation Adaptation: Low-Exertion Pacing"
        removals = ["High-Mileage Walking Circuit"]
        additions = [
            {"title": "Traditional Teahouse & Hammam Relaxation", "location": target_day.title, "type": "cafe", "cost": 12.0}
        ]
        budget_impact = 4.0
    elif "budget" in prompt_lower or "$" in prompt_lower or "cheap" in prompt_lower:
        title_summary = "Budget Optimization: Free Monuments & Authentic Street Gastronomy"
        removals = ["Upscale Dining Reservation"]
        additions = [
            {"title": "Family-run Authentic Lokanta / Chaykhana", "location": target_day.title, "type": "restaurant", "cost": 7.0}
        ]
        budget_impact = -25.0
    else:
        title_summary = f"Schedule Optimization: {adapt_req.prompt}"
        removals = ["Cross-town commute"]
        additions = [
            {"title": "Nearby Cultural Workshop", "location": target_day.title, "type": "entertainment", "cost": 5.0}
        ]

    # If apply_immediately is true, append the new item to the target day
    if adapt_req.apply_immediately and additions:
        max_order = max([a.order_index for a in target_day.activities] or [0]) + 1
        new_act = TripActivity(
            trip_day_id=target_day.id,
            title=additions[0]["title"],
            location_name=additions[0]["location"],
            item_type=additions[0]["type"],
            time_slot=adapt_req.current_time_slot or "afternoon",
            duration_hours=2.0,
            estimated_cost=additions[0]["cost"],
            currency=trip.currency,
            description="Contextual in-trip schedule adaptation",
            order_index=max_order
        )
        db.add(new_act)
        await db.commit()

    return {
        "trip_id": trip.id,
        "day_number": target_day.day_number,
        "proposal_title": title_summary,
        "trigger": adapt_req.prompt,
        "removing": removals,
        "adding": additions,
        "budget_impact": budget_impact,
        "applied": adapt_req.apply_immediately,
        "message": "Schedule adaptation calculated. Apply to persist to active itinerary."
    }

# ----------------- Trip Days Sub-routes -----------------

@router.post("/{trip_id}/days", response_model=TripDayOut)
async def create_trip_day(
    trip_id: int,
    day_in: TripDayCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Trip).where(Trip.id == trip_id))
    trip = res.scalars().first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.user_id != current_user.id and current_user.role != UserRole.ADMIN.value:
        raise HTTPException(status_code=403, detail="Forbidden: You cannot modify another user's trip.")

    new_day = TripDay(
        trip_id=trip.id,
        day_number=day_in.day_number,
        date=day_in.date,
        title=day_in.title,
        notes=day_in.notes,
        daily_budget=day_in.daily_budget
    )
    db.add(new_day)
    await db.flush()

    for act in day_in.activities:
        db.add(TripActivity(
            trip_day_id=new_day.id,
            place_id=act.place_id,
            title=act.title,
            description=act.description,
            location_name=act.location_name,
            item_type=act.item_type or "attraction",
            time_slot=act.time_slot,
            time_start=act.time_start,
            duration_hours=act.duration_hours,
            estimated_cost=act.estimated_cost,
            currency=act.currency or trip.currency,
            order_index=act.order_index
        ))

    await db.commit()

    reloaded = await db.execute(
        select(TripDay)
        .options(selectinload(TripDay.activities))
        .where(TripDay.id == new_day.id)
    )
    return reloaded.scalars().first()

@router.get("/{trip_id}/days", response_model=List[TripDayOut])
async def list_trip_days(
    trip_id: int,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Trip).where(Trip.id == trip_id))
    trip = res.scalars().first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    if not trip.is_public:
        if not current_user or (trip.user_id != current_user.id and current_user.role != UserRole.ADMIN.value):
            raise HTTPException(status_code=403, detail="Forbidden: Access to private trip days is denied.")

    days_res = await db.execute(
        select(TripDay)
        .options(selectinload(TripDay.activities))
        .where(TripDay.trip_id == trip_id)
        .order_by(TripDay.day_number.asc())
    )
    return days_res.scalars().all()

@router.patch("/{trip_id}/days/{day_id}", response_model=TripDayOut)
@router.put("/{trip_id}/days/{day_id}", response_model=TripDayOut)
async def update_trip_day(
    trip_id: int,
    day_id: int,
    day_update: TripDayUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Trip).where(Trip.id == trip_id))
    trip = res.scalars().first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.user_id != current_user.id and current_user.role != UserRole.ADMIN.value:
        raise HTTPException(status_code=403, detail="Forbidden: You cannot modify another user's trip.")

    day_res = await db.execute(select(TripDay).where(TripDay.id == day_id, TripDay.trip_id == trip_id))
    day = day_res.scalars().first()
    if not day:
        raise HTTPException(status_code=404, detail="Trip day not found")

    if day_update.title is not None:
        day.title = day_update.title
    if day_update.notes is not None:
        day.notes = day_update.notes
    if day_update.daily_budget is not None:
        day.daily_budget = day_update.daily_budget
    if day_update.day_number is not None:
        day.day_number = day_update.day_number
    if day_update.date is not None:
        day.date = day_update.date

    db.add(day)
    await db.commit()

    reloaded = await db.execute(
        select(TripDay)
        .options(selectinload(TripDay.activities))
        .where(TripDay.id == day.id)
    )
    return reloaded.scalars().first()

@router.delete("/{trip_id}/days/{day_id}")
async def delete_trip_day(
    trip_id: int,
    day_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Trip).where(Trip.id == trip_id))
    trip = res.scalars().first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.user_id != current_user.id and current_user.role != UserRole.ADMIN.value:
        raise HTTPException(status_code=403, detail="Forbidden: You cannot modify another user's trip.")

    day_res = await db.execute(select(TripDay).where(TripDay.id == day_id, TripDay.trip_id == trip_id))
    day = day_res.scalars().first()
    if not day:
        raise HTTPException(status_code=404, detail="Trip day not found")

    await db.delete(day)
    await db.commit()
    return {"message": "Trip day deleted successfully"}

# ----------------- Trip Items Sub-routes -----------------

@router.post("/{trip_id}/days/{day_id}/items", response_model=TripItemOut)
async def create_trip_item(
    trip_id: int,
    day_id: int,
    item_in: TripItemCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Trip).where(Trip.id == trip_id))
    trip = res.scalars().first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.user_id != current_user.id and current_user.role != UserRole.ADMIN.value:
        raise HTTPException(status_code=403, detail="Forbidden: You cannot modify another user's trip.")

    day_res = await db.execute(select(TripDay).where(TripDay.id == day_id, TripDay.trip_id == trip_id))
    day = day_res.scalars().first()
    if not day:
        raise HTTPException(status_code=404, detail="Trip day not found")

    # If place_id is provided, verify and sync coordinates
    lat = item_in.latitude
    lng = item_in.longitude
    is_verified = item_in.is_verified
    if item_in.place_id:
        p_res = await db.execute(select(Place).where(Place.id == item_in.place_id))
        place = p_res.scalars().first()
        if place:
            lat = lat or place.latitude
            lng = lng or place.longitude
            is_verified = True

    new_act = TripActivity(
        trip_day_id=day.id,
        place_id=item_in.place_id,
        title=item_in.title,
        description=item_in.description,
        location_name=item_in.location_name,
        item_type=item_in.item_type or "attraction",
        time_slot=item_in.time_slot,
        time_start=item_in.time_start,
        duration_hours=item_in.duration_hours,
        estimated_cost=item_in.estimated_cost,
        currency=item_in.currency or trip.currency,
        latitude=lat,
        longitude=lng,
        is_verified=is_verified,
        notes=item_in.notes,
        details_json=item_in.details_json or {},
        order_index=item_in.order_index
    )
    db.add(new_act)
    await db.commit()
    await db.refresh(new_act)
    return new_act

@router.patch("/{trip_id}/days/{day_id}/items/{item_id}", response_model=TripItemOut)
@router.put("/{trip_id}/days/{day_id}/items/{item_id}", response_model=TripItemOut)
async def update_trip_item(
    trip_id: int,
    day_id: int,
    item_id: int,
    item_update: TripItemUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Trip).where(Trip.id == trip_id))
    trip = res.scalars().first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.user_id != current_user.id and current_user.role != UserRole.ADMIN.value:
        raise HTTPException(status_code=403, detail="Forbidden: You cannot modify another user's trip.")

    act_res = await db.execute(
        select(TripActivity).where(TripActivity.id == item_id, TripActivity.trip_day_id == day_id)
    )
    act = act_res.scalars().first()
    if not act:
        raise HTTPException(status_code=404, detail="Trip item not found")

    if item_update.title is not None:
        act.title = item_update.title
    if item_update.description is not None:
        act.description = item_update.description
    if item_update.location_name is not None:
        act.location_name = item_update.location_name
    if item_update.item_type is not None:
        act.item_type = item_update.item_type
    if item_update.time_slot is not None:
        act.time_slot = item_update.time_slot
    if item_update.time_start is not None:
        act.time_start = item_update.time_start
    if item_update.duration_hours is not None:
        act.duration_hours = item_update.duration_hours
    if item_update.estimated_cost is not None:
        act.estimated_cost = item_update.estimated_cost
    if item_update.currency is not None:
        act.currency = item_update.currency
    if item_update.place_id is not None:
        act.place_id = item_update.place_id
    if item_update.latitude is not None:
        act.latitude = item_update.latitude
    if item_update.longitude is not None:
        act.longitude = item_update.longitude
    if item_update.is_verified is not None:
        act.is_verified = item_update.is_verified
    if item_update.notes is not None:
        act.notes = item_update.notes
    if item_update.details_json is not None:
        act.details_json = item_update.details_json
    if item_update.order_index is not None:
        act.order_index = item_update.order_index

    db.add(act)
    await db.commit()
    await db.refresh(act)
    return act

@router.delete("/{trip_id}/days/{day_id}/items/{item_id}")
async def delete_trip_item(
    trip_id: int,
    day_id: int,
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Trip).where(Trip.id == trip_id))
    trip = res.scalars().first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.user_id != current_user.id and current_user.role != UserRole.ADMIN.value:
        raise HTTPException(status_code=403, detail="Forbidden: You cannot modify another user's trip.")

    act_res = await db.execute(
        select(TripActivity).where(TripActivity.id == item_id, TripActivity.trip_day_id == day_id)
    )
    act = act_res.scalars().first()
    if not act:
        raise HTTPException(status_code=404, detail="Trip item not found")

    await db.delete(act)
    await db.commit()
    return {"message": "Trip item deleted successfully"}

# ----------------- Trip Bookmarking / Save -----------------

@router.post("/{trip_id}/save")
async def toggle_save_trip(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(SavedTrip).where(SavedTrip.user_id == current_user.id, SavedTrip.trip_id == trip_id)
    )
    saved = res.scalars().first()
    if saved:
        await db.delete(saved)
        await db.commit()
        return {"saved": False, "message": "Trip removed from saved list."}

    trip_res = await db.execute(select(Trip).where(Trip.id == trip_id))
    if not trip_res.scalars().first():
        raise HTTPException(status_code=404, detail="Trip not found")

    new_saved = SavedTrip(user_id=current_user.id, trip_id=trip_id)
    db.add(new_saved)
    await db.commit()
    return {"saved": True, "message": "Trip saved successfully."}

@router.get("/saved/all", response_model=List[SavedTripOut])
async def list_saved_trips(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(SavedTrip)
        .options(selectinload(SavedTrip.trip))
        .where(SavedTrip.user_id == current_user.id)
        .order_by(SavedTrip.created_at.desc())
    )
    return res.scalars().all()

@router.get("/{trip_id}/pdf")
async def download_trip_pdf(
    trip_id: int,
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Trip)
        .options(selectinload(Trip.days).selectinload(TripDay.activities))
        .where(Trip.id == trip_id)
    )
    trip = res.scalars().first()
    title = "TripMind Journey"
    content_json = {}

    if trip:
        title = trip.title
        content_json = trip.content_json or {
            "title": trip.title,
            "destination": trip.destination,
            "totalCost": trip.estimated_budget,
            "currency": trip.currency,
            "days": [
                {
                    "day": d.day_number,
                    "dailyCost": d.daily_budget,
                    "morning": {"activity": d.title, "location": trip.destination, "cost": d.daily_budget / 2}
                }
                for d in trip.days
            ]
        }
    else:
        itin_res = await db.execute(select(Itinerary).where(Itinerary.id == trip_id))
        itin = itin_res.scalars().first()
        if not itin:
            raise HTTPException(status_code=404, detail="Trip/Itinerary not found")
        title = itin.title
        content_json = itin.content_json

    pdf_bytes = generate_itinerary_pdf(content_json, agency_name="TripMind")
    clean_filename = "".join(c for c in title if c.isalnum() or c in (" ", "_", "-")).replace(" ", "_")
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=Trip_{clean_filename}.pdf"}
    )
