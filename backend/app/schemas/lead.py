from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PublicLeadCreate(BaseModel):
    share_token: str
    client_name: str
    client_contact: str
    notes: Optional[str] = None

class LeadCreate(BaseModel):
    agency_id: int
    client_name: str
    client_contact: str
    source: Optional[str] = "web"
    itinerary_id: Optional[int] = None
    notes: Optional[str] = None
    status: Optional[str] = "new"

class LeadUpdate(BaseModel):
    status: Optional[str] = None # new, contacted, negotiating, won, lost
    notes: Optional[str] = None
    client_name: Optional[str] = None
    client_contact: Optional[str] = None

class LeadOut(BaseModel):
    id: int
    agency_id: int
    client_name: str
    client_contact: str
    source: str
    itinerary_id: Optional[int] = None
    itinerary_title: Optional[str] = None
    status: str
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ConvertLeadToBooking(BaseModel):
    final_price: float
    currency: Optional[str] = "USD"
