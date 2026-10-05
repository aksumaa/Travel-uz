from datetime import datetime
from sqlalchemy import String, Integer, Float, Boolean, Text, DateTime, ForeignKey, JSON, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    icon: Mapped[str] = mapped_column(String(100), default="landmark", nullable=True)
    translations_json: Mapped[dict] = mapped_column(JSON, default=dict, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    destinations = relationship("Destination", back_populates="category")
    places = relationship("Place", back_populates="category")

# PlaceCategory alias for core MVP domain
PlaceCategory = Category

class Destination(Base):
    __tablename__ = "destinations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200), index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(220), unique=True, index=True, nullable=False)
    category_id: Mapped[int] = mapped_column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True, index=True)
    region: Mapped[str] = mapped_column(String(150), index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    budget_tier: Mapped[str] = mapped_column(String(50), default="moderate", nullable=False) # budget, moderate, luxury
    average_cost_per_day: Mapped[float] = mapped_column(Float, default=50.0, nullable=False)
    recommended_duration_days: Mapped[int] = mapped_column(Integer, default=3, nullable=False)
    best_season: Mapped[str] = mapped_column(String(100), default="Spring & Autumn", nullable=False)
    image_url: Mapped[str] = mapped_column(String(500), nullable=True)
    gallery: Mapped[list] = mapped_column(JSON, default=list, nullable=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, index=True, nullable=False)
    translations_json: Mapped[dict] = mapped_column(JSON, default=dict, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    category = relationship("Category", back_populates="destinations")
    places = relationship("Place", back_populates="destination", cascade="all, delete-orphan")
    saved_by_users = relationship("SavedDestination", back_populates="destination", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="destination", cascade="all, delete-orphan")
    trips = relationship("Trip", back_populates="destination_rel")

class Place(Base):
    __tablename__ = "places"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    destination_id: Mapped[int] = mapped_column(Integer, ForeignKey("destinations.id", ondelete="CASCADE"), nullable=False, index=True)
    category_id: Mapped[int] = mapped_column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(280), unique=True, index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    opening_hours: Mapped[str] = mapped_column(String(100), default="09:00 - 18:00", nullable=True)
    entry_fee: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="USD", nullable=False)
    image_url: Mapped[str] = mapped_column(String(500), nullable=True)
    translations_json: Mapped[dict] = mapped_column(JSON, default=dict, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    destination = relationship("Destination", back_populates="places")
    category = relationship("Category", back_populates="places")
    activities = relationship("TripActivity", back_populates="place")
    reviews = relationship("Review", back_populates="place", cascade="all, delete-orphan")

class SavedDestination(Base):
    __tablename__ = "saved_destinations"
    __table_args__ = (
        UniqueConstraint("user_id", "destination_id", name="uq_user_saved_destination"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    destination_id: Mapped[int] = mapped_column(Integer, ForeignKey("destinations.id", ondelete="CASCADE"), nullable=False, index=True)
    notes: Mapped[str] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="saved_destinations")
    destination = relationship("Destination", back_populates="saved_by_users")
