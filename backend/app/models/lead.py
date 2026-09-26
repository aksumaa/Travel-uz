from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    agency_id: Mapped[int] = mapped_column(Integer, ForeignKey("agencies.id", ondelete="CASCADE"), nullable=False)
    client_name: Mapped[str] = mapped_column(String(255), nullable=False)
    client_contact: Mapped[str] = mapped_column(String(255), nullable=False) # phone, email, or telegram handle
    source: Mapped[str] = mapped_column(String(50), default="web", nullable=False) # web, telegram
    itinerary_id: Mapped[int] = mapped_column(Integer, ForeignKey("itineraries.id", ondelete="SET NULL"), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="new", nullable=False) # new, contacted, negotiating, won, lost
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    agency = relationship("Agency", back_populates="leads")
    itinerary = relationship("Itinerary", back_populates="leads")
    bookings = relationship("Booking", back_populates="lead", cascade="all, delete-orphan")
