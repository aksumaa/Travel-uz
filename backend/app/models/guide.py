from datetime import datetime
from sqlalchemy import String, Integer, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

class Guide(Base):
    __tablename__ = "guides"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    bio: Mapped[str] = mapped_column(Text, nullable=False)
    languages: Mapped[str] = mapped_column(String(255), default="Uzbek, English, Russian", nullable=False)
    cities_covered: Mapped[str] = mapped_column(String(255), default="Samarkand, Bukhara", nullable=False)
    experience_years: Mapped[int] = mapped_column(Integer, default=3, nullable=False)
    daily_rate: Mapped[float] = mapped_column(Float, default=60.0, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="USD", nullable=False)
    rating: Mapped[float] = mapped_column(Float, default=5.0, nullable=False)
    reviews_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=True, index=True, nullable=False)
    avatar_url: Mapped[str] = mapped_column(String(500), nullable=True)
    contact_phone: Mapped[str] = mapped_column(String(100), nullable=True)
    specialties: Mapped[str] = mapped_column(String(500), default="Silk Road Caravans, Sufi Architecture, Local Culture", nullable=True)
    services_json: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="guide_profile")
    bookings = relationship("Booking", back_populates="guide")
    reviews = relationship("Review", back_populates="guide", cascade="all, delete-orphan")

    @property
    def name(self) -> str:
        return self.full_name
    
    @name.setter
    def name(self, val: str):
        self.full_name = val

    @property
    def photo(self) -> str:
        return self.avatar_url
    
    @photo.setter
    def photo(self, val: str):
        self.avatar_url = val

    @property
    def price_per_day(self) -> float:
        return self.daily_rate

    @price_per_day.setter
    def price_per_day(self, val: float):
        self.daily_rate = val

    @property
    def review_count(self) -> int:
        return self.reviews_count

    @property
    def location(self) -> str:
        return self.cities_covered
    
    @location.setter
    def location(self, val: str):
        self.cities_covered = val

    @property
    def experience(self) -> str:
        return f"{self.experience_years}+ years licensed guide"

    @property
    def availability(self) -> str:
        return "available" if self.is_verified else "busy"

GuideProfile = Guide

__all__ = ["Guide", "GuideProfile"]
