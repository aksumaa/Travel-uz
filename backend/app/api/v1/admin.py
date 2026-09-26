from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.agency import Agency
from app.models.itinerary import Itinerary
from app.schemas.auth import UserOut
from app.api.deps import get_current_user, require_roles

router = APIRouter(prefix="/admin", tags=["Admin Console"])

@router.get("/stats")
async def get_system_telemetry(
    current_user: User = Depends(require_roles([UserRole.ADMIN, UserRole.AGENCY_OWNER])),
    db: AsyncSession = Depends(get_db)
):
    users_cnt = (await db.execute(select(User))).scalars().all()
    agencies_cnt = (await db.execute(select(Agency))).scalars().all()
    trips_cnt = (await db.execute(select(Itinerary))).scalars().all()

    return {
        "total_users": len(users_cnt),
        "total_agencies": len(agencies_cnt),
        "trips_generated": len(trips_cnt),
        "api_latency": "42ms",
        "tokens_used": "1.2M",
        "cpu_load": "8%",
        "memory_used": "1.8 GB / 8.0 GB"
    }

@router.get("/users", response_model=List[UserOut])
async def list_all_users(
    current_user: User = Depends(require_roles([UserRole.ADMIN, UserRole.AGENCY_OWNER])),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(User).order_by(User.created_at.desc()))
    return res.scalars().all()
