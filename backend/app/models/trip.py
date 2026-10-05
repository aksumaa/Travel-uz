from datetime import datetime, date
import uuid
from sqlalchemy import String, Integer, Float, Boolean, Text, Date, DateTime, ForeignKey, JSON, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

def generate_trip_token() -> str:
    return uuid.uuid4().hex[:12]

class Trip(Base):
    __tablename__ = "trips"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    destination_id: Mapped[int] = mapped_column(Integer, ForeignKey("destinations.id", ondelete="SET NULL"), nullable=True, index=True)
    title: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    destination: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=True)
    end_date: Mapped[date] = mapped_column(Date, nullable=True)
    duration_days: Mapped[int] = mapped_column(Integer, default=3, nullable=False)
    estimated_budget: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="USD", nullable=False)
    travelers_count: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    travel_style: Mapped[str] = mapped_column(String(100), default="Cultural Heritage", nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="planned", nullable=False, index=True) # draft, planned, ongoing, completed, cancelled, archived
    is_public: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_archived: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    share_token: Mapped[str] = mapped_column(String(64), unique=True, index=True, default=generate_trip_token, nullable=False)
    content_json: Mapped[dict] = mapped_column(JSON, nullable=True)
    preferences_json: Mapped[dict] = mapped_column(JSON, default=dict, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="trips")
    destination_rel = relationship("Destination", back_populates="trips")
    days = relationship("TripDay", back_populates="trip", cascade="all, delete-orphan", order_by="TripDay.day_number")
    saved_by_users = relationship("SavedTrip", back_populates="trip", cascade="all, delete-orphan")
    community_trips = relationship("CommunityTrip", back_populates="trip")
    leads = relationship("Lead", back_populates="trip")

class TripDay(Base):
    __tablename__ = "trip_days"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    trip_id: Mapped[int] = mapped_column(Integer, ForeignKey("trips.id", ondelete="CASCADE"), nullable=False, index=True)
    day_number: Mapped[int] = mapped_column(Integer, nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    daily_budget: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    trip = relationship("Trip", back_populates="days")
    activities = relationship("TripActivity", back_populates="trip_day", cascade="all, delete-orphan", order_by="TripActivity.order_index")

class TripActivity(Base):
    __tablename__ = "trip_activities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    trip_day_id: Mapped[int] = mapped_column(Integer, ForeignKey("trip_days.id", ondelete="CASCADE"), nullable=False, index=True)
    place_id: Mapped[int] = mapped_column(Integer, ForeignKey("places.id", ondelete="SET NULL"), nullable=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    location_name: Mapped[str] = mapped_column(String(255), nullable=False)
    item_type: Mapped[str] = mapped_column(String(50), default="attraction", nullable=False) # attraction, restaurant, cafe, transport, shopping, entertainment
    time_slot: Mapped[str] = mapped_column(String(50), default="morning", nullable=False) # morning, afternoon, evening
    time_start: Mapped[str] = mapped_column(String(50), nullable=True)
    duration_hours: Mapped[float] = mapped_column(Float, default=1.5, nullable=False)
    estimated_cost: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="USD", nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=True)
    longitude: Mapped[float] = mapped_column(Float, nullable=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    details_json: Mapped[dict] = mapped_column(JSON, default=dict, nullable=True)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    trip_day = relationship("TripDay", back_populates="activities")
    place = relationship("Place", back_populates="activities")

# TripItem alias for core MVP domain
TripItem = TripActivity

class SavedTrip(Base):
    __tablename__ = "saved_trips"
    __table_args__ = (
        UniqueConstraint("user_id", "trip_id", name="uq_user_saved_trip"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    trip_id: Mapped[int] = mapped_column(Integer, ForeignKey("trips.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="saved_trips")
    trip = relationship("Trip", back_populates="saved_by_users")

class CommunityTrip(Base):
    __tablename__ = "community_trips"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    creator_user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    trip_id: Mapped[int] = mapped_column(Integer, ForeignKey("trips.id", ondelete="SET NULL"), nullable=True, index=True)
    title: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    destination: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    max_participants: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    current_participants_count: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    estimated_cost_per_person: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="USD", nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="open", nullable=False, index=True) # open, full, ongoing, completed, cancelled
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    creator = relationship("User", back_populates="community_trips")
    trip = relationship("Trip", back_populates="community_trips")
    participants = relationship("TripParticipant", back_populates="community_trip", cascade="all, delete-orphan")

class TripParticipant(Base):
    __tablename__ = "trip_participants"
    __table_args__ = (
        UniqueConstraint("community_trip_id", "user_id", name="uq_community_trip_participant"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    community_trip_id: Mapped[int] = mapped_column(Integer, ForeignKey("community_trips.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(50), default="pending", nullable=False, index=True) # pending, accepted, rejected, cancelled
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    joined_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    community_trip = relationship("CommunityTrip", back_populates="participants")
    user = relationship("User", back_populates="trip_participations")
