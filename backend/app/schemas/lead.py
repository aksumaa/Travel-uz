from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class PublicLeadCreate(BaseModel):
    share_token: Optional[str] = None
    package_id: Optional[int] = None
    trip_id: Optional[int] = None
    client_name: str
    client_contact: str # phone, email, or telegram handle
    client_email: Optional[str] = None
    client_phone: Optional[str] = None
    preferred_contact_method: Optional[str] = "email" # email, phone, telegram, whatsapp
    travelers_count: Optional[int] = 1
    travel_date: Optional[str] = None
    budget: Optional[float] = None
    currency: Optional[str] = "USD"
    notes: Optional[str] = None

class LeadCreate(BaseModel):
    agency_id: int
    client_name: str
    client_contact: str
    client_email: Optional[str] = None
    client_phone: Optional[str] = None
    preferred_contact_method: Optional[str] = "email"
    source: Optional[str] = "web"
    package_id: Optional[int] = None
    trip_id: Optional[int] = None
    itinerary_id: Optional[int] = None
    travelers_count: Optional[int] = 1
    travel_date: Optional[str] = None
    budget: Optional[float] = None
    currency: Optional[str] = "USD"
    status: Optional[str] = "new" # new, contacted, interested, booked, rejected
    notes: Optional[str] = None

class LeadUpdate(BaseModel):
    status: Optional[str] = None # new, contacted, interested, booked, rejected (or legacy: negotiating, won, lost)
    notes: Optional[str] = None
    client_name: Optional[str] = None
    client_contact: Optional[str] = None
    client_email: Optional[str] = None
    client_phone: Optional[str] = None
    preferred_contact_method: Optional[str] = None
    travelers_count: Optional[int] = None
    travel_date: Optional[str] = None
    budget: Optional[float] = None
    currency: Optional[str] = None

class LeadOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    agency_id: int
    client_name: str
    client_contact: str
    client_email: Optional[str] = None
    client_phone: Optional[str] = None
    preferred_contact_method: str = "email"
    source: str
    package_id: Optional[int] = None
    trip_id: Optional[int] = None
    itinerary_id: Optional[int] = None
    itinerary_title: Optional[str] = None
    package_title: Optional[str] = None
    travelers_count: int = 1
    travel_date: Optional[str] = None
    budget: Optional[float] = None
    currency: str = "USD"
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

class ConvertLeadToBooking(BaseModel):
    final_price: float
    currency: Optional[str] = "USD"
