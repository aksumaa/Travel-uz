from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any
from datetime import datetime

class FavoriteCreate(BaseModel):
    entity_type: str # trip, tour, place, destination, hotel, restaurant
    entity_id: int
    notes: Optional[str] = None
    metadata_json: Optional[dict] = None

class FavoriteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    entity_type: str
    entity_id: int
    notes: Optional[str] = None
    metadata_json: Optional[dict] = None
    entity_details: Optional[dict] = None
    created_at: datetime

class FavoriteToggleOut(BaseModel):
    saved: bool
    message: str
    favorite: Optional[FavoriteOut] = None
