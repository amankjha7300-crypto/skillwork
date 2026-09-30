from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), default="Development")
    payment_amount = Column(Float, nullable=False) # e.g. 850.00
    currency = Column(String(10), default="INR") # ₹
    estimated_time = Column(String(50), default="3–4 hours")
    deadline_hours = Column(Integer, default=24)
    total_slots = Column(Integer, default=1)
    available_slots = Column(Integer, default=1, index=True)
    status = Column(String(30), default="AVAILABLE", index=True) # AVAILABLE, ASSIGNED, IN_PROGRESS, SUBMITTED, COMPLETED, EXPIRED, CANCELLED
    urgency = Column(String(20), default="NORMAL") # NORMAL, HIGH, CRITICAL
    expires_at = Column(DateTime, nullable=True) # Expiry for grab opportunity countdown
    current_notification_tier = Column(Integer, default=1) # 1: Top performers, 2: Qualified, 3: Wider pool
    instructions = Column(Text, nullable=True)
    expected_output = Column(Text, nullable=True)
    submission_rules = Column(Text, nullable=True)
    reference_files_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    requirements = relationship("TaskRequirement", back_populates="task", cascade="all, delete-orphan")
    assignments = relationship("TaskAssignment", back_populates="task", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="task", cascade="all, delete-orphan")


class TaskRequirement(Base):
    __tablename__ = "task_requirements"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    min_proficiency = Column(Integer, default=60) # 0 to 100
    min_level_tier = Column(String(30), default="Intermediate")
    is_mandatory = Column(Boolean, default=True)

    task = relationship("Task", back_populates="requirements")
    skill = relationship("Skill")
