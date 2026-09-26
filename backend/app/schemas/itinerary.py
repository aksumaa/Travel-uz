from pydantic import BaseModel
from typing import Optional, Any, Dict
from datetime import datetime

class TripGenerateRequest(BaseModel):
    destination: str
    days: Optional[int] = 3
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    budget: Optional[float] = 1500.0
    travelers: Optional[int] = 2
    style: Optional[str] = "Adventure"
    language: Optional[str] = "en"
    agency_id: Optional[int] = None
    package_id: Optional[int] = None

class ItineraryCreate(BaseModel):
    agency_id: Optional[int] = None
    package_id: Optional[int] = None
    title: str
    destination: str
    generated_by: Optional[str] = "ai"
    content_json: Dict[str, Any]

class ItineraryUpdate(BaseModel):
    title: Optional[str] = None
    destination: Optional[str] = None
    content_json: Optional[Dict[str, Any]] = None

class ItineraryOut(BaseModel):
    id: int
    agency_id: Optional[int] = None
    package_id: Optional[int] = None
    user_id: Optional[int] = None
    title: str
    destination: str
    generated_by: str
    content_json: Dict[str, Any]
    share_token: str
    created_at: datetime

    class Config:
        from_attributes = True

class PublicItineraryOut(BaseModel):
    id: int
    title: str
    destination: str
    content_json: Dict[str, Any]
    share_token: str
    created_at: datetime
    agency_name: Optional[str] = "TravelUZ Partner"
    agency_logo: Optional[str] = None
    agency_contact_email: Optional[str] = None
    agency_contact_phone: Optional[str] = None
