from datetime import datetime
import uuid
from sqlalchemy import String, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

def generate_share_token():
    return uuid.uuid4().hex[:12]

class Itinerary(Base):
    __tablename__ = "itineraries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    agency_id: Mapped[int] = mapped_column(Integer, ForeignKey("agencies.id", ondelete="CASCADE"), nullable=True)
    package_id: Mapped[int] = mapped_column(Integer, ForeignKey("packages.id", ondelete="SET NULL"), nullable=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    destination: Mapped[str] = mapped_column(String(255), nullable=False)
    generated_by: Mapped[str] = mapped_column(String(50), default="ai", nullable=False) # ai, manual
    content_json: Mapped[dict] = mapped_column(JSON, nullable=False)
    share_token: Mapped[str] = mapped_column(String(64), unique=True, index=True, default=generate_share_token, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    agency = relationship("Agency", back_populates="itineraries")
    package = relationship("Package", back_populates="itineraries")
    leads = relationship("Lead", back_populates="itinerary")
