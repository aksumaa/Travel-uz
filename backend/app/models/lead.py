from datetime import datetime, date
from sqlalchemy import String, Integer, Float, DateTime, Date, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    agency_id: Mapped[int] = mapped_column(Integer, ForeignKey("agencies.id", ondelete="CASCADE"), nullable=False, index=True)
    client_name: Mapped[str] = mapped_column(String(255), nullable=False)
    client_contact: Mapped[str] = mapped_column(String(255), nullable=False) # phone, email, or telegram handle
    client_email: Mapped[str] = mapped_column(String(255), nullable=True)
    client_phone: Mapped[str] = mapped_column(String(100), nullable=True)
    preferred_contact_method: Mapped[str] = mapped_column(String(50), default="email", nullable=False) # email, phone, telegram, whatsapp
    source: Mapped[str] = mapped_column(String(50), default="web", nullable=False) # web, telegram, tour_inquiry, ai_planner
    package_id: Mapped[int] = mapped_column(Integer, ForeignKey("packages.id", ondelete="SET NULL"), nullable=True, index=True)
    trip_id: Mapped[int] = mapped_column(Integer, ForeignKey("trips.id", ondelete="SET NULL"), nullable=True, index=True)
    itinerary_id: Mapped[int] = mapped_column(Integer, ForeignKey("itineraries.id", ondelete="SET NULL"), nullable=True)
    travelers_count: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    travel_date: Mapped[str] = mapped_column(String(50), nullable=True)
    budget: Mapped[float] = mapped_column(Float, nullable=True)
    currency: Mapped[str] = mapped_column(String(10), default="USD", nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="new", nullable=False, index=True) # new, contacted, interested, booked, rejected (or legacy: negotiating, won, lost)
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    agency = relationship("Agency", back_populates="leads")
    package = relationship("Package", back_populates="leads")
    trip = relationship("Trip", back_populates="leads")
    itinerary = relationship("Itinerary", back_populates="leads")
    bookings = relationship("Booking", back_populates="lead", cascade="all, delete-orphan")
