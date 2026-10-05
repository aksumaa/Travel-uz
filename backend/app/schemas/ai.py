from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field

# ==========================================
# 1. SMART CLARIFICATION QUESTIONS
# ==========================================

class ClarificationOption(BaseModel):
    id: str
    label: str
    description: Optional[str] = None

class ClarificationQuestion(BaseModel):
    id: str
    category: str = "pacing"  # pacing, dining, transit, cultural, budget
    question: str
    options: List[ClarificationOption]
    default_option_id: Optional[str] = None

class TripClarifyRequest(BaseModel):
    destination: str = Field(..., description="Target destination (city or region)")
    duration_days: int = Field(3, ge=1, le=30, description="Duration in days")
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    travelers: int = Field(2, ge=1, le=20, description="Number of travelers")
    budget: float = Field(1200.0, ge=1.0, description="Total budget across all travelers")
    currency: str = Field("USD", description="Currency code (USD, EUR, UZS, GBP, JPY)")
    pace: str = Field("balanced", description="Pacing: leisurely, balanced, fast-paced")
    comfort: str = Field("boutique", description="Comfort tier: backpacker, boutique, luxury")
    interests: List[str] = Field(default_factory=list, description="Cultural, food, nature, etc.")
    food_preferences: List[str] = Field(default_factory=list, description="Street food, halal, vegetarian, etc.")
    transport_preference: str = Field("walking_transit", description="walking_transit, taxi, rental_car, private_driver")
    notes: Optional[str] = Field(None, description="Free-text custom travel requests")

class TripClarifyResponse(BaseModel):
    destination: str
    questions: List[ClarificationQuestion]
    explanation: str

# ==========================================
# 2. MULTI-APPROACH STRATEGY SELECTION
# ==========================================

class TripStrategyOption(BaseModel):
    strategy_id: str  # local_explorer, balanced, relaxed_premium
    name: str
    tagline: str
    pace: str
    estimated_budget: float
    currency: str = "USD"
    major_focus: str
    transit_style: str
    dining_style: str
    tradeoffs: List[str]
    recommended_for: str

class TripStrategiesRequest(TripClarifyRequest):
    clarification_answers: Dict[str, str] = Field(default_factory=dict, description="Answers to clarification questions (question_id -> option_id)")

class TripStrategiesResponse(BaseModel):
    destination: str
    strategies: List[TripStrategyOption]
    rationale: str

# ==========================================
# 3. STRUCTURED ITINERARY ENGINE
# ==========================================

class ActivityItem(BaseModel):
    id: Optional[str] = None
    time_slot: str = "morning"  # morning, lunch, afternoon, evening, night
    time_start: Optional[str] = None
    item_type: str = "attraction"  # attraction, restaurant, cafe, transport, shopping, entertainment, relaxation
    place_name: str
    place_id: Optional[int] = None
    location_name: str
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    duration_hours: float = 2.0
    estimated_cost: float = 0.0
    currency: str = "USD"
    is_verified: bool = False
    travel_time_minutes: int = 15
    transport_method: str = "walking"
    transport_details: Optional[str] = None
    opening_hours: Optional[str] = None
    opening_hours_verified: bool = False
    reasoning: str = ""
    tips: Optional[str] = None

class DayBudgetBreakdown(BaseModel):
    accommodation: float = 0.0
    food: float = 0.0
    transport: float = 0.0
    attractions: float = 0.0
    activities: float = 0.0
    miscellaneous: float = 0.0
    total: float = 0.0
    is_verified_ratio: float = 0.0

class StructuredDay(BaseModel):
    day_number: int
    date: Optional[str] = None
    title: str
    theme: str
    activities: List[ActivityItem] = Field(default_factory=list)
    budget: DayBudgetBreakdown = Field(default_factory=DayBudgetBreakdown)
    daily_notes: Optional[str] = None

class StructuredItinerary(BaseModel):
    title: str
    destination: str
    duration_days: int
    strategy_used: str = "balanced"
    summary: str
    total_budget: float
    currency: str = "USD"
    budget_summary: DayBudgetBreakdown = Field(default_factory=DayBudgetBreakdown)
    budget_status: str = "within_budget"  # within_budget, tight, exceeds_budget
    budget_advice: Optional[str] = None
    days: List[StructuredDay] = Field(default_factory=list)
    packing_tips: List[str] = Field(default_factory=list)
    visa_and_entry_info: str = ""
    local_transit_tips: str = ""
    emergency_contacts: Dict[str, str] = Field(default_factory=dict)
    unverified_data_warnings: List[str] = Field(default_factory=list)
    matched_tours_count: int = 0

class TripPlanRequest(TripClarifyRequest):
    selected_strategy_id: str = "balanced"
    clarification_answers: Dict[str, str] = Field(default_factory=dict)

# ==========================================
# 4. IN-TRIP REAL-TIME ADAPTATION
# ==========================================

class ScheduleMutation(BaseModel):
    removed_activities: List[str] = Field(default_factory=list)
    added_activities: List[ActivityItem] = Field(default_factory=list)
    modified_activities: List[str] = Field(default_factory=list)
    budget_delta: float = 0.0
    walking_distance_saved_km: float = 0.0
    explanation: str

class TripAdaptationRequest(BaseModel):
    trip_id: Optional[int] = None
    current_day: int = Field(1, ge=1)
    current_slot: str = Field("afternoon", description="morning, lunch, afternoon, evening")
    prompt: str = Field(..., description="User trigger: e.g. I'm tired, It's raining, $40 left today, Move closer, etc.")
    current_coordinates: Optional[Dict[str, float]] = None  # {"lat": float, "lng": float}
    remaining_budget_today: Optional[float] = None
    existing_itinerary: Optional[Dict[str, Any]] = None

class TripAdaptationResponse(BaseModel):
    trigger_prompt: str
    diagnosis: str
    mutation: ScheduleMutation
    updated_day: StructuredDay
    updated_itinerary: Optional[Dict[str, Any]] = None

# ==========================================
# 5. LOCATION-AWARE ASSISTANT QUERY
# ==========================================

class LocationAwareQueryRequest(BaseModel):
    query: str = Field(..., description="Location query: e.g. Cheap Turkish food near me, Is this museum open today, How do I use the metro?")
    destination: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    current_time: Optional[str] = None
    max_budget: Optional[float] = None

class LocationAwareQueryResponse(BaseModel):
    query: str
    detected_intent: str  # nearby_activities, nearby_food, transit_guidance, opening_hours_check, general_advice
    answer: str
    recommendations: List[Dict[str, Any]] = Field(default_factory=list)
    verified: bool = False
    data_limitations: Optional[str] = None
