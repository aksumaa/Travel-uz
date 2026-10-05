from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import func
from typing import List, Optional, Any
from datetime import datetime

from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.destination import Destination
from app.models.trip import Trip
from app.models.booking import Booking
from app.models.guide import Guide
from app.models.agency import Agency, AgencyVerification
from app.models.review import Review
from app.models.admin import Report, AdminAction
from app.schemas.auth import UserOut
from app.schemas.admin import (
    AdminOverviewOut, AdminUserRoleUpdate, ReportOut,
    AdminActionCreate, AdminActionOut
)
from app.schemas.agency import AgencyVerificationReview, AgencyVerificationOut
from app.api.deps import get_current_user, require_roles
from app.services.notification_service import create_notification

router = APIRouter(prefix="/admin", tags=["Admin Console"])

@router.get("/overview", response_model=AdminOverviewOut)
async def get_admin_overview(
    current_user: User = Depends(require_roles([UserRole.ADMIN.value])),
    db: AsyncSession = Depends(get_db)
):
    users_cnt = (await db.execute(select(func.count(User.id)))).scalar() or 0
    dest_cnt = (await db.execute(select(func.count(Destination.id)))).scalar() or 0
    trips_cnt = (await db.execute(select(func.count(Trip.id)))).scalar() or 0
    bookings_cnt = (await db.execute(select(func.count(Booking.id)))).scalar() or 0
    
    rev_res = await db.execute(select(func.sum(Booking.final_price)).where(Booking.status != "cancelled"))
    total_rev = float(rev_res.scalar() or 0.0)

    reports_cnt = (await db.execute(select(func.count(Report.id)).where(Report.status == "pending"))).scalar() or 0
    guides_cnt = (await db.execute(select(func.count(Guide.id)).where(Guide.is_verified == True))).scalar() or 0
    agencies_cnt = (await db.execute(select(func.count(Agency.id)).where(Agency.is_verified == True))).scalar() or 0

    return AdminOverviewOut(
        total_users=users_cnt,
        total_destinations=dest_cnt,
        total_trips=trips_cnt,
        total_bookings=bookings_cnt,
        total_revenue=round(total_rev, 2),
        pending_reports=reports_cnt,
        verified_guides=guides_cnt,
        verified_agencies=agencies_cnt,
        api_latency="28ms",
        cpu_load="6%",
        memory_used="1.4 GB / 8.0 GB"
    )

@router.get("/stats")
async def get_stats_legacy(
    current_user: User = Depends(require_roles([UserRole.ADMIN.value])),
    db: AsyncSession = Depends(get_db)
):
    users_cnt = (await db.execute(select(func.count(User.id)))).scalar() or 0
    agencies_cnt = (await db.execute(select(func.count(Agency.id)))).scalar() or 0
    trips_cnt = (await db.execute(select(func.count(Trip.id)))).scalar() or 0

    return {
        "total_users": users_cnt,
        "total_agencies": agencies_cnt,
        "trips_generated": trips_cnt,
        "api_latency": "28ms",
        "tokens_used": "1.4M",
        "cpu_load": "6%",
        "memory_used": "1.4 GB / 8.0 GB"
    }

@router.get("/users", response_model=List[UserOut])
async def list_all_users(
    role: Optional[str] = None,
    current_user: User = Depends(require_roles([UserRole.ADMIN.value])),
    db: AsyncSession = Depends(get_db)
):
    q = select(User)
    if role:
        q = q.where(User.role == role.upper())
    q = q.order_by(User.created_at.desc())
    res = await db.execute(q)
    return res.scalars().all()

@router.patch("/users/{user_id}/role")
async def update_user_role(
    user_id: int,
    role_in: AdminUserRoleUpdate,
    current_user: User = Depends(require_roles([UserRole.ADMIN.value])),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(User).where(User.id == user_id))
    user = res.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_role = role_in.role.upper()
    if new_role not in [UserRole.USER.value, UserRole.GUIDE.value, UserRole.AGENCY.value, UserRole.ADMIN.value]:
        raise HTTPException(status_code=400, detail="Invalid role. Must be USER, GUIDE, AGENCY, or ADMIN.")

    user.role = new_role
    db.add(user)

    action = AdminAction(
        admin_user_id=current_user.id,
        action_type="update_role",
        target_type="user",
        target_id=user.id,
        details=f"Role changed to {new_role}"
    )
    db.add(action)

    await create_notification(
        db=db,
        user_id=user.id,
        notification_type="admin_action",
        title="Role Updated",
        content=f"Your account role has been updated to {new_role}.",
        entity_type="user",
        entity_id=user.id
    )

    await db.commit()
    return {"message": f"User role updated to {new_role}.", "user_id": user.id, "new_role": new_role}

@router.patch("/users/{user_id}/status")
async def toggle_user_status(
    user_id: int,
    is_active: bool,
    current_user: User = Depends(require_roles([UserRole.ADMIN.value])),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(User).where(User.id == user_id))
    user = res.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot deactivate your own administrator account.")

    user.is_active = is_active
    db.add(user)

    status_str = "activated" if is_active else "deactivated"
    action = AdminAction(
        admin_user_id=current_user.id,
        action_type="unban_user" if is_active else "ban_user",
        target_type="user",
        target_id=user.id,
        details=f"User account {status_str}"
    )
    db.add(action)

    if not is_active:
        await create_notification(
            db=db,
            user_id=user.id,
            notification_type="admin_action",
            title="Account Status Notice",
            content="Your account has been deactivated by an administrator.",
            entity_type="user",
            entity_id=user.id
        )

    await db.commit()
    return {"message": f"User account {status_str}.", "user_id": user.id, "is_active": user.is_active}

# ----------------- Agency Verification Management -----------------

@router.get("/verifications", response_model=List[AgencyVerificationOut])
async def list_agency_verifications(
    status_filter: Optional[str] = "pending",
    current_user: User = Depends(require_roles([UserRole.ADMIN.value])),
    db: AsyncSession = Depends(get_db)
):
    q = select(AgencyVerification)
    if status_filter:
        q = q.where(AgencyVerification.status == status_filter)
    q = q.order_by(AgencyVerification.submitted_at.desc())
    res = await db.execute(q)
    return res.scalars().all()

@router.patch("/agencies/{agency_id}/verify", response_model=dict)
async def review_agency_verification(
    agency_id: int,
    review_in: AgencyVerificationReview,
    current_user: User = Depends(require_roles([UserRole.ADMIN.value])),
    db: AsyncSession = Depends(get_db)
):
    ag_res = await db.execute(select(Agency).where(Agency.id == agency_id))
    agency = ag_res.scalars().first()
    if not agency:
        raise HTTPException(status_code=404, detail="Agency not found")

    v_res = await db.execute(
        select(AgencyVerification)
        .where(AgencyVerification.agency_id == agency_id)
        .order_by(AgencyVerification.submitted_at.desc())
    )
    verif = v_res.scalars().first()
    now = datetime.utcnow()

    norm_status = review_in.status.lower()
    is_verified = (norm_status == "verified")

    if verif:
        verif.status = norm_status
        verif.reviewed_at = now
        verif.reviewer_notes = review_in.reviewer_notes
        verif.verified_by_user_id = current_user.id
        db.add(verif)

    agency.is_verified = is_verified
    db.add(agency)

    action = AdminAction(
        admin_user_id=current_user.id,
        action_type="verify_agency" if is_verified else "reject_agency_verification",
        target_type="agency",
        target_id=agency.id,
        details=f"Verification status: {norm_status}. Notes: {review_in.reviewer_notes}"
    )
    db.add(action)

    await create_notification(
        db=db,
        user_id=agency.owner_user_id,
        notification_type="admin_action",
        title="Agency Verification Update",
        content=f"Your agency '{agency.name}' verification is now: {norm_status.upper()}.",
        action_url=f"/agencies/{agency.id}",
        entity_type="agency",
        entity_id=agency.id
    )

    await db.commit()
    return {
        "message": f"Agency verification marked as {norm_status}.",
        "agency_id": agency.id,
        "is_verified": agency.is_verified,
        "status": norm_status
    }

@router.get("/reports", response_model=List[ReportOut])
async def list_reports(
    status_filter: Optional[str] = "pending",
    current_user: User = Depends(require_roles([UserRole.ADMIN.value])),
    db: AsyncSession = Depends(get_db)
):
    q = select(Report)
    if status_filter:
        q = q.where(Report.status == status_filter)
    q = q.order_by(Report.created_at.desc())
    res = await db.execute(q)
    return res.scalars().all()

@router.post("/actions", response_model=AdminActionOut)
async def perform_admin_action(
    action_in: AdminActionCreate,
    current_user: User = Depends(require_roles([UserRole.ADMIN.value])),
    db: AsyncSession = Depends(get_db)
):
    action = AdminAction(
        admin_user_id=current_user.id,
        action_type=action_in.action_type,
        target_type=action_in.target_type,
        target_id=action_in.target_id,
        details=action_in.details
    )
    db.add(action)

    if action_in.action_type == "verify_guide" and action_in.target_type == "guide":
        g_res = await db.execute(select(Guide).where(Guide.id == action_in.target_id))
        guide = g_res.scalars().first()
        if guide:
            guide.is_verified = True
            db.add(guide)
            await create_notification(
                db=db,
                user_id=guide.user_id,
                notification_type="admin_action",
                title="Guide Profile Verified!",
                content="Congratulations! Your tour guide profile has been officially verified by TripMind.",
                action_url=f"/guides/{guide.id}",
                entity_type="guide",
                entity_id=guide.id
            )
    elif action_in.action_type == "verify_agency" and action_in.target_type == "agency":
        ag_res = await db.execute(select(Agency).where(Agency.id == action_in.target_id))
        agency = ag_res.scalars().first()
        if agency:
            agency.is_verified = True
            db.add(agency)
            await create_notification(
                db=db,
                user_id=agency.owner_user_id,
                notification_type="admin_action",
                title="Agency Verified!",
                content=f"Your agency '{agency.name}' is now a verified partner on TripMind.",
                action_url=f"/agencies/{agency.id}",
                entity_type="agency",
                entity_id=agency.id
            )
    elif action_in.action_type == "delete_review" and action_in.target_type == "review":
        r_res = await db.execute(select(Review).where(Review.id == action_in.target_id))
        rev = r_res.scalars().first()
        if rev:
            await db.delete(rev)

    await db.commit()
    await db.refresh(action)
    return action
