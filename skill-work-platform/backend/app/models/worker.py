from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base

class WorkerProfile(Base):
    __tablename__ = "worker_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    headline = Column(String(200), default="Skilled Worker")
    bio = Column(Text, nullable=True)
    location = Column(String(100), default="Remote")
    avatar_url = Column(String(255), nullable=True)
    education = Column(String(255), nullable=True)
    experience_years = Column(Float, default=1.0)
    current_level_id = Column(Integer, ForeignKey("worker_levels.id"), default=1)
    daily_task_limit = Column(Integer, default=2)
    onboarding_completed = Column(Boolean, default=False)
    onboarding_step = Column(Integer, default=1)
    is_verified_badge = Column(Boolean, default=False)
    github_url = Column(String(255), nullable=True)
    linkedin_url = Column(String(255), nullable=True)
    portfolio_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="worker_profile")
    level = relationship("WorkerLevel")
    skills = relationship("WorkerSkill", back_populates="worker", cascade="all, delete-orphan")
    availability = relationship("WorkerAvailability", back_populates="worker", uselist=False, cascade="all, delete-orphan")
    performance = relationship("WorkerPerformance", back_populates="worker", uselist=False, cascade="all, delete-orphan")
    assignments = relationship("TaskAssignment", back_populates="worker")
    earnings = relationship("Earnings", back_populates="worker", uselist=False, cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="worker", cascade="all, delete-orphan")
    portfolio_items = relationship("PortfolioItem", back_populates="worker", cascade="all, delete-orphan")
    work_history = relationship("WorkHistory", back_populates="worker", cascade="all, delete-orphan")


class WorkerLevel(Base):
    __tablename__ = "worker_levels"

    id = Column(Integer, primary_key=True, index=True)
    level_number = Column(Integer, unique=True, nullable=False) # 1 to 5
    title = Column(String(50), nullable=False) # Beginner, Verified, Skilled, Advanced, Expert
    min_tasks_required = Column(Integer, default=0)
    min_completion_rate = Column(Float, default=0.0)
    min_rating = Column(Float, default=0.0)
    daily_limit = Column(Integer, default=2)
    badge_name = Column(String(50), default="Level 1")


class WorkerAvailability(Base):
    __tablename__ = "worker_availability"

    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer, ForeignKey("worker_profiles.id", ondelete="CASCADE"), unique=True, nullable=False)
    is_available = Column(Boolean, default=True, index=True)
    available_skills_filter = Column(Text, nullable=True) # JSON or comma-separated list of skill IDs
    auto_notify = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    worker = relationship("WorkerProfile", back_populates="availability")


class PortfolioItem(Base):
    __tablename__ = "portfolio_items"

    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer, ForeignKey("worker_profiles.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    project_url = Column(String(255), nullable=True)
    image_url = Column(String(255), nullable=True)
    skills_used = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    worker = relationship("WorkerProfile", back_populates="portfolio_items")


class WorkHistory(Base):
    __tablename__ = "work_history"

    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer, ForeignKey("worker_profiles.id", ondelete="CASCADE"), nullable=False)
    company_or_client = Column(String(150), nullable=False)
    role = Column(String(100), nullable=False)
    duration = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    worker = relationship("WorkerProfile", back_populates="work_history")
