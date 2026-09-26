from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BookingCreate(BaseModel):
    lead_id: Optional[int] = None
    agency_id: int
    final_price: float
    currency: Optional[str] = "USD"
    status: Optional[str] = "confirmed"

class BookingUpdate(BaseModel):
    final_price: Optional[float] = None
    currency: Optional[str] = None
    status: Optional[str] = None # pending, confirmed, cancelled

class BookingOut(BaseModel):
    id: int
    lead_id: Optional[int] = None
    agency_id: int
    client_name: Optional[str] = None
    client_contact: Optional[str] = None
    final_price: float
    currency: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
