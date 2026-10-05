from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class CommunityTripCreate(BaseModel):
    title: str
    destination: str
    dates: str
    budget: Optional[str] = "$300"
    description: Optional[str] = None
    max_participants: int = 6
    travel_style: Optional[str] = "Cultural"
    activities: Optional[str] = None

class CommunityTripUpdate(BaseModel):
    title: Optional[str] = None
    destination: Optional[str] = None
    dates: Optional[str] = None
    budget: Optional[str] = None
    description: Optional[str] = None
    max_participants: Optional[int] = None
    travel_style: Optional[str] = None
    activities: Optional[str] = None
    status: Optional[str] = None

class CommunityTripMemberOut(BaseModel):
    id: int
    trip_id: int
    user_id: int
    user_name: Optional[str] = None
    user_avatar: Optional[str] = None
    status: str # pending, accepted, rejected
    message: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class CommunityTripOut(BaseModel):
    id: int
    creator_id: int
    creator_name: Optional[str] = None
    creator_avatar: Optional[str] = None
    title: str
    destination: str
    dates: str
    budget: str
    description: Optional[str] = None
    max_participants: int
    travel_style: str
    activities: Optional[str] = None
    status: str
    created_at: datetime
    members_count: int = 1
    is_joined: bool = False
    is_saved: bool = False
    join_status: Optional[str] = None # None, "pending", "accepted", "rejected", "creator"
    members: List[CommunityTripMemberOut] = []

    class Config:
        from_attributes = True

class JoinTripRequest(BaseModel):
    message: Optional[str] = "Hi! I would love to join this trip."

class TripReportIn(BaseModel):
    reason: str
    details: Optional[str] = None
