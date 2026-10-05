from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "USER"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleAuthRequest(BaseModel):
    credential: Optional[str] = None
    id_token: Optional[str] = None
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    avatar: Optional[str] = None

class ProfileUpdate(BaseModel):
    bio: Optional[str] = None
    phone_number: Optional[str] = None
    country: Optional[str] = None
    preferred_currency: Optional[str] = None
    preferred_language: Optional[str] = None
    travel_style: Optional[str] = None

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: Optional[str] = None
    email: EmailStr
    avatar: Optional[str] = None
    role: str

class TokenData(BaseModel):
    user_id: int
    email: str
    role: str
