from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base

class TaskSubmission(Base):
    __tablename__ = "task_submissions"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("task_assignments.id", ondelete="CASCADE"), nullable=False, index=True)
    worker_id = Column(Integer, ForeignKey("worker_profiles.id", ondelete="CASCADE"), nullable=False)
    submission_notes = Column(Text, nullable=True)
    files_json = Column(Text, nullable=False, default="[]") # JSON array of {name, size, type, url}
    version = Column(Integer, default=1)
    status = Column(String(30), default="SUBMITTED") # SUBMITTED, UNDER_REVIEW, APPROVED, NEEDS_CHANGES
    submitted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    assignment = relationship("TaskAssignment", back_populates="submissions")
    reviews = relationship("TaskReview", back_populates="submission", cascade="all, delete-orphan")


class TaskReview(Base):
    __tablename__ = "task_reviews"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("task_submissions.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(30), nullable=False) # APPROVED, NEEDS_CHANGES, REJECTED
    feedback = Column(Text, nullable=True)
    rating = Column(Float, default=5.0) # 1.0 - 5.0
    reviewed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    submission = relationship("TaskSubmission", back_populates="reviews")
