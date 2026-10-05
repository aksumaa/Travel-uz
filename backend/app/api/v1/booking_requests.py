from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional

from app.db.session import get_db
from app.models.user import User
from app.models.agency import Agency
from app.models.guide import GuideProfile
from app.models.package import Package
from app.models.booking_request import BookingRequest
from app.schemas.booking_request import (
    BookingRequestCreate, BookingRequestStatusUpdate, BookingRequestOut
)
from app.api.deps import get_current_user
from app.services.notification_service import create_notification

router = APIRouter(prefix="/booking-requests", tags=["Booking Requests System"])

@router.post("", response_model=BookingRequestOut)
async def submit_booking_request(
    req_in: BookingRequestCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Verify agency or guide or package
    agency_name = None
    guide_name = None
    package_title = None

    if req_in.agency_id:
        ag_res = await db.execute(select(Agency).where(Agency.id == req_in.agency_id))
        agency = ag_res.scalars().first()
        if agency:
            agency_name = agency.name

    if req_in.guide_id:
        g_res = await db.execute(select(GuideProfile).where(GuideProfile.id == req_in.guide_id))
        guide = g_res.scalars().first()
        if guide:
            guide_name = guide.name

    if req_in.package_id:
        p_res = await db.execute(select(Package).where(Package.id == req_in.package_id))
        pkg = p_res.scalars().first()
        if pkg:
            package_title = pkg.title

    new_req = BookingRequest(
        user_id=current_user.id,
        target_type=req_in.target_type,
        agency_id=req_in.agency_id,
        guide_id=req_in.guide_id,
        package_id=req_in.package_id,
        service_title=req_in.service_title,
        booking_date=req_in.booking_date,
        participants=req_in.participants,
        total_price=req_in.total_price,
        currency=req_in.currency or "USD",
        message=req_in.message,
        status="PENDING"
    )
    db.add(new_req)
    await db.commit()
    await db.refresh(new_req)

    # Notify provider (guide or agency owner)
    if req_in.guide_id:
        g_res = await db.execute(select(GuideProfile).where(GuideProfile.id == req_in.guide_id))
        guide = g_res.scalars().first()
        if guide:
            await create_notification(
                db,
                user_id=guide.user_id,
                title="New Booking Request!",
                message=f"New request from {current_user.name or 'a traveler'} for '{req_in.service_title}' on {req_in.booking_date}.",
                notification_type="booking_update",
                link="/guides"
            )
    elif req_in.agency_id:
        ag_res = await db.execute(select(Agency).where(Agency.id == req_in.agency_id))
        agency = ag_res.scalars().first()
        if agency and agency.owner_user_id:
            await create_notification(
                db,
                user_id=agency.owner_user_id,
                title="New Agency Booking Request!",
                message=f"New booking request from {current_user.name or 'a traveler'} for '{req_in.service_title}'.",
                notification_type="booking_update",
                link="/agency/dashboard"
            )

    return BookingRequestOut(
        id=new_req.id,
        user_id=new_req.user_id,
        user_name=current_user.name,
        user_avatar=current_user.avatar,
        user_email=current_user.email,
        target_type=new_req.target_type,
        agency_id=new_req.agency_id,
        agency_name=agency_name,
        guide_id=new_req.guide_id,
        guide_name=guide_name,
        package_id=new_req.package_id,
        package_title=package_title,
        service_title=new_req.service_title,
        booking_date=new_req.booking_date,
        participants=new_req.participants,
        total_price=new_req.total_price,
        currency=new_req.currency,
        message=new_req.message,
        status=new_req.status,
        created_at=new_req.created_at,
        updated_at=new_req.updated_at
    )

@router.get("/my", response_model=List[BookingRequestOut])
async def list_my_booking_requests(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(BookingRequest)
        .where(BookingRequest.user_id == current_user.id)
        .order_by(BookingRequest.created_at.desc())
    )
    res = await db.execute(stmt)
    reqs = res.scalars().all()

    out = []
    for r in reqs:
        agency_name = None
        guide_name = None
        package_title = None

        if r.agency_id:
            ag_res = await db.execute(select(Agency).where(Agency.id == r.agency_id))
            agency = ag_res.scalars().first()
            if agency:
                agency_name = agency.name

        if r.guide_id:
            g_res = await db.execute(select(GuideProfile).where(GuideProfile.id == r.guide_id))
            guide = g_res.scalars().first()
            if guide:
                guide_name = guide.name

        if r.package_id:
            p_res = await db.execute(select(Package).where(Package.id == r.package_id))
            pkg = p_res.scalars().first()
            if pkg:
                package_title = pkg.title

        out.append(BookingRequestOut(
            id=r.id,
            user_id=r.user_id,
            user_name=current_user.name,
            user_avatar=current_user.avatar,
            user_email=current_user.email,
            target_type=r.target_type,
            agency_id=r.agency_id,
            agency_name=agency_name,
            guide_id=r.guide_id,
            guide_name=guide_name,
            package_id=r.package_id,
            package_title=package_title,
            service_title=r.service_title,
            booking_date=r.booking_date,
            participants=r.participants,
            total_price=r.total_price,
            currency=r.currency,
            message=r.message,
            status=r.status,
            created_at=r.created_at,
            updated_at=r.updated_at
        ))

    return out

@router.get("/provider", response_model=List[BookingRequestOut])
async def list_provider_booking_requests(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Check if user owns agency or is a guide
    ag_res = await db.execute(select(Agency).where(Agency.owner_user_id == current_user.id))
    agency = ag_res.scalars().first()

    g_res = await db.execute(select(GuideProfile).where(GuideProfile.user_id == current_user.id))
    guide = g_res.scalars().first()

    if not agency and not guide:
        return []

    conditions = []
    if agency:
        conditions.append(BookingRequest.agency_id == agency.id)
    if guide:
        conditions.append(BookingRequest.guide_id == guide.id)

    from sqlalchemy import or_
    stmt = select(BookingRequest).where(or_(*conditions)).order_by(BookingRequest.created_at.desc())
    res = await db.execute(stmt)
    reqs = res.scalars().all()

    out = []
    for r in reqs:
        u_res = await db.execute(select(User).where(User.id == r.user_id))
        u = u_res.scalars().first()

        out.append(BookingRequestOut(
            id=r.id,
            user_id=r.user_id,
            user_name=u.name if u else "Traveler",
            user_avatar=u.avatar if u else None,
            user_email=u.email if u else None,
            target_type=r.target_type,
            agency_id=r.agency_id,
            agency_name=agency.name if agency else None,
            guide_id=r.guide_id,
            guide_name=guide.name if guide else None,
            package_id=r.package_id,
            service_title=r.service_title,
            booking_date=r.booking_date,
            participants=r.participants,
            total_price=r.total_price,
            currency=r.currency,
            message=r.message,
            status=r.status,
            created_at=r.created_at,
            updated_at=r.updated_at
        ))

    return out

@router.patch("/{request_id}/status", response_model=BookingRequestOut)
async def update_booking_request_status(
    request_id: int,
    status_in: BookingRequestStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    new_status = status_in.status.upper()
    allowed_statuses = ["PENDING", "CONFIRMED", "REJECTED", "CANCELLED", "COMPLETED"]
    if new_status not in allowed_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {allowed_statuses}")

    res = await db.execute(select(BookingRequest).where(BookingRequest.id == request_id))
    b_req = res.scalars().first()
    if not b_req:
        raise HTTPException(status_code=404, detail="Booking request not found")

    # Check permission
    is_client = (b_req.user_id == current_user.id)
    is_guide = False
    if b_req.guide_id:
        g_res = await db.execute(select(GuideProfile).where(GuideProfile.id == b_req.guide_id))
        guide = g_res.scalars().first()
        if guide and guide.user_id == current_user.id:
            is_guide = True

    is_agency_owner = False
    if b_req.agency_id:
        ag_res = await db.execute(select(Agency).where(Agency.id == b_req.agency_id))
        agency = ag_res.scalars().first()
        if agency and agency.owner_user_id == current_user.id:
            is_agency_owner = True

    if not (is_client or is_guide or is_agency_owner):
        raise HTTPException(status_code=403, detail="Not authorized to update this booking request.")

    # Client can only cancel
    if is_client and not (is_guide or is_agency_owner):
        if new_status != "CANCELLED":
            raise HTTPException(status_code=400, detail="Client can only cancel a booking request.")

    b_req.status = new_status
    db.add(b_req)
    await db.commit()
    await db.refresh(b_req)

    # Send Notification
    if is_guide or is_agency_owner:
        # Notify the client
        await create_notification(
            db,
            user_id=b_req.user_id,
            title=f"Booking Request {new_status.title()}",
            message=f"Your booking request for '{b_req.service_title}' is now {new_status}.",
            notification_type="booking_update",
            link="/bookings"
        )
    elif is_client and new_status == "CANCELLED":
        # Notify the provider
        provider_user_id = None
        if b_req.guide_id:
            g_res = await db.execute(select(GuideProfile).where(GuideProfile.id == b_req.guide_id))
            g = g_res.scalars().first()
            if g:
                provider_user_id = g.user_id
        elif b_req.agency_id:
            ag_res = await db.execute(select(Agency).where(Agency.id == b_req.agency_id))
            ag = ag_res.scalars().first()
            if ag:
                provider_user_id = ag.owner_user_id

        if provider_user_id:
            await create_notification(
                db,
                user_id=provider_user_id,
                title="Booking Request Cancelled",
                message=f"Client {current_user.name or 'User'} cancelled booking request #{b_req.id}.",
                notification_type="booking_update",
                link="/agency/dashboard"
            )

    return BookingRequestOut(
        id=b_req.id,
        user_id=b_req.user_id,
        user_name=current_user.name,
        user_avatar=current_user.avatar,
        user_email=current_user.email,
        target_type=b_req.target_type,
        agency_id=b_req.agency_id,
        guide_id=b_req.guide_id,
        package_id=b_req.package_id,
        service_title=b_req.service_title,
        booking_date=b_req.booking_date,
        participants=b_req.participants,
        total_price=b_req.total_price,
        currency=b_req.currency,
        message=b_req.message,
        status=b_req.status,
        created_at=b_req.created_at,
        updated_at=b_req.updated_at
    )
