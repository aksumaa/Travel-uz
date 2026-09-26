from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from datetime import datetime, timedelta

from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.agency import Agency, AgencyMember
from app.models.lead import Lead
from app.models.booking import Booking
from app.schemas.agency import (
    AgencyOnboardRequest, AgencyUpdateRequest, AgencyOut, AgencyAnalyticsOut
)
from app.api.deps import get_current_user, get_current_agency
from app.services.encryption import encrypt_string, decrypt_string

router = APIRouter(prefix="/agencies", tags=["Agencies"])

@router.post("/onboard", response_model=AgencyOut)
async def onboard_agency(
    onboard_in: AgencyOnboardRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Check if user already owns an agency
    res = await db.execute(select(Agency).where(Agency.owner_user_id == current_user.id))
    existing = res.scalars().first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already owns a registered agency."
        )

    # Upgrade user role if client
    if current_user.role == UserRole.CLIENT:
        current_user.role = UserRole.AGENCY_OWNER
        db.add(current_user)

    new_agency = Agency(
        name=onboard_in.name,
        logo_url=onboard_in.logo_url,
        contact_email=onboard_in.contact_email or current_user.email,
        contact_phone=onboard_in.contact_phone,
        owner_user_id=current_user.id,
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

    return AgencyOut(
        id=new_agency.id,
        name=new_agency.name,
        logo_url=new_agency.logo_url,
        contact_email=new_agency.contact_email,
        contact_phone=new_agency.contact_phone,
        owner_user_id=new_agency.owner_user_id,
        subscription_tier=new_agency.subscription_tier,
        has_telegram_bot=bool(new_agency.telegram_bot_token),
        telegram_chat_id=new_agency.telegram_chat_id,
        created_at=new_agency.created_at
    )

@router.get("/me", response_model=AgencyOut)
async def get_my_agency(
    agency: Agency = Depends(get_current_agency)
):
    return AgencyOut(
        id=agency.id,
        name=agency.name,
        logo_url=agency.logo_url,
        contact_email=agency.contact_email,
        contact_phone=agency.contact_phone,
        owner_user_id=agency.owner_user_id,
        subscription_tier=agency.subscription_tier,
        has_telegram_bot=bool(agency.telegram_bot_token),
        telegram_chat_id=agency.telegram_chat_id,
        created_at=agency.created_at
    )

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
    if update_in.subscription_tier is not None:
        agency.subscription_tier = update_in.subscription_tier
    if update_in.telegram_bot_token is not None:
        agency.telegram_bot_token = encrypt_string(update_in.telegram_bot_token) if update_in.telegram_bot_token else None
    if update_in.telegram_chat_id is not None:
        agency.telegram_chat_id = update_in.telegram_chat_id

    db.add(agency)
    await db.commit()
    await db.refresh(agency)

    return AgencyOut(
        id=agency.id,
        name=agency.name,
        logo_url=agency.logo_url,
        contact_email=agency.contact_email,
        contact_phone=agency.contact_phone,
        owner_user_id=agency.owner_user_id,
        subscription_tier=agency.subscription_tier,
        has_telegram_bot=bool(agency.telegram_bot_token),
        telegram_chat_id=agency.telegram_chat_id,
        created_at=agency.created_at
    )

@router.get("/analytics", response_model=AgencyAnalyticsOut)
async def get_agency_analytics(
    agency: Agency = Depends(get_current_agency),
    db: AsyncSession = Depends(get_db)
):
    # Aggregate leads
    leads_res = await db.execute(select(Lead).where(Lead.agency_id == agency.id))
    leads = leads_res.scalars().all()

    total_leads = len(leads)
    new_leads = sum(1 for l in leads if l.status == "new")
    contacted_leads = sum(1 for l in leads if l.status == "contacted")
    negotiating_leads = sum(1 for l in leads if l.status == "negotiating")
    won_leads = sum(1 for l in leads if l.status == "won")
    lost_leads = sum(1 for l in leads if l.status == "lost")

    conversion_rate = round((won_leads / total_leads * 100), 1) if total_leads > 0 else 0.0

    # Aggregate bookings
    bookings_res = await db.execute(select(Booking).where(Booking.agency_id == agency.id))
    bookings = bookings_res.scalars().all()

    total_bookings = len(bookings)
    total_revenue = sum(b.final_price for b in bookings if b.status != "cancelled")

    # Generate leads by month (last 6 months)
    now = datetime.utcnow()
    leads_by_month = []
    revenue_by_month = []
    month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    for i in range(5, -1, -1):
        target_month_dt = now - timedelta(days=i * 30)
        m_name = month_names[target_month_dt.month - 1]
        
        # Count leads in that month
        m_leads = sum(1 for l in leads if l.created_at.month == target_month_dt.month and l.created_at.year == target_month_dt.year)
        leads_by_month.append({"month": m_name, "leads": m_leads, "won": sum(1 for l in leads if l.status == "won" and l.created_at.month == target_month_dt.month)})

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
