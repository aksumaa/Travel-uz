from datetime import datetime
from sqlalchemy import Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    destination_id: Mapped[int] = mapped_column(Integer, ForeignKey("destinations.id", ondelete="CASCADE"), nullable=True, index=True)
    place_id: Mapped[int] = mapped_column(Integer, ForeignKey("places.id", ondelete="CASCADE"), nullable=True, index=True)
    guide_id: Mapped[int] = mapped_column(Integer, ForeignKey("guides.id", ondelete="CASCADE"), nullable=True, index=True)
    agency_id: Mapped[int] = mapped_column(Integer, ForeignKey("agencies.id", ondelete="CASCADE"), nullable=True, index=True)
    package_id: Mapped[int] = mapped_column(Integer, ForeignKey("packages.id", ondelete="CASCADE"), nullable=True, index=True)
    rating: Mapped[int] = mapped_column(Integer, default=5, nullable=False)
    comment: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="reviews")
    destination = relationship("Destination", back_populates="reviews")
    place = relationship("Place", back_populates="reviews")
    guide = relationship("Guide", back_populates="reviews")
    agency = relationship("Agency", back_populates="reviews")
    package = relationship("Package", back_populates="reviews")
