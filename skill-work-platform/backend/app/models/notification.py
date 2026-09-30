from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="SET NULL"), nullable=True)
    type = Column(String(50), nullable=False) 
    # NEW_WORK, TASK_ASSIGNED, TASK_DEADLINE, TASK_APPROVED, PAYMENT_RECEIVED, SKILL_ASSESSMENT, SKILL_IMPROVEMENT, LEVEL_UPGRADE, SYSTEM_MESSAGE
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    priority = Column(String(20), default="NORMAL") # HIGH, NORMAL, LOW
    is_read = Column(Boolean, default=False, index=True)
    action_url = Column(String(255), nullable=True)
    data_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="notifications")
    task = relationship("Task", back_populates="notifications")
