from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.worker import WorkerLevel
from app.schemas.worker import WorkerPerformanceResponse, WorkerLevelResponse
from app.services.auth_service import get_current_user
from app.services.performance_service import get_or_create_performance

router = APIRouter(prefix="/performance", tags=["Performance & Levels"])

@router.get("", response_model=WorkerPerformanceResponse)
def get_worker_performance(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.worker_profile
    return get_or_create_performance(db, profile.id)

@router.get("/level", response_model=WorkerLevelResponse)
def get_worker_level(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.worker_profile
    if profile.level:
        return profile.level
    level_1 = db.query(WorkerLevel).filter(WorkerLevel.level_number == 1).first()
    return level_1
