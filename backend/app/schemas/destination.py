from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = "landmark"

class CategoryCreate(CategoryBase):
    pass

class CategoryOut(CategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PlaceBase(BaseModel):
    name: str
    slug: str
    description: str
    latitude: float
    longitude: float
    opening_hours: Optional[str] = "09:00 - 18:00"
    entry_fee: float = 0.0
    currency: str = "USD"
    image_url: Optional[str] = None

class PlaceCreate(PlaceBase):
    destination_id: int
    category_id: Optional[int] = None

class PlaceOut(PlaceBase):
    id: int
    destination_id: int
    category_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DestinationBase(BaseModel):
    name: str
    slug: str
    region: str
    description: str
    latitude: float
    longitude: float
    budget_tier: str = "moderate"
    average_cost_per_day: float = 50.0
    recommended_duration_days: int = 3
    best_season: str = "Spring & Autumn"
    image_url: Optional[str] = None
    gallery: Optional[List[str]] = []
    is_featured: bool = False

class DestinationCreate(DestinationBase):
    category_id: Optional[int] = None

class DestinationUpdate(BaseModel):
    name: Optional[str] = None
    region: Optional[str] = None
    description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    budget_tier: Optional[str] = None
    average_cost_per_day: Optional[float] = None
    recommended_duration_days: Optional[int] = None
    best_season: Optional[str] = None
    image_url: Optional[str] = None
    gallery: Optional[List[str]] = None
    is_featured: Optional[bool] = None

class DestinationListItem(BaseModel):
    id: int
    name: str
    slug: str
    region: str
    description: str
    latitude: float
    longitude: float
    budget_tier: str
    average_cost_per_day: float
    recommended_duration_days: int
    best_season: str
    image_url: Optional[str] = None
    is_featured: bool
    rating: float = 4.9
    reviews_count: int = 0
    category: Optional[CategoryOut] = None

    class Config:
        from_attributes = True

class DestinationDetailOut(DestinationListItem):
    gallery: List[str] = []
    places: List[PlaceOut] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SavedDestinationToggle(BaseModel):
    notes: Optional[str] = None

class SavedDestinationOut(BaseModel):
    id: int
    user_id: int
    destination_id: int
    notes: Optional[str] = None
    created_at: datetime
    destination: DestinationListItem

    class Config:
        from_attributes = True

class SearchResultItem(BaseModel):
    id: int
    type: str # destination, place, guide, package, community_trip
    title: str
    subtitle: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    slug: Optional[str] = None
    price: Optional[float] = None
    rating: Optional[float] = None

class UnifiedSearchResponse(BaseModel):
    query: str
    total_results: int
    destinations: List[SearchResultItem] = []
    places: List[SearchResultItem] = []
    guides: List[SearchResultItem] = []
    packages: List[SearchResultItem] = []
    community_trips: List[SearchResultItem] = []
