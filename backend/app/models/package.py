from datetime import datetime
from sqlalchemy import String, Integer, Float, Boolean, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

class Package(Base):
    __tablename__ = "packages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    agency_id: Mapped[int] = mapped_column(Integer, ForeignKey("agencies.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    destination: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    days: Mapped[int] = mapped_column(Integer, default=3, nullable=False)
    price: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="USD", nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    included_services: Mapped[str] = mapped_column(Text, nullable=True)
    excluded_services: Mapped[str] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="published", nullable=False) # draft, published, archived
    image_url: Mapped[str] = mapped_column(String(500), nullable=True)
    availability: Mapped[list] = mapped_column(JSON, default=list, nullable=True) # list of dates or seasonal ranges
    min_group_size: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    max_group_size: Mapped[int] = mapped_column(Integer, default=20, nullable=True)
    languages: Mapped[list] = mapped_column(JSON, default=list, nullable=True) # ["en", "ru", "uz"]
    itinerary_highlights: Mapped[list] = mapped_column(JSON, default=list, nullable=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    translations_json: Mapped[dict] = mapped_column(JSON, default=dict, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    agency = relationship("Agency", back_populates="packages")
    itineraries = relationship("Itinerary", back_populates="package", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="package")
    images = relationship("TourImage", back_populates="package", cascade="all, delete-orphan", order_by="TourImage.order_index")
    leads = relationship("Lead", back_populates="package")
    reviews = relationship("Review", back_populates="package", cascade="all, delete-orphan")

class TourImage(Base):
    __tablename__ = "tour_images"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    package_id: Mapped[int] = mapped_column(Integer, ForeignKey("packages.id", ondelete="CASCADE"), nullable=False, index=True)
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    caption: Mapped[str] = mapped_column(String(255), nullable=True)
    is_cover: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    package = relationship("Package", back_populates="images")

# Aliases for core MVP domain
TourPackage = Package
TravelPackage = Package
