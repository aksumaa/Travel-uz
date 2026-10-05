from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List
from datetime import datetime

class AgencyVerificationCreate(BaseModel):
    business_registration_number: Optional[str] = None
    license_number: Optional[str] = None
    document_url: Optional[str] = None
    notes: Optional[str] = None

class AgencyVerificationReview(BaseModel):
    status: str # "verified" or "rejected"
    reviewer_notes: Optional[str] = None

class AgencyVerificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    agency_id: int
    status: str
    business_registration_number: Optional[str] = None
    license_number: Optional[str] = None
    document_url: Optional[str] = None
    notes: Optional[str] = None
    submitted_at: datetime
    reviewed_at: Optional[datetime] = None
    reviewer_notes: Optional[str] = None

class AgencyOnboardRequest(BaseModel):
    name: str
    logo_url: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None
    website: Optional[str] = None
    telegram_channel: Optional[str] = None
    whatsapp: Optional[str] = None
    subscription_tier: Optional[str] = "starter" # starter, pro, enterprise
    description: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = "Tashkent"

class AgencyUpdateRequest(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None
    website: Optional[str] = None
    telegram_channel: Optional[str] = None
    whatsapp: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    subscription_tier: Optional[str] = None
    telegram_bot_token: Optional[str] = None
    telegram_chat_id: Optional[str] = None
    description: Optional[str] = None

class AgencyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: Optional[str] = None
    logo_url: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    website: Optional[str] = None
    telegram_channel: Optional[str] = None
    whatsapp: Optional[str] = None
    owner_user_id: int
    subscription_tier: str
    description: Optional[str] = None
    address: Optional[str] = None
    city: str = "Tashkent"
    rating: float = 5.0
    reviews_count: int = 0
    is_verified: bool = False
    has_telegram_bot: bool = False
    telegram_chat_id: Optional[str] = None
    latest_verification: Optional[AgencyVerificationOut] = None
    created_at: datetime

class AgencyDetailOut(AgencyOut):
    packages: List[dict] = []
    services: List[dict] = []
    reviews: List[dict] = []

class AgencyAnalyticsOut(BaseModel):
    total_leads: int
    new_leads: int
    contacted_leads: int
    negotiating_leads: int
    won_leads: int
    lost_leads: int
    conversion_rate: float
    total_bookings: int
    total_revenue: float
    leads_by_month: List[dict]
    revenue_by_month: List[dict]
    top_destinations: List[dict]
