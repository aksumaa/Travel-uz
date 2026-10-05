from datetime import datetime, date
from typing import Optional, List, Any
from pydantic import BaseModel, Field, ConfigDict

class TripActivityCreate(BaseModel):
    place_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    location_name: str
    item_type: str = "attraction" # attraction, restaurant, cafe, transport, shopping, entertainment
    time_slot: str = "morning" # morning, afternoon, evening
    time_start: Optional[str] = None
    duration_hours: float = 1.5
    estimated_cost: float = 0.0
    currency: str = "USD"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_verified: bool = False
    notes: Optional[str] = None
    details_json: Optional[dict] = None
    order_index: int = 0

TripItemCreate = TripActivityCreate

class TripActivityUpdate(BaseModel):
    place_id: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    location_name: Optional[str] = None
    item_type: Optional[str] = None
    time_slot: Optional[str] = None
    time_start: Optional[str] = None
    duration_hours: Optional[float] = None
    estimated_cost: Optional[float] = None
    currency: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_verified: Optional[bool] = None
    notes: Optional[str] = None
    details_json: Optional[dict] = None
    order_index: Optional[int] = None

TripItemUpdate = TripActivityUpdate

class TripActivityOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    trip_day_id: int
    place_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    location_name: str
    item_type: str = "attraction"
    time_slot: str
    time_start: Optional[str] = None
    duration_hours: float
    estimated_cost: float
    currency: str = "USD"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_verified: bool = False
    notes: Optional[str] = None
    details_json: Optional[dict] = None
    order_index: int
    created_at: datetime
    updated_at: datetime

TripItemOut = TripActivityOut

class TripDayCreate(BaseModel):
    day_number: int
    date: Optional[date] = None
    title: str
    notes: Optional[str] = None
    daily_budget: float = 0.0
    activities: List[TripActivityCreate] = []

class TripDayUpdate(BaseModel):
    day_number: Optional[int] = None
    date: Optional[date] = None
    title: Optional[str] = None
    notes: Optional[str] = None
    daily_budget: Optional[float] = None

class TripDayOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    trip_id: int
    day_number: int
    date: Optional[date] = None
    title: str
    notes: Optional[str] = None
    daily_budget: float
    activities: List[TripActivityOut] = []
    created_at: datetime
    updated_at: datetime

class TripPreferencesUpdate(BaseModel):
    budget_bracket: Optional[str] = None # $, $$, $$$, $$$$
    pace: Optional[str] = None # leisurely, balanced, fast
    comfort_level: Optional[str] = None # backpacker, boutique, luxury
    dining_preferences: Optional[List[str]] = None
    transport_preferences: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    preferred_currency: Optional[str] = None

class TripAdaptRequest(BaseModel):
    prompt: str # e.g. "I'm tired", "It's raining", "$40 left today", "Move activities closer"
    current_day_number: Optional[int] = None
    current_time_slot: Optional[str] = "afternoon"
    current_latitude: Optional[float] = None
    current_longitude: Optional[float] = None
    apply_immediately: bool = False

class TripCreate(BaseModel):
    title: str
    destination: str
    destination_id: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    duration_days: int = 3
    estimated_budget: float = 0.0
    currency: str = "USD"
    travelers_count: int = 1
    travel_style: str = "Cultural Heritage"
    status: str = "planned"
    is_public: bool = False
    content_json: Optional[dict] = None
    preferences_json: Optional[dict] = None
    days: Optional[List[TripDayCreate]] = []

class TripUpdate(BaseModel):
    title: Optional[str] = None
    destination: Optional[str] = None
    destination_id: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    duration_days: Optional[int] = None
    estimated_budget: Optional[float] = None
    currency: Optional[str] = None
    travelers_count: Optional[int] = None
    travel_style: Optional[str] = None
    status: Optional[str] = None
    is_public: Optional[bool] = None
    is_archived: Optional[bool] = None
    content_json: Optional[dict] = None
    preferences_json: Optional[dict] = None

class TripListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: Optional[int] = None
    destination_id: Optional[int] = None
    title: str
    destination: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    duration_days: int
    estimated_budget: float
    currency: str
    travelers_count: int
    travel_style: str
    status: str
    is_public: bool
    is_archived: bool = False
    share_token: str
    created_at: datetime
    updated_at: datetime
    budget_disclaimer: str = "Estimates are approximate and subject to seasonal fluctuation and local availability."

class TripOut(TripListItem):
    content_json: Optional[dict] = None
    preferences_json: Optional[dict] = None
    days: List[TripDayOut] = []

class SavedTripOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    trip_id: int
    created_at: datetime
    trip: TripListItem
