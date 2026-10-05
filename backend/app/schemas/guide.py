from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel

class GuideServiceItem(BaseModel):
    id: str
    name: str
    duration: str
    price: float

class GuideProfileCreate(BaseModel):
    name: str
    photo: Optional[str] = None
    bio: Optional[str] = None
    languages: str = "English, Uzbek, Russian"
    location: str = "Samarkand, Uzbekistan"
    specialties: Optional[str] = "Silk Road History, Architecture"
    experience: str = "5+ years licensed guide"
    price_per_day: float = 70.0
    currency: str = "USD"
    availability: Optional[str] = "available"
    services: Optional[List[dict]] = []

class GuideProfileUpdate(BaseModel):
    name: Optional[str] = None
    photo: Optional[str] = None
    bio: Optional[str] = None
    languages: Optional[str] = None
    location: Optional[str] = None
    specialties: Optional[str] = None
    experience: Optional[str] = None
    price_per_day: Optional[float] = None
    currency: Optional[str] = None
    availability: Optional[str] = None
    services: Optional[List[dict]] = None

class GuideProfileOut(BaseModel):
    id: int
    user_id: int
    name: str
    photo: Optional[str] = None
    bio: Optional[str] = None
    languages: str
    location: str
    specialties: Optional[str] = None
    experience: str
    price_per_day: float
    currency: str
    rating: float
    review_count: int
    availability: str
    services: List[dict] = []
    created_at: datetime

    class Config:
        from_attributes = True
