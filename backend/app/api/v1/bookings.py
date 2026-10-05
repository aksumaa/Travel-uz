from fastapi import APIRouter, Depends, HTTPException, Query, status, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import or_, and_
from typing import List, Optional, Any
from datetime import datetime, date

from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.agency import Agency
from app.models.guide import Guide
from app.models.package import Package
from app.models.lead import Lead
from app.models.booking import Booking
from app.schemas.booking import BookingCreate, BookingUpdate, BookingOut
from app.schemas.booking_request import BookingRequestCreate, BookingRequestOut, BookingRequestStatusUpdate
from app.api.deps import get_current_user, get_current_user_optional
from app.services.notification_service import create_notification

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.get("", response_model=List[dict])
async def list_bookings(
    status_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(Booking)
        .options(
            selectinload(Booking.user),
            selectinload(Booking.agency),
            selectinload(Booking.guide),
            selectinload(Booking.package)
        )
    )

    user_role = current_user.role.upper()
    if user_role == "ADMIN":
        pass # Admin can see all
    elif user_role in ["AGENCY", "AGENCY_OWNER", "AGENCY_STAFF"]:
        # Find user's agency
        agency_res = await db.execute(select(Agency).where(Agency.owner_user_id == current_user.id))
        agency = agency_res.scalars().first()
        if agency:
            query = query.where(Booking.agency_id == agency.id)
        else:
            query = query.where(Booking.user_id == current_user.id)
    elif user_role == "GUIDE":
        guide_res = await db.execute(select(Guide).where(Guide.user_id == current_user.id))
        guide = guide_res.scalars().first()
        if guide:
            query = query.where(Booking.guide_id == guide.id)
        else:
            query = query.where(Booking.user_id == current_user.id)
    else:
        # Standard user
        query = query.where(Booking.user_id == current_user.id)

    if status_filter:
        query = query.where(Booking.status == status_filter.lower())

    query = query.order_by(Booking.created_at.desc())
    res = await db.execute(query)
    bookings = res.scalars().all()

    out = []
    for b in bookings:
        out.append({
            "id": b.id,
            "user_id": b.user_id,
            "agency_id": b.agency_id,
            "guide_id": b.guide_id,
            "package_id": b.package_id,
            "service_title": b.service_title,
            "start_date": b.start_date.isoformat() if b.start_date else None,
            "end_date": b.end_date.isoformat() if b.end_date else None,
            "travelers_count": b.travelers_count,
            "final_price": b.final_price,
            "currency": b.currency,
            "status": b.status,
            "special_requests": b.special_requests,
            "user_name": b.user.name if b.user else "Direct Customer",
            "agency_name": b.agency.name if b.agency else None,
            "guide_name": b.guide.full_name if b.guide else None,
            "package_title": b.package.title if b.package else None,
            "created_at": b.created_at.isoformat()
        })
    return out

@router.get("/{booking_id}", response_model=dict)
async def get_booking(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Booking)
        .options(
            selectinload(Booking.user),
            selectinload(Booking.agency),
            selectinload(Booking.guide),
            selectinload(Booking.package)
        )
        .where(Booking.id == booking_id)
    )
    b = res.scalars().first()
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Authorization
    user_role = current_user.role.upper()
    is_authorized = (
        user_role == "ADMIN" or
        b.user_id == current_user.id or
        (b.agency and b.agency.owner_user_id == current_user.id) or
        (b.guide and b.guide.user_id == current_user.id)
    )
    if not is_authorized:
        raise HTTPException(status_code=403, detail="Forbidden: You cannot access this booking.")

    return {
        "id": b.id,
        "user_id": b.user_id,
        "agency_id": b.agency_id,
        "guide_id": b.guide_id,
        "package_id": b.package_id,
        "service_title": b.service_title,
        "start_date": b.start_date.isoformat() if b.start_date else None,
        "end_date": b.end_date.isoformat() if b.end_date else None,
        "travelers_count": b.travelers_count,
        "final_price": b.final_price,
        "currency": b.currency,
        "status": b.status,
        "special_requests": b.special_requests,
        "user_name": b.user.name if b.user else "Direct Customer",
        "agency_name": b.agency.name if b.agency else None,
        "guide_name": b.guide.full_name if b.guide else None,
        "created_at": b.created_at.isoformat()
    }

@router.post("", response_model=dict)
async def create_booking(
    booking_in: Any = Body(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    data = booking_in if isinstance(booking_in, dict) else booking_in.dict()

    agency_id = data.get("agency_id")
    guide_id = data.get("guide_id")
    package_id = data.get("package_id")
    lead_id = data.get("lead_id")
    price = float(data.get("final_price") or data.get("total_price") or 0.0)
    service_title = data.get("service_title") or "Custom Uzbekistan Journey"

    # If package specified, default price & agency
    if package_id and not agency_id:
        pkg_res = await db.execute(select(Package).where(Package.id == package_id))
        pkg = pkg_res.scalars().first()
        if pkg:
            agency_id = pkg.agency_id
            if price == 0:
                price = pkg.price
            service_title = pkg.title

    new_booking = Booking(
        user_id=current_user.id,
        agency_id=agency_id,
        guide_id=guide_id,
        package_id=package_id,
        lead_id=lead_id,
        service_title=service_title,
        travelers_count=data.get("travelers_count") or data.get("participants") or 1,
        final_price=price,
        currency=data.get("currency", "USD"),
        special_requests=data.get("special_requests") or data.get("message"),
        status="pending"
    )
    db.add(new_booking)
    await db.flush()

    # Notify Agency or Guide
    target_user_id = None
    if agency_id:
        ag_res = await db.execute(select(Agency).where(Agency.id == agency_id))
        agency = ag_res.scalars().first()
        if agency:
            target_user_id = agency.owner_user_id
    elif guide_id:
        g_res = await db.execute(select(Guide).where(Guide.id == guide_id))
        guide = g_res.scalars().first()
        if guide:
            target_user_id = guide.user_id

    if target_user_id:
        await create_notification(
            db=db,
            user_id=target_user_id,
            notification_type="booking_confirmed" if new_booking.status == "confirmed" else "trip_join_request",
            title="New Booking Request",
            content=f"New booking received from {current_user.name or current_user.email} for '{service_title}'.",
            action_url="/bookings",
            entity_type="booking",
            entity_id=new_booking.id
        )

    await db.commit()
    await db.refresh(new_booking)

    return {
        "id": new_booking.id,
        "user_id": new_booking.user_id,
        "agency_id": new_booking.agency_id,
        "guide_id": new_booking.guide_id,
        "service_title": new_booking.service_title,
        "final_price": new_booking.final_price,
        "currency": new_booking.currency,
        "status": new_booking.status,
        "created_at": new_booking.created_at.isoformat()
    }

@router.patch("/{booking_id}", response_model=dict)
async def update_booking_status(
    booking_id: int,
    booking_in: Any = Body(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    data = booking_in if isinstance(booking_in, dict) else booking_in.dict()
    new_status = (data.get("status") or "").lower()

    res = await db.execute(
        select(Booking)
        .options(selectinload(Booking.agency), selectinload(Booking.guide))
        .where(Booking.id == booking_id)
    )
    b = res.scalars().first()
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Server-side Authorization:
    # Agency owner, Guide owner, or Admin can confirm/reject.
    # Booking client can cancel.
    user_role = current_user.role.upper()
    is_provider = (
        user_role == "ADMIN" or
        (b.agency and b.agency.owner_user_id == current_user.id) or
        (b.guide and b.guide.user_id == current_user.id)
    )
    is_client = (b.user_id == current_user.id)

    if not is_provider and not is_client:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: You do not have permission to modify this booking."
        )

    if not is_provider and is_client and new_status not in ["cancelled"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Client can only cancel their booking."
        )

    if new_status:
        b.status = new_status
    if data.get("final_price") is not None:
        b.final_price = float(data["final_price"])
    if data.get("currency") is not None:
        b.currency = data["currency"]

    db.add(b)
    await db.flush()

    # NOTIFICATIONS: Trigger on booking confirmed or rejected!
    if b.user_id:
        if new_status == "confirmed":
            await create_notification(
                db=db,
                user_id=b.user_id,
                notification_type="booking_confirmed",
                title="Booking Confirmed!",
                content=f"Your booking for '{b.service_title}' has been confirmed by the provider.",
                action_url="/bookings",
                entity_type="booking",
                entity_id=b.id
            )
        elif new_status == "rejected":
            await create_notification(
                db=db,
                user_id=b.user_id,
                notification_type="booking_rejected",
                title="Booking Declined",
                content=f"Your booking for '{b.service_title}' could not be accepted at this time.",
                action_url="/bookings",
                entity_type="booking",
                entity_id=b.id
            )

    await db.commit()
    await db.refresh(b)

    return {
        "id": b.id,
        "service_title": b.service_title,
        "final_price": b.final_price,
        "currency": b.currency,
        "status": b.status,
        "updated_at": b.updated_at.isoformat()
    }
