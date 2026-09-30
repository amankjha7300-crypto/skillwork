from datetime import datetime, timezone
from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base

class WorkerPerformance(Base):
    __tablename__ = "worker_performance"

    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer, ForeignKey("worker_profiles.id", ondelete="CASCADE"), unique=True, nullable=False)
    tasks_completed = Column(Integer, default=0)
    tasks_assigned = Column(Integer, default=0)
    tasks_on_time = Column(Integer, default=0)
    completion_rate = Column(Float, default=100.0) # Percentage
    on_time_delivery_rate = Column(Float, default=100.0) # Percentage
    average_rating = Column(Float, default=5.0) # 1.0 - 5.0
    quality_score = Column(Integer, default=95) # 0 - 100
    reliability_score = Column(Integer, default=95) # 0 - 100
    overall_performance_score = Column(Integer, default=90) # Combined composite score for priority ranking
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    worker = relationship("WorkerProfile", back_populates="performance")
