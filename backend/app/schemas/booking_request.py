from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class BookingRequestCreate(BaseModel):
    target_type: str # "agency", "guide", "package"
    agency_id: Optional[int] = None
    guide_id: Optional[int] = None
    package_id: Optional[int] = None
    service_title: str
    booking_date: str
    participants: int = 1
    total_price: float = 0.0
    currency: str = "USD"
    message: Optional[str] = None

class BookingRequestStatusUpdate(BaseModel):
    status: str # "PENDING", "CONFIRMED", "REJECTED", "CANCELLED", "COMPLETED"

class BookingRequestOut(BaseModel):
    id: int
    user_id: int
    user_name: Optional[str] = None
    user_avatar: Optional[str] = None
    user_email: Optional[str] = None
    target_type: str
    agency_id: Optional[int] = None
    agency_name: Optional[str] = None
    guide_id: Optional[int] = None
    guide_name: Optional[str] = None
    package_id: Optional[int] = None
    package_title: Optional[str] = None
    service_title: str
    booking_date: str
    participants: int
    total_price: float
    currency: str
    message: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
