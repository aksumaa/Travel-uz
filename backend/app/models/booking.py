from datetime import datetime, date
from sqlalchemy import String, Integer, Float, Text, Date, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    agency_id: Mapped[int] = mapped_column(Integer, ForeignKey("agencies.id", ondelete="CASCADE"), nullable=True, index=True)
    guide_id: Mapped[int] = mapped_column(Integer, ForeignKey("guides.id", ondelete="SET NULL"), nullable=True, index=True)
    package_id: Mapped[int] = mapped_column(Integer, ForeignKey("packages.id", ondelete="SET NULL"), nullable=True, index=True)
    lead_id: Mapped[int] = mapped_column(Integer, ForeignKey("leads.id", ondelete="SET NULL"), nullable=True, index=True)
    service_title: Mapped[str] = mapped_column(String(255), default="Tour Booking", nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=True)
    end_date: Mapped[date] = mapped_column(Date, nullable=True)
    travelers_count: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    final_price: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="USD", nullable=False)
    special_requests: Mapped[str] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="pending", nullable=False, index=True) # pending, confirmed, rejected, completed, cancelled
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="bookings")
    agency = relationship("Agency", back_populates="bookings")
    guide = relationship("Guide", back_populates="bookings")
    package = relationship("Package", back_populates="bookings")
    lead = relationship("Lead", back_populates="bookings")

# Alias for core entities requirement
BookingRequest = Booking
