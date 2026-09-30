from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base

class TaskAssignment(Base):
    __tablename__ = "task_assignments"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, index=True)
    worker_id = Column(Integer, ForeignKey("worker_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String(30), default="ASSIGNED", index=True) 
    # Statuses: ASSIGNED -> IN_PROGRESS -> SUBMITTED -> UNDER_REVIEW -> NEEDS_CHANGES -> APPROVED -> COMPLETED
    assigned_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    started_at = Column(DateTime, nullable=True)
    due_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    earnings_processed = Column(Boolean, default=False)

    __table_args__ = (
        UniqueConstraint('task_id', 'worker_id', name='uq_task_worker_assignment'),
    )

    # Relationships
    task = relationship("Task", back_populates="assignments")
    worker = relationship("WorkerProfile", back_populates="assignments")
    submissions = relationship("TaskSubmission", back_populates="assignment", cascade="all, delete-orphan")
