from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.task import TaskResponse, GrabWorkResponse
from app.services.auth_service import get_current_user
from app.services.task_service import get_available_work_for_worker, get_task_by_id
from app.services.allocation_service import grab_work_atomic

router = APIRouter(prefix="/work", tags=["Work & Allocation"])

@router.get("", response_model=List[TaskResponse])
def get_available_work(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.worker_profile
    return get_available_work_for_worker(db, profile.id)

@router.get("/{task_id}", response_model=TaskResponse)
def get_work_details(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.worker_profile
    return get_task_by_id(db, task_id, profile.id)

@router.post("/{task_id}/grab", response_model=GrabWorkResponse)
def grab_work(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.worker_profile
    result = grab_work_atomic(db, profile.id, task_id)
    return result
