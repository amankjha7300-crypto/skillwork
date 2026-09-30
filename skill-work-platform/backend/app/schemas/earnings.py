from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class EarningsResponse(BaseModel):
    total_earned: float
    this_month: float
    pending_clearance: float
    available_balance: float
    withdrawn_total: float
    tasks_completed_count: int
    average_per_task: float
    this_week: float

    class Config:
        from_attributes = True

class TransactionResponse(BaseModel):
    id: int
    task_id: Optional[int] = None
    amount: float
    type: str
    title: str
    status: str
    reference_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class WithdrawalRequest(BaseModel):
    amount: float
    method: str = "UPI"
    payout_details: str

class WithdrawalResponse(BaseModel):
    id: int
    amount: float
    method: str
    payout_details: str
    status: str
    reference_id: str
    requested_at: datetime
    processed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
