from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.db.session import get_db
from app.models.agency import Agency
from app.models.itinerary import Itinerary
from app.models.lead import Lead
from app.models.booking import Booking
from app.schemas.lead import (
    PublicLeadCreate, LeadCreate, LeadUpdate, LeadOut, ConvertLeadToBooking
)
from app.schemas.booking import BookingOut
from app.api.deps import get_current_user, get_current_agency
from app.services.telegram_service import send_telegram_lead_notification

router = APIRouter(prefix="/leads", tags=["Leads & CRM Pipeline"])

@router.post("/public", response_model=LeadOut)
async def create_public_lead(
    lead_in: PublicLeadCreate,
    db: AsyncSession = Depends(get_db)
):
    # Lookup itinerary by share_token
    itin_res = await db.execute(select(Itinerary).where(Itinerary.share_token == lead_in.share_token))
    itin = itin_res.scalars().first()
    if not itin:
        raise HTTPException(status_code=404, detail="Invalid itinerary share token")

    agency_id = itin.agency_id
    if not agency_id:
        # Fallback to default agency if itinerary is unassigned
        ag_res = await db.execute(select(Agency).limit(1))
        agency = ag_res.scalars().first()
        agency_id = agency.id if agency else 1

    new_lead = Lead(
        agency_id=agency_id,
        client_name=lead_in.client_name,
        client_contact=lead_in.client_contact,
        source="web",
        itinerary_id=itin.id,
        status="new",
        notes=lead_in.notes
    )
    db.add(new_lead)
    await db.commit()
    await db.refresh(new_lead)

    # Fetch agency info for Telegram notification
    ag_res = await db.execute(select(Agency).where(Agency.id == agency_id))
    agency_obj = ag_res.scalars().first()
    if agency_obj and agency_obj.telegram_bot_token and agency_obj.telegram_chat_id:
        await send_telegram_lead_notification(
            encrypted_bot_token=agency_obj.telegram_bot_token,
            chat_id=agency_obj.telegram_chat_id,
            client_name=new_lead.client_name,
            client_contact=new_lead.client_contact,
            itinerary_title=itin.title,
            share_token=itin.share_token,
            notes=new_lead.notes
        )

    return LeadOut(
        id=new_lead.id,
        agency_id=new_lead.agency_id,
        client_name=new_lead.client_name,
        client_contact=new_lead.client_contact,
        source=new_lead.source,
        itinerary_id=new_lead.itinerary_id,
        itinerary_title=itin.title,
        status=new_lead.status,
        notes=new_lead.notes,
        created_at=new_lead.created_at
    )

@router.get("", response_model=List[LeadOut])
async def list_agency_leads(
    agency: Agency = Depends(get_current_agency),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Lead)
        .where(Lead.agency_id == agency.id)
        .order_by(Lead.created_at.desc())
    )
    leads = res.scalars().all()
    
    out = []
    for l in leads:
        itin_title = None
        if l.itinerary_id:
            itin_res = await db.execute(select(Itinerary).where(Itinerary.id == l.itinerary_id))
            itin = itin_res.scalars().first()
            if itin:
                itin_title = itin.title
        
        out.append(LeadOut(
            id=l.id,
            agency_id=l.agency_id,
            client_name=l.client_name,
            client_contact=l.client_contact,
            source=l.source,
            itinerary_id=l.itinerary_id,
            itinerary_title=itin_title,
            status=l.status,
            notes=l.notes,
            created_at=l.created_at
        ))
    return out

@router.post("", response_model=LeadOut)
async def create_lead_manually(
    lead_in: LeadCreate,
    agency: Agency = Depends(get_current_agency),
    db: AsyncSession = Depends(get_db)
):
    new_lead = Lead(
        agency_id=agency.id,
        client_name=lead_in.client_name,
        client_contact=lead_in.client_contact,
        source=lead_in.source or "web",
        itinerary_id=lead_in.itinerary_id,
        status=lead_in.status or "new",
        notes=lead_in.notes
    )
    db.add(new_lead)
    await db.commit()
    await db.refresh(new_lead)

    itin_title = None
    if new_lead.itinerary_id:
        itin_res = await db.execute(select(Itinerary).where(Itinerary.id == new_lead.itinerary_id))
        itin = itin_res.scalars().first()
        if itin:
            itin_title = itin.title

    return LeadOut(
        id=new_lead.id,
        agency_id=new_lead.agency_id,
        client_name=new_lead.client_name,
        client_contact=new_lead.client_contact,
        source=new_lead.source,
        itinerary_id=new_lead.itinerary_id,
        itinerary_title=itin_title,
        status=new_lead.status,
        notes=new_lead.notes,
        created_at=new_lead.created_at
    )

@router.patch("/{lead_id}", response_model=LeadOut)
async def update_lead_status(
    lead_id: int,
    lead_in: LeadUpdate,
    agency: Agency = Depends(get_current_agency),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Lead).where(Lead.id == lead_id, Lead.agency_id == agency.id)
    )
    lead = res.scalars().first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    if lead_in.status is not None:
        lead.status = lead_in.status
    if lead_in.notes is not None:
        lead.notes = lead_in.notes
    if lead_in.client_name is not None:
        lead.client_name = lead_in.client_name
    if lead_in.client_contact is not None:
        lead.client_contact = lead_in.client_contact

    db.add(lead)
    await db.commit()
    await db.refresh(lead)

    itin_title = None
    if lead.itinerary_id:
        itin_res = await db.execute(select(Itinerary).where(Itinerary.id == lead.itinerary_id))
        itin = itin_res.scalars().first()
        if itin:
            itin_title = itin.title

    return LeadOut(
        id=lead.id,
        agency_id=lead.agency_id,
        client_name=lead.client_name,
        client_contact=lead.client_contact,
        source=lead.source,
        itinerary_id=lead.itinerary_id,
        itinerary_title=itin_title,
        status=lead.status,
        notes=lead.notes,
        created_at=lead.created_at
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

    # Mark lead status as 'won'
    lead.status = "won"
    db.add(lead)

    new_booking = Booking(
        lead_id=lead.id,
        agency_id=agency.id,
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
