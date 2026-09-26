from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "agency_owner"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class UserOut(BaseModel):
    id: int
    name: Optional[str] = None
    email: EmailStr
    avatar: Optional[str] = None
    role: str

    class Config:
        from_attributes = True

class TokenData(BaseModel):
    user_id: int
    email: str
    role: str
