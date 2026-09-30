import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.earnings import Earnings, Transaction, Withdrawal
from app.models.assignment import TaskAssignment
from app.models.worker import WorkerProfile
from app.schemas.earnings import WithdrawalRequest

def get_or_create_earnings(db: Session, worker_id: int) -> Earnings:
    earnings = db.query(Earnings).filter(Earnings.worker_id == worker_id).first()
    if not earnings:
        earnings = Earnings(
            worker_id=worker_id,
            total_earned=0.0,
            this_month=0.0,
            pending_clearance=0.0,
            available_balance=0.0,
            withdrawn_total=0.0
        )
        db.add(earnings)
        db.commit()
        db.refresh(earnings)
    return earnings

def credit_task_payment(db: Session, assignment: TaskAssignment):
    earnings = get_or_create_earnings(db, assignment.worker_id)
    amount = assignment.task.payment_amount

    earnings.total_earned += amount
    earnings.this_month += amount
    earnings.available_balance += amount

    ref = f"TXN-{uuid.uuid4().hex[:10].upper()}"
    txn = Transaction(
        worker_id=assignment.worker_id,
        task_id=assignment.task_id,
        amount=amount,
        type="TASK_PAYMENT",
        title=f"Payment: {assignment.task.title}",
        status="PAID",
        reference_id=ref,
        created_at=datetime.now(timezone.utc)
    )
    db.add(txn)
    db.commit()
    db.refresh(earnings)

def get_worker_earnings_summary(db: Session, worker_id: int) -> Dict[str, Any]:
    earnings = get_or_create_earnings(db, worker_id)
    
    # Calculate completed count & average
    completed_assignments = db.query(TaskAssignment).filter(
        TaskAssignment.worker_id == worker_id,
        TaskAssignment.status.in_(["APPROVED", "COMPLETED"])
    ).all()
    count = len(completed_assignments)
    avg_per_task = (earnings.total_earned / count) if count > 0 else 0.0

    # Calculate this week
    one_week_ago = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=7)
    recent_txns = db.query(Transaction).filter(
        Transaction.worker_id == worker_id,
        Transaction.type == "TASK_PAYMENT",
        Transaction.created_at >= one_week_ago
    ).all()
    this_week = sum(t.amount for t in recent_txns)

    return {
        "total_earned": earnings.total_earned,
        "this_month": earnings.this_month,
        "pending_clearance": earnings.pending_clearance,
        "available_balance": earnings.available_balance,
        "withdrawn_total": earnings.withdrawn_total,
        "tasks_completed_count": count,
        "average_per_task": round(avg_per_task, 2),
        "this_week": round(this_week, 2)
    }

def request_withdrawal(db: Session, worker_id: int, req: WithdrawalRequest) -> Withdrawal:
    if req.amount <= 0:
        raise HTTPException(status_code=400, detail="Withdrawal amount must be greater than ₹0.")

    earnings = get_or_create_earnings(db, worker_id)
    if earnings.available_balance < req.amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient available balance. You have ₹{earnings.available_balance:.2f} available to withdraw."
        )

    ref = f"WTH-{uuid.uuid4().hex[:10].upper()}"
    
    # Deduct balance
    earnings.available_balance -= req.amount
    earnings.withdrawn_total += req.amount

    # Create withdrawal record
    withdrawal = Withdrawal(
        worker_id=worker_id,
        amount=req.amount,
        method=req.method,
        payout_details=req.payout_details,
        status="COMPLETED", # Auto-processed in MVP abstraction
        reference_id=ref,
        requested_at=datetime.now(timezone.utc),
        processed_at=datetime.now(timezone.utc)
    )
    db.add(withdrawal)

    # Record transaction
    txn = Transaction(
        worker_id=worker_id,
        amount=-req.amount,
        type="WITHDRAWAL",
        title=f"Withdrawal to {req.method} ({req.payout_details[:10]}...)",
        status="PAID",
        reference_id=ref,
        created_at=datetime.now(timezone.utc)
    )
    db.add(txn)

    db.commit()
    db.refresh(withdrawal)
    return withdrawal

def get_transactions(db: Session, worker_id: int) -> List[Transaction]:
    return db.query(Transaction).filter(
        Transaction.worker_id == worker_id
    ).order_by(Transaction.created_at.desc()).all()

def get_withdrawals(db: Session, worker_id: int) -> List[Withdrawal]:
    return db.query(Withdrawal).filter(
        Withdrawal.worker_id == worker_id
    ).order_by(Withdrawal.requested_at.desc()).all()
