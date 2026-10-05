from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

class ReviewCreate(BaseModel):
    target_type: str # "guide", "agency", "trip", "destination"
    target_id: str
    rating: int = Field(ge=1, le=5)
    text: str = Field(min_length=3)
    photos: Optional[List[str]] = []

class ReviewOut(BaseModel):
    id: int
    user_id: int
    user_name: Optional[str] = None
    user_avatar: Optional[str] = None
    target_type: str
    target_id: str
    rating: int
    text: str
    photos: List[str] = []
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class ReviewsListResponse(BaseModel):
    target_type: str
    target_id: str
    average_rating: float
    review_count: int
    reviews: List[ReviewOut]

class ReviewReportIn(BaseModel):
    reason: str
