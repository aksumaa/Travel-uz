from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import List, Optional

from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.agency import Agency, AgencyMember, AgencyService, AgencyVerification
from app.models.package import Package
from app.models.lead import Lead
from app.models.booking import Booking
from app.models.review import Review
from app.schemas.agency import (
    AgencyOnboardRequest, AgencyUpdateRequest, AgencyOut, AgencyAnalyticsOut,
    AgencyVerificationCreate, AgencyVerificationOut
)
from app.schemas.package import PackageOut
from app.api.deps import get_current_user, get_current_agency
from app.services.encryption import encrypt_string, decrypt_string

router = APIRouter(prefix="/agencies", tags=["Agencies"])

def serialize_agency(a: Agency, latest_verif: Optional[AgencyVerification] = None) -> dict:
    return {
        "id": a.id,
        "name": a.name,
        "slug": a.slug,
        "logo_url": a.logo_url,
        "contact_email": a.contact_email,
        "contact_phone": a.contact_phone,
        "website": a.website,
        "telegram_channel": a.telegram_channel,
        "whatsapp": a.whatsapp,
        "address": a.address,
        "city": a.city,
        "description": a.description,
        "subscription_tier": a.subscription_tier,
        "rating": a.rating,
        "reviews_count": a.reviews_count,
        "is_verified": a.is_verified,
        "owner_user_id": a.owner_user_id,
        "has_telegram_bot": bool(a.telegram_bot_token),
        "telegram_chat_id": a.telegram_chat_id,
        "latest_verification": {
            "id": latest_verif.id,
            "agency_id": latest_verif.agency_id,
            "status": latest_verif.status,
            "business_registration_number": latest_verif.business_registration_number,
            "license_number": latest_verif.license_number,
            "document_url": latest_verif.document_url,
            "notes": latest_verif.notes,
            "submitted_at": latest_verif.submitted_at,
            "reviewed_at": latest_verif.reviewed_at,
            "reviewer_notes": latest_verif.reviewer_notes
        } if latest_verif else None,
        "created_at": a.created_at
    }

@router.get("", response_model=List[dict])
async def list_agencies(
    city: Optional[str] = None,
    tier: Optional[str] = None,
    verified_only: bool = False,
    db: AsyncSession = Depends(get_db)
):
    query = select(Agency)
    if verified_only:
        query = query.where(Agency.is_verified == True)
    if city:
        query = query.where(Agency.city.ilike(f"%{city}%"))
    if tier:
        query = query.where(Agency.subscription_tier == tier.lower())

    query = query.order_by(Agency.rating.desc(), Agency.reviews_count.desc())
    res = await db.execute(query)
    agencies = res.scalars().all()

    return [serialize_agency(a) for a in agencies]

@router.get("/{agency_id}", response_model=dict)
async def get_agency(agency_id: int, db: AsyncSession = Depends(get_db)):
    res = await db.execute(
        select(Agency)
        .options(
            selectinload(Agency.packages),
            selectinload(Agency.services),
            selectinload(Agency.verifications)
        )
        .where(Agency.id == agency_id)
    )
    a = res.scalars().first()
    if not a:
        raise HTTPException(status_code=404, detail="Agency not found")

    latest_verif = a.verifications[-1] if a.verifications else None
    base_data = serialize_agency(a, latest_verif)
    base_data["packages"] = [
        {
            "id": p.id,
            "title": p.title,
            "destination": p.destination,
            "days": p.days,
            "price": p.price,
            "currency": p.currency,
            "status": p.status,
            "image_url": p.image_url
        }
        for p in a.packages
    ]
    base_data["services"] = [
        {
            "id": s.id,
            "name": s.name,
            "description": s.description,
            "price": s.price,
            "currency": s.currency,
            "service_type": s.service_type
        }
        for s in a.services
    ]
    return base_data

@router.post("/onboard", response_model=AgencyOut)
async def onboard_agency(
    onboard_in: AgencyOnboardRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Agency).where(Agency.owner_user_id == current_user.id))
    existing = res.scalars().first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already owns a registered agency."
        )

    current_user.role = UserRole.AGENCY.value
    db.add(current_user)

    slug = onboard_in.name.lower().replace(" ", "-").replace("'", "")
    new_agency = Agency(
        name=onboard_in.name,
        slug=f"{slug}-{current_user.id}",
        logo_url=onboard_in.logo_url,
        contact_email=onboard_in.contact_email or current_user.email,
        contact_phone=onboard_in.contact_phone,
        website=onboard_in.website,
        telegram_channel=onboard_in.telegram_channel,
        whatsapp=onboard_in.whatsapp,
        address=onboard_in.address,
        city=onboard_in.city or "Tashkent",
        description=onboard_in.description,
        owner_user_id=current_user.id,
        is_verified=False,
        subscription_tier=onboard_in.subscription_tier or "starter"
    )
    db.add(new_agency)
    await db.flush()

    member = AgencyMember(
        agency_id=new_agency.id,
        user_id=current_user.id,
        role="owner"
    )
    db.add(member)
    await db.commit()
    await db.refresh(new_agency)

    return AgencyOut(**serialize_agency(new_agency))

@router.get("/me", response_model=AgencyOut)
async def get_my_agency(
    agency: Agency = Depends(get_current_agency),
    db: AsyncSession = Depends(get_db)
):
    v_res = await db.execute(
        select(AgencyVerification)
        .where(AgencyVerification.agency_id == agency.id)
        .order_by(AgencyVerification.submitted_at.desc())
    )
    latest_verif = v_res.scalars().first()
    return AgencyOut(**serialize_agency(agency, latest_verif))

@router.patch("/me", response_model=AgencyOut)
async def update_my_agency(
    update_in: AgencyUpdateRequest,
    agency: Agency = Depends(get_current_agency),
    db: AsyncSession = Depends(get_db)
):
    if update_in.name is not None:
        agency.name = update_in.name
    if update_in.logo_url is not None:
        agency.logo_url = update_in.logo_url
    if update_in.contact_email is not None:
        agency.contact_email = update_in.contact_email
    if update_in.contact_phone is not None:
        agency.contact_phone = update_in.contact_phone
    if update_in.website is not None:
        agency.website = update_in.website
    if update_in.telegram_channel is not None:
        agency.telegram_channel = update_in.telegram_channel
    if update_in.whatsapp is not None:
        agency.whatsapp = update_in.whatsapp
    if update_in.address is not None:
        agency.address = update_in.address
    if update_in.city is not None:
        agency.city = update_in.city
    if update_in.subscription_tier is not None:
        agency.subscription_tier = update_in.subscription_tier
    if update_in.telegram_bot_token is not None:
        agency.telegram_bot_token = encrypt_string(update_in.telegram_bot_token) if update_in.telegram_bot_token else None
    if update_in.telegram_chat_id is not None:
        agency.telegram_chat_id = update_in.telegram_chat_id
    if update_in.description is not None:
        agency.description = update_in.description

    db.add(agency)
    await db.commit()
    await db.refresh(agency)

    v_res = await db.execute(
        select(AgencyVerification)
        .where(AgencyVerification.agency_id == agency.id)
        .order_by(AgencyVerification.submitted_at.desc())
    )
    latest_verif = v_res.scalars().first()
    return AgencyOut(**serialize_agency(agency, latest_verif))

# ----------------- Agency Verification Subsystem -----------------

@router.post("/verify", response_model=AgencyVerificationOut)
async def submit_agency_verification(
    verif_in: AgencyVerificationCreate,
    agency: Agency = Depends(get_current_agency),
    db: AsyncSession = Depends(get_db)
):
    """
    Submits official agency verification documentation for administrator review.
    """
    new_verif = AgencyVerification(
        agency_id=agency.id,
        status="pending",
        business_registration_number=verif_in.business_registration_number,
        license_number=verif_in.license_number,
        document_url=verif_in.document_url,
        notes=verif_in.notes
    )
    db.add(new_verif)
    await db.commit()
    await db.refresh(new_verif)
    return new_verif

@router.get("/verify/status", response_model=dict)
async def check_agency_verification_status(
    agency: Agency = Depends(get_current_agency),
    db: AsyncSession = Depends(get_db)
):
    v_res = await db.execute(
        select(AgencyVerification)
        .where(AgencyVerification.agency_id == agency.id)
        .order_by(AgencyVerification.submitted_at.desc())
    )
    latest = v_res.scalars().first()
    return {
        "agency_id": agency.id,
        "agency_name": agency.name,
        "is_verified": agency.is_verified,
        "verification_request": {
            "id": latest.id,
            "status": latest.status,
            "submitted_at": latest.submitted_at.isoformat(),
            "reviewed_at": latest.reviewed_at.isoformat() if latest.reviewed_at else None,
            "reviewer_notes": latest.reviewer_notes
        } if latest else None
    }

@router.get("/analytics", response_model=AgencyAnalyticsOut)
async def get_agency_analytics(
    agency: Agency = Depends(get_current_agency),
    db: AsyncSession = Depends(get_db)
):
    leads_res = await db.execute(select(Lead).where(Lead.agency_id == agency.id))
    leads = leads_res.scalars().all()

    total_leads = len(leads)
    new_leads = sum(1 for l in leads if l.status == "new")
    contacted_leads = sum(1 for l in leads if l.status == "contacted")
    negotiating_leads = sum(1 for l in leads if l.status in ["negotiating", "interested"])
    won_leads = sum(1 for l in leads if l.status in ["won", "booked"])
    lost_leads = sum(1 for l in leads if l.status in ["lost", "rejected"])

    conversion_rate = round((won_leads / total_leads * 100), 1) if total_leads > 0 else 0.0

    bookings_res = await db.execute(select(Booking).where(Booking.agency_id == agency.id))
    bookings = bookings_res.scalars().all()

    total_bookings = len(bookings)
    total_revenue = sum(b.final_price for b in bookings if b.status != "cancelled")

    now = datetime.utcnow()
    leads_by_month = []
    revenue_by_month = []
    month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    for i in range(5, -1, -1):
        target_month_dt = now - timedelta(days=i * 30)
        m_name = month_names[target_month_dt.month - 1]
        m_leads = sum(1 for l in leads if l.created_at.month == target_month_dt.month and l.created_at.year == target_month_dt.year)
        leads_by_month.append({"month": m_name, "leads": m_leads, "won": sum(1 for l in leads if l.status in ["won", "booked"] and l.created_at.month == target_month_dt.month)})

        m_rev = sum(b.final_price for b in bookings if b.status != "cancelled" and b.created_at.month == target_month_dt.month and b.created_at.year == target_month_dt.year)
        revenue_by_month.append({"month": m_name, "revenue": m_rev})

    top_destinations = [
        {"destination": "Samarkand", "requests": max(total_leads // 2, 4)},
        {"destination": "Bukhara", "requests": max(total_leads // 3, 3)},
        {"destination": "Khiva", "requests": max(total_leads // 4, 2)},
        {"destination": "Tashkent", "requests": max(total_leads // 5, 1)},
    ]

    return AgencyAnalyticsOut(
        total_leads=total_leads,
        new_leads=new_leads,
        contacted_leads=contacted_leads,
        negotiating_leads=negotiating_leads,
        won_leads=won_leads,
        lost_leads=lost_leads,
        conversion_rate=conversion_rate,
        total_bookings=total_bookings,
        total_revenue=total_revenue,
        leads_by_month=leads_by_month,
        revenue_by_month=revenue_by_month,
        top_destinations=top_destinations
    )
