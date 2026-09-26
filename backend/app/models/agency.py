from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

class Agency(Base):
    __tablename__ = "agencies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    logo_url: Mapped[str] = mapped_column(String(500), nullable=True)
    contact_email: Mapped[str] = mapped_column(String(255), nullable=True)
    contact_phone: Mapped[str] = mapped_column(String(100), nullable=True)
    owner_user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    subscription_tier: Mapped[str] = mapped_column(String(50), default="starter", nullable=False) # starter, pro, enterprise
    telegram_bot_token: Mapped[str] = mapped_column(String(500), nullable=True)
    telegram_chat_id: Mapped[str] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    owner = relationship("User", back_populates="agencies_owned")
    members = relationship("AgencyMember", back_populates="agency", cascade="all, delete-orphan")
    packages = relationship("Package", back_populates="agency", cascade="all, delete-orphan")
    itineraries = relationship("Itinerary", back_populates="agency", cascade="all, delete-orphan")
    leads = relationship("Lead", back_populates="agency", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="agency", cascade="all, delete-orphan")

class AgencyMember(Base):
    __tablename__ = "agency_members"

    agency_id: Mapped[int] = mapped_column(Integer, ForeignKey("agencies.id", ondelete="CASCADE"), primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    role: Mapped[str] = mapped_column(String(50), default="staff", nullable=False) # owner, staff
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    agency = relationship("Agency", back_populates="members")
    user = relationship("User", back_populates="agency_memberships")
