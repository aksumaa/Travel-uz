from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class UserProfileOut(BaseModel):
    id: int
    name: Optional[str] = None
    avatar: Optional[str] = None
    bio: Optional[str] = None
    destination: Optional[str] = None
    travel_dates: Optional[str] = None
    interests: Optional[str] = None
    travel_style: Optional[str] = None
    location: Optional[str] = None
    friendship_status: Optional[str] = None # None, "pending_sent", "pending_received", "friends"

    class Config:
        from_attributes = True

class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None
    bio: Optional[str] = None
    destination: Optional[str] = None
    travel_dates: Optional[str] = None
    interests: Optional[str] = None
    travel_style: Optional[str] = None
    location: Optional[str] = None

class FriendRequestIn(BaseModel):
    receiver_id: int

class FriendRequestOut(BaseModel):
    id: int
    requester_id: int
    receiver_id: int
    requester_name: Optional[str] = None
    requester_avatar: Optional[str] = None
    requester_destination: Optional[str] = None
    requester_dates: Optional[str] = None
    receiver_name: Optional[str] = None
    receiver_avatar: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class UserBlockIn(BaseModel):
    blocked_id: int

class UserReportIn(BaseModel):
    reported_user_id: int
    reason: str
    details: Optional[str] = None
