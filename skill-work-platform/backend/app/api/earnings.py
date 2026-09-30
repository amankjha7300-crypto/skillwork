from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.earnings import (
    EarningsResponse,
    TransactionResponse,
    WithdrawalRequest,
    WithdrawalResponse
)
from app.services.auth_service import get_current_user
from app.services.earnings_service import (
    get_worker_earnings_summary,
    get_transactions,
    get_withdrawals,
    request_withdrawal
)

router = APIRouter(prefix="/earnings", tags=["Earnings & Withdrawals"])

@router.get("", response_model=EarningsResponse)
def get_earnings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.worker_profile
    return get_worker_earnings_summary(db, profile.id)

@router.get("/transactions", response_model=List[TransactionResponse])
def get_transaction_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.worker_profile
    return get_transactions(db, profile.id)

@router.post("/withdraw", response_model=WithdrawalResponse)
def withdraw_funds(
    req: WithdrawalRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.worker_profile
    return request_withdrawal(db, profile.id, req)

@router.get("/withdrawals", response_model=List[WithdrawalResponse])
def get_withdrawal_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.worker_profile
    return get_withdrawals(db, profile.id)
