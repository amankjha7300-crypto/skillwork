from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base

class Earnings(Base):
    __tablename__ = "earnings"

    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer, ForeignKey("worker_profiles.id", ondelete="CASCADE"), unique=True, nullable=False)
    total_earned = Column(Float, default=0.0)
    this_month = Column(Float, default=0.0)
    pending_clearance = Column(Float, default=0.0)
    available_balance = Column(Float, default=0.0)
    withdrawn_total = Column(Float, default=0.0)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    worker = relationship("WorkerProfile", back_populates="earnings")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer, ForeignKey("worker_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="SET NULL"), nullable=True)
    amount = Column(Float, nullable=False)
    type = Column(String(30), default="TASK_PAYMENT") # TASK_PAYMENT, WITHDRAWAL, BONUS, ADJUSTMENT
    title = Column(String(150), nullable=False)
    status = Column(String(20), default="PAID") # PAID, PENDING, PROCESSING, FAILED
    reference_id = Column(String(60), unique=True, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    worker = relationship("WorkerProfile", back_populates="transactions")
    task = relationship("Task")


class Withdrawal(Base):
    __tablename__ = "withdrawals"

    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer, ForeignKey("worker_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    method = Column(String(50), default="UPI") # UPI, BANK_TRANSFER
    payout_details = Column(String(200), nullable=False) # UPI ID or Bank account info
    status = Column(String(20), default="PROCESSING") # PROCESSING, COMPLETED, FAILED
    reference_id = Column(String(60), unique=True, index=True)
    requested_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    processed_at = Column(DateTime, nullable=True)

    worker = relationship("WorkerProfile")
