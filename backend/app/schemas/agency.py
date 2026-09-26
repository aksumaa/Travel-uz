from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class AgencyOnboardRequest(BaseModel):
    name: str
    logo_url: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None
    subscription_tier: Optional[str] = "starter" # starter, pro, enterprise

class AgencyUpdateRequest(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None
    subscription_tier: Optional[str] = None
    telegram_bot_token: Optional[str] = None
    telegram_chat_id: Optional[str] = None

class AgencyOut(BaseModel):
    id: int
    name: str
    logo_url: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    owner_user_id: int
    subscription_tier: str
    has_telegram_bot: bool = False
    telegram_chat_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

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
