from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Optional

from app.db.session import get_db
from app.models.agency import Agency
from app.models.itinerary import Itinerary
from app.models.trip import Trip
from app.models.package import Package
from app.models.lead import Lead
from app.models.booking import Booking
from app.schemas.lead import (
    PublicLeadCreate, LeadCreate, LeadUpdate, LeadOut, ConvertLeadToBooking
)
from app.schemas.booking import BookingOut
from app.api.deps import get_current_user, get_current_agency
from app.services.telegram_service import send_telegram_lead_notification

router = APIRouter(prefix="/leads", tags=["Leads & CRM Pipeline"])

VALID_LEAD_STATUSES = ["new", "contacted", "interested", "booked", "rejected", "negotiating", "won", "lost"]

def serialize_lead(l: Lead, itin_title: Optional[str] = None, pkg_title: Optional[str] = None) -> LeadOut:
    return LeadOut(
        id=l.id,
        agency_id=l.agency_id,
        client_name=l.client_name,
        client_contact=l.client_contact,
        client_email=l.client_email,
        client_phone=l.client_phone,
        preferred_contact_method=l.preferred_contact_method or "email",
        source=l.source,
        package_id=l.package_id,
        trip_id=l.trip_id,
        itinerary_id=l.itinerary_id,
        itinerary_title=itin_title,
        package_title=pkg_title,
        travelers_count=l.travelers_count,
        travel_date=l.travel_date,
        budget=l.budget,
        currency=l.currency or "USD",
        status=l.status,
        notes=l.notes,
        created_at=l.created_at,
        updated_at=l.updated_at
    )

@router.post("/public", response_model=LeadOut)
async def create_public_lead(
    lead_in: PublicLeadCreate,
    db: AsyncSession = Depends(get_db)
):
    agency_id = None
    itin_title = None
    pkg_title = None
    itin_id = None
    trip_id = lead_in.trip_id

    # 1. If package_id is provided
    if lead_in.package_id:
        p_res = await db.execute(select(Package).where(Package.id == lead_in.package_id))
        pkg = p_res.scalars().first()
        if pkg:
            agency_id = pkg.agency_id
            pkg_title = pkg.title

    # 2. If share_token is provided
    if lead_in.share_token and not agency_id:
        # Check Trip
        t_res = await db.execute(select(Trip).where(Trip.share_token == lead_in.share_token))
        trip = t_res.scalars().first()
        if trip:
            trip_id = trip.id
            itin_title = trip.title

        # Check legacy Itinerary
        itin_res = await db.execute(select(Itinerary).where(Itinerary.share_token == lead_in.share_token))
        itin = itin_res.scalars().first()
        if itin:
            agency_id = itin.agency_id
            itin_id = itin.id
            itin_title = itin_title or itin.title

    if not agency_id:
        # Fallback to the first registered agency
        ag_res = await db.execute(select(Agency).limit(1))
        agency = ag_res.scalars().first()
        agency_id = agency.id if agency else 1

    contact_str = lead_in.client_contact or lead_in.client_email or lead_in.client_phone or "web-inquiry"

    new_lead = Lead(
        agency_id=agency_id,
        package_id=lead_in.package_id,
        trip_id=trip_id,
        itinerary_id=itin_id,
        client_name=lead_in.client_name,
        client_contact=contact_str,
        client_email=lead_in.client_email,
        client_phone=lead_in.client_phone,
        preferred_contact_method=lead_in.preferred_contact_method or "email",
        source="web",
        travelers_count=lead_in.travelers_count or 1,
        travel_date=lead_in.travel_date,
        budget=lead_in.budget,
        currency=lead_in.currency or "USD",
        status="new",
        notes=lead_in.notes
    )
    db.add(new_lead)
    await db.commit()
    await db.refresh(new_lead)

    # Push notification to agency's Telegram if active
    ag_res = await db.execute(select(Agency).where(Agency.id == agency_id))
    agency_obj = ag_res.scalars().first()
    if agency_obj and agency_obj.telegram_bot_token and agency_obj.telegram_chat_id:
        try:
            await send_telegram_lead_notification(
                encrypted_bot_token=agency_obj.telegram_bot_token,
                chat_id=agency_obj.telegram_chat_id,
                client_name=new_lead.client_name,
                client_contact=new_lead.client_contact,
                itinerary_title=pkg_title or itin_title or "General Travel Inquiry",
                share_token=lead_in.share_token or "web-inquiry",
                notes=new_lead.notes
            )
        except Exception:
            pass

    return serialize_lead(new_lead, itin_title=itin_title, pkg_title=pkg_title)

@router.get("", response_model=List[LeadOut])
async def list_agency_leads(
    status: Optional[str] = None,
    agency: Agency = Depends(get_current_agency),
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(Lead)
        .options(selectinload(Lead.package), selectinload(Lead.itinerary))
        .where(Lead.agency_id == agency.id)
    )
    if status:
        query = query.where(Lead.status == status.lower())

    query = query.order_by(Lead.created_at.desc())
    res = await db.execute(query)
    leads = res.scalars().all()

    return [
        serialize_lead(
            l,
            itin_title=l.itinerary.title if l.itinerary else None,
            pkg_title=l.package.title if l.package else None
        )
        for l in leads
    ]

@router.post("", response_model=LeadOut)
async def create_lead_manually(
    lead_in: LeadCreate,
    agency: Agency = Depends(get_current_agency),
    db: AsyncSession = Depends(get_db)
):
    norm_status = (lead_in.status or "new").lower()
    new_lead = Lead(
        agency_id=agency.id,
        client_name=lead_in.client_name,
        client_contact=lead_in.client_contact,
        client_email=lead_in.client_email,
        client_phone=lead_in.client_phone,
        preferred_contact_method=lead_in.preferred_contact_method or "email",
        source=lead_in.source or "manual",
        package_id=lead_in.package_id,
        trip_id=lead_in.trip_id,
        itinerary_id=lead_in.itinerary_id,
        travelers_count=lead_in.travelers_count or 1,
        travel_date=lead_in.travel_date,
        budget=lead_in.budget,
        currency=lead_in.currency or "USD",
        status=norm_status,
        notes=lead_in.notes
    )
    db.add(new_lead)
    await db.commit()
    await db.refresh(new_lead)

    return serialize_lead(new_lead)

@router.patch("/{lead_id}", response_model=LeadOut)
@router.put("/{lead_id}", response_model=LeadOut)
async def update_lead_status(
    lead_id: int,
    lead_in: LeadUpdate,
    agency: Agency = Depends(get_current_agency),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Lead)
        .options(selectinload(Lead.package), selectinload(Lead.itinerary))
        .where(Lead.id == lead_id, Lead.agency_id == agency.id)
    )
    lead = res.scalars().first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    if lead_in.status is not None:
        norm_status = lead_in.status.lower()
        if norm_status not in VALID_LEAD_STATUSES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid lead status. Supported: {VALID_LEAD_STATUSES}"
            )
        lead.status = norm_status
    if lead_in.notes is not None:
        lead.notes = lead_in.notes
    if lead_in.client_name is not None:
        lead.client_name = lead_in.client_name
    if lead_in.client_contact is not None:
        lead.client_contact = lead_in.client_contact
    if lead_in.client_email is not None:
        lead.client_email = lead_in.client_email
    if lead_in.client_phone is not None:
        lead.client_phone = lead_in.client_phone
    if lead_in.preferred_contact_method is not None:
        lead.preferred_contact_method = lead_in.preferred_contact_method
    if lead_in.travelers_count is not None:
        lead.travelers_count = lead_in.travelers_count
    if lead_in.travel_date is not None:
        lead.travel_date = lead_in.travel_date
    if lead_in.budget is not None:
        lead.budget = lead_in.budget
    if lead_in.currency is not None:
        lead.currency = lead_in.currency

    db.add(lead)
    await db.commit()
    await db.refresh(lead)

    return serialize_lead(
        lead,
        itin_title=lead.itinerary.title if lead.itinerary else None,
        pkg_title=lead.package.title if lead.package else None
    )

@router.post("/{lead_id}/convert-to-booking", response_model=BookingOut)
async def convert_lead_to_booking(
    lead_id: int,
    booking_in: ConvertLeadToBooking,
    agency: Agency = Depends(get_current_agency),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Lead).where(Lead.id == lead_id, Lead.agency_id == agency.id)
    )
    lead = res.scalars().first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    # Mark lead status as 'booked'
    lead.status = "booked"
    db.add(lead)

    new_booking = Booking(
        lead_id=lead.id,
        agency_id=agency.id,
        package_id=lead.package_id,
        final_price=booking_in.final_price,
        currency=booking_in.currency or "USD",
        status="confirmed"
    )
    db.add(new_booking)
    await db.commit()
    await db.refresh(new_booking)

    return BookingOut(
        id=new_booking.id,
        lead_id=new_booking.lead_id,
        agency_id=new_booking.agency_id,
        client_name=lead.client_name,
        client_contact=lead.client_contact,
        final_price=new_booking.final_price,
        currency=new_booking.currency,
        status=new_booking.status,
        created_at=new_booking.created_at
    )
