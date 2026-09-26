from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PackageCreate(BaseModel):
    title: str
    destination: str
    days: int = 3
    price: float = 0.0
    description: Optional[str] = None
    status: Optional[str] = "published"

class PackageUpdate(BaseModel):
    title: Optional[str] = None
    destination: Optional[str] = None
    days: Optional[int] = None
    price: Optional[float] = None
    description: Optional[str] = None
    status: Optional[str] = None

class PackageOut(BaseModel):
    id: int
    agency_id: int
    title: str
    destination: str
    days: int
    price: float
    description: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
