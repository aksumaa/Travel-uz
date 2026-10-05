from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any
from datetime import datetime

class TourImageCreate(BaseModel):
    image_url: str
    caption: Optional[str] = None
    is_cover: bool = False
    order_index: int = 0

class TourImageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    package_id: int
    image_url: str
    caption: Optional[str] = None
    is_cover: bool
    order_index: int
    created_at: datetime

class PackageCreate(BaseModel):
    title: str
    destination: str
    days: int = 3
    price: float = 0.0
    currency: str = "USD"
    description: Optional[str] = None
    included_services: Optional[str] = None
    excluded_services: Optional[str] = None
    status: Optional[str] = "published" # draft, published, archived
    image_url: Optional[str] = None
    availability: Optional[List[Any]] = None
    min_group_size: Optional[int] = 1
    max_group_size: Optional[int] = 20
    languages: Optional[List[str]] = None
    itinerary_highlights: Optional[List[Any]] = None
    is_featured: bool = False
    translations_json: Optional[dict] = None

class PackageUpdate(BaseModel):
    title: Optional[str] = None
    destination: Optional[str] = None
    days: Optional[int] = None
    price: Optional[float] = None
    currency: Optional[str] = None
    description: Optional[str] = None
    included_services: Optional[str] = None
    excluded_services: Optional[str] = None
    status: Optional[str] = None
    image_url: Optional[str] = None
    availability: Optional[List[Any]] = None
    min_group_size: Optional[int] = None
    max_group_size: Optional[int] = None
    languages: Optional[List[str]] = None
    itinerary_highlights: Optional[List[Any]] = None
    is_featured: Optional[bool] = None
    translations_json: Optional[dict] = None

class PackageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    agency_id: int
    agency_name: Optional[str] = None
    title: str
    slug: str
    destination: str
    days: int
    price: float
    currency: str = "USD"
    description: Optional[str] = None
    included_services: Optional[str] = None
    excluded_services: Optional[str] = None
    status: str
    image_url: Optional[str] = None
    availability: Optional[List[Any]] = None
    min_group_size: int = 1
    max_group_size: Optional[int] = None
    languages: Optional[List[str]] = None
    itinerary_highlights: Optional[List[Any]] = None
    is_featured: bool = False
    translations_json: Optional[dict] = None
    images: List[TourImageOut] = []
    created_at: datetime
    updated_at: datetime

TourPackageOut = PackageOut

class TourMatchOut(BaseModel):
    package: PackageOut
    match_score: int # 0 to 100 percentage
    match_reasons: List[str]
    tradeoff_summary: str

class TourComparisonItem(BaseModel):
    id: str # e.g. "package_1" or "diy_trip_1"
    name: str
    type: str # "agency_package" or "diy_itinerary"
    total_cost: float
    cost_per_person: float
    currency: str
    accommodation: str
    transportation: str
    guided_experience: str
    sight_admissions: str
    effort_required: str # "Low / Turnkey", "Medium", "High (Self-managed)"
    flexibility: str # "100% Modifiable", "Fixed Daily Milestones"
    direct_booking_channel: str
    highlights: List[str]

class TourComparisonOut(BaseModel):
    dimensions: List[str]
    items: List[TourComparisonItem]
