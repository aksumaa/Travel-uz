from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Dict, Any, Union

class OpeningHoursStatus(BaseModel):
    has_reliable_hours: bool = False
    is_open_now: Optional[bool] = None
    status: str = "unknown"  # "open", "closed", "unknown"
    status_label: str = "Hours not verified"  # "Open now", "Closed", "Hours not verified"
    local_time: Optional[str] = None
    local_timezone: Optional[str] = None
    next_change: Optional[str] = None
    raw_hours: Optional[str] = None

class PlaceSummary(BaseModel):
    place_id: str
    name: str
    category: str  # attraction, museum, restaurant, cafe, shopping, entertainment, pharmacy, hospital, atm, transport, tourist_info
    localized_category: Optional[str] = None
    address: Optional[str] = None
    latitude: float
    longitude: float
    rating: Optional[float] = None
    reviews_count: Optional[int] = None
    price_level: Optional[int] = None  # 1, 2, 3, 4
    image_url: Optional[str] = None
    is_verified: bool = False
    distance_meters: Optional[float] = None
    walking_time_minutes: Optional[int] = None
    opening_status: Optional[OpeningHoursStatus] = None

class PlaceDetail(PlaceSummary):
    description: Optional[str] = None
    photos: List[str] = Field(default_factory=list)
    phone: Optional[str] = None
    website: Optional[str] = None
    google_maps_url: Optional[str] = None
    opening_hours: Optional[str] = None
    opening_periods: Optional[List[Dict[str, Any]]] = None
    estimated_cost: Optional[float] = None
    currency: str = "USD"
    timezone: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None

class TransitStep(BaseModel):
    instruction: str
    mode: str = "WALKING"  # WALKING, TRANSIT, DRIVING
    distance_meters: float
    duration_seconds: int
    line_name: Optional[str] = None
    line_symbol: Optional[str] = None
    agency_name: Optional[str] = None
    departure_stop: Optional[str] = None
    arrival_stop: Optional[str] = None
    num_stops: Optional[int] = None

class RouteRequest(BaseModel):
    origin_lat: float
    origin_lng: float
    dest_lat: float
    dest_lng: float
    mode: str = "walking"  # walking, transit, driving
    city: Optional[str] = None

    @field_validator("origin_lat", "dest_lat")
    @classmethod
    def validate_latitude(cls, v: float) -> float:
        if not (-90.0 <= v <= 90.0):
            raise ValueError(f"Latitude {v} out of range (-90 to 90)")
        return v

    @field_validator("origin_lng", "dest_lng")
    @classmethod
    def validate_longitude(cls, v: float) -> float:
        if not (-180.0 <= v <= 180.0):
            raise ValueError(f"Longitude {v} out of range (-180 to 180)")
        return v

class RouteDetail(BaseModel):
    origin: Dict[str, float]
    destination: Dict[str, float]
    transport_mode: str
    distance_meters: float
    distance_formatted: str
    duration_seconds: int
    duration_formatted: str
    estimated_cost: Optional[float] = None
    cost_formatted: Optional[str] = None
    polyline_points: List[List[float]] = Field(default_factory=list)
    steps: List[TransitStep] = Field(default_factory=list)
    transit_available: bool = True
    notes: Optional[str] = None

class NearbyRequest(BaseModel):
    latitude: float
    longitude: float
    radius_meters: int = Field(default=1500, ge=100, le=20000)
    categories: Optional[List[str]] = None
    limit: int = Field(default=20, ge=1, le=50)

    @field_validator("latitude")
    @classmethod
    def validate_lat(cls, v: float) -> float:
        if not (-90.0 <= v <= 90.0):
            raise ValueError(f"Latitude {v} out of range (-90 to 90)")
        return v

    @field_validator("longitude")
    @classmethod
    def validate_lng(cls, v: float) -> float:
        if not (-180.0 <= v <= 180.0):
            raise ValueError(f"Longitude {v} out of range (-180 to 180)")
        return v

class NearbyResponse(BaseModel):
    center: Dict[str, float]
    radius_meters: int
    total_found: int
    places: List[PlaceSummary] = Field(default_factory=list)
    disclaimer: str = "Location data is processed in-memory and never stored on servers."

class GeocodeResult(BaseModel):
    formatted_address: str
    latitude: float
    longitude: float
    city: Optional[str] = None
    country: Optional[str] = None
    country_code: Optional[str] = None
    timezone: Optional[str] = None

class CityAdaptationResponse(BaseModel):
    city_name: str
    country: str
    timezone: str
    currency: str
    currency_symbol: str
    transit_modes: List[Dict[str, Any]]
    fare_heuristics: Dict[str, Any]
    categories: List[Dict[str, str]]

class EnrichItineraryRequest(BaseModel):
    itinerary: Dict[str, Any]
    destination: Optional[str] = None

class EnrichItineraryResponse(BaseModel):
    is_valid: bool
    enriched_itinerary: Dict[str, Any]
    warnings: List[str] = Field(default_factory=list)
    geocoding_stats: Dict[str, int] = Field(default_factory=dict)
