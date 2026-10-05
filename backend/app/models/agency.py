from datetime import datetime
from sqlalchemy import String, Integer, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

class Agency(Base):
    __tablename__ = "agencies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    logo_url: Mapped[str] = mapped_column(String(500), nullable=True)
    contact_email: Mapped[str] = mapped_column(String(255), nullable=True)
    contact_phone: Mapped[str] = mapped_column(String(100), nullable=True)
    owner_user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    address: Mapped[str] = mapped_column(String(255), nullable=True)
    city: Mapped[str] = mapped_column(String(100), default="Tashkent", nullable=False)
    rating: Mapped[float] = mapped_column(Float, default=5.0, nullable=False)
    reviews_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=True, index=True, nullable=False)
    subscription_tier: Mapped[str] = mapped_column(String(50), default="starter", nullable=False) # starter, pro, enterprise
    telegram_bot_token: Mapped[str] = mapped_column(String(500), nullable=True)
    telegram_chat_id: Mapped[str] = mapped_column(String(255), nullable=True)
    website: Mapped[str] = mapped_column(String(255), nullable=True)
    telegram_channel: Mapped[str] = mapped_column(String(255), nullable=True)
    whatsapp: Mapped[str] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    owner = relationship("User", back_populates="agencies_owned")
    members = relationship("AgencyMember", back_populates="agency", cascade="all, delete-orphan")
    packages = relationship("Package", back_populates="agency", cascade="all, delete-orphan")
    services = relationship("AgencyService", back_populates="agency", cascade="all, delete-orphan")
    itineraries = relationship("Itinerary", back_populates="agency", cascade="all, delete-orphan")
    leads = relationship("Lead", back_populates="agency", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="agency", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="agency", cascade="all, delete-orphan")
    verifications = relationship("AgencyVerification", back_populates="agency", cascade="all, delete-orphan")

class AgencyVerification(Base):
    __tablename__ = "agency_verifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    agency_id: Mapped[int] = mapped_column(Integer, ForeignKey("agencies.id", ondelete="CASCADE"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(50), default="pending", nullable=False, index=True) # pending, verified, rejected
    business_registration_number: Mapped[str] = mapped_column(String(100), nullable=True)
    license_number: Mapped[str] = mapped_column(String(100), nullable=True)
    document_url: Mapped[str] = mapped_column(String(500), nullable=True)
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    submitted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    reviewed_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    reviewer_notes: Mapped[str] = mapped_column(Text, nullable=True)
    verified_by_user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Relationships
    agency = relationship("Agency", back_populates="verifications")
    reviewer = relationship("User", foreign_keys=[verified_by_user_id])

class AgencyMember(Base):
    __tablename__ = "agency_members"

    agency_id: Mapped[int] = mapped_column(Integer, ForeignKey("agencies.id", ondelete="CASCADE"), primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    role: Mapped[str] = mapped_column(String(50), default="staff", nullable=False) # owner, staff
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    agency = relationship("Agency", back_populates="members")
    user = relationship("User", back_populates="agency_memberships")

class AgencyService(Base):
    __tablename__ = "agency_services"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    agency_id: Mapped[int] = mapped_column(Integer, ForeignKey("agencies.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    price: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="USD", nullable=False)
    service_type: Mapped[str] = mapped_column(String(100), default="Transport", nullable=False) # Transport, Guide, Hotel, Visa, Tour
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    agency = relationship("Agency", back_populates="services")
