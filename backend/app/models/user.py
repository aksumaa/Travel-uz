from datetime import datetime
from sqlalchemy import String, Integer, DateTime, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    AGENCY_OWNER = "agency_owner"
    AGENCY_STAFF = "agency_staff"
    CLIENT = "client"

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=True)
    avatar: Mapped[str] = mapped_column(String(500), nullable=True)
    role: Mapped[str] = mapped_column(String(50), default=UserRole.CLIENT, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    agencies_owned = relationship("Agency", back_populates="owner", cascade="all, delete-orphan")
    agency_memberships = relationship("AgencyMember", back_populates="user", cascade="all, delete-orphan")
