from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.db.session import get_db
from app.models.agency import Agency
from app.models.lead import Lead
from app.models.booking import Booking
from app.schemas.booking import BookingCreate, BookingUpdate, BookingOut
from app.api.deps import get_current_user, get_current_agency

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.get("", response_model=List[BookingOut])
async def list_bookings(
    agency: Agency = Depends(get_current_agency),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Booking)
        .where(Booking.agency_id == agency.id)
        .order_by(Booking.created_at.desc())
    )
    bookings = res.scalars().all()
    
    out = []
    for b in bookings:
        c_name, c_contact = "Direct Customer", "-"
        if b.lead_id:
            lead_res = await db.execute(select(Lead).where(Lead.id == b.lead_id))
            lead = lead_res.scalars().first()
            if lead:
                c_name = lead.client_name
                c_contact = lead.client_contact
        
        out.append(BookingOut(
            id=b.id,
            lead_id=b.lead_id,
            agency_id=b.agency_id,
            client_name=c_name,
            client_contact=c_contact,
            final_price=b.final_price,
            currency=b.currency,
            status=b.status,
            created_at=b.created_at
        ))
    return out

@router.post("", response_model=BookingOut)
async def create_booking(
    booking_in: BookingCreate,
    agency: Agency = Depends(get_current_agency),
    db: AsyncSession = Depends(get_db)
):
    new_booking = Booking(
        lead_id=booking_in.lead_id,
        agency_id=agency.id,
        final_price=booking_in.final_price,
        currency=booking_in.currency or "USD",
        status=booking_in.status or "confirmed"
    )
    db.add(new_booking)
    await db.commit()
    await db.refresh(new_booking)

    c_name, c_contact = "Direct Customer", "-"
    if new_booking.lead_id:
        lead_res = await db.execute(select(Lead).where(Lead.id == new_booking.lead_id))
        lead = lead_res.scalars().first()
        if lead:
            c_name = lead.client_name
            c_contact = lead.client_contact

    return BookingOut(
        id=new_booking.id,
        lead_id=new_booking.lead_id,
        agency_id=new_booking.agency_id,
        client_name=c_name,
        client_contact=c_contact,
        final_price=new_booking.final_price,
        currency=new_booking.currency,
        status=new_booking.status,
        created_at=new_booking.created_at
    )

@router.patch("/{booking_id}", response_model=BookingOut)
async def update_booking_status(
    booking_id: int,
    booking_in: BookingUpdate,
    agency: Agency = Depends(get_current_agency),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Booking).where(Booking.id == booking_id, Booking.agency_id == agency.id)
    )
    b = res.scalars().first()
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking_in.final_price is not None:
        b.final_price = booking_in.final_price
    if booking_in.currency is not None:
        b.currency = booking_in.currency
    if booking_in.status is not None:
        b.status = booking_in.status

    db.add(b)
    await db.commit()
    await db.refresh(b)

    c_name, c_contact = "Direct Customer", "-"
    if b.lead_id:
        lead_res = await db.execute(select(Lead).where(Lead.id == b.lead_id))
        lead = lead_res.scalars().first()
        if lead:
            c_name = lead.client_name
            c_contact = lead.client_contact

    return BookingOut(
        id=b.id,
        lead_id=b.lead_id,
        agency_id=b.agency_id,
        client_name=c_name,
        client_contact=c_contact,
        final_price=b.final_price,
        currency=b.currency,
        status=b.status,
        created_at=b.created_at
    )
