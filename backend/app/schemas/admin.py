from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class AdminOverviewOut(BaseModel):
    total_users: int
    total_destinations: int
    total_trips: int
    total_bookings: int
    total_revenue: float
    pending_reports: int
    verified_guides: int
    verified_agencies: int
    api_latency: str = "28ms"
    cpu_load: str = "6%"
    memory_used: str = "1.4 GB / 8.0 GB"

class AdminUserRoleUpdate(BaseModel):
    role: str # USER, GUIDE, AGENCY, ADMIN

class ReportCreate(BaseModel):
    target_type: str # user, review, trip, guide, agency
    target_id: int
    reason: str
    description: Optional[str] = None

class ReportResolve(BaseModel):
    status: str # reviewed, resolved, dismissed
    resolution_notes: Optional[str] = None

class ReportOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    reporter_user_id: int
    target_type: str
    target_id: int
    reason: str
    description: Optional[str] = None
    status: str
    resolution_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class AdminActionCreate(BaseModel):
    action_type: str # ban_user, unban_user, verify_guide, verify_agency, delete_review, resolve_report, update_role
    target_type: str
    target_id: int
    details: Optional[str] = None

class AdminActionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    admin_user_id: int
    action_type: str
    target_type: str
    target_id: int
    details: Optional[str] = None
    created_at: datetime
    updated_at: datetime
