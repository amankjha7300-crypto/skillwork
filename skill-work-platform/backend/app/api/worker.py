import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.worker import WorkerProfile, WorkerAvailability, PortfolioItem, WorkHistory
from app.schemas.worker import (
    WorkerProfileResponse,
    WorkerProfileUpdate,
    WorkerAvailabilityResponse,
    WorkerAvailabilityUpdate,
    PortfolioItemCreate,
    PortfolioItemResponse,
    WorkHistoryCreate,
    WorkHistoryResponse
)
from app.services.auth_service import get_current_user
from app.services.eligibility_service import get_today_tasks_count

router = APIRouter(prefix="/worker", tags=["Worker Profile & Availability"])

@router.get("/profile", response_model=WorkerProfileResponse)
def get_worker_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.worker_profile
    if not profile:
        raise HTTPException(status_code=404, detail="Worker profile not found.")
    
    # Calculate tasks count today
    today_count = get_today_tasks_count(db, profile.id)
    profile.today_tasks_count = today_count
    return profile

@router.patch("/profile", response_model=WorkerProfileResponse)
def update_worker_profile(
    data: WorkerProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.worker_profile
    if not profile:
        raise HTTPException(status_code=404, detail="Worker profile not found.")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    profile.today_tasks_count = get_today_tasks_count(db, profile.id)
    return profile

@router.patch("/availability", response_model=WorkerAvailabilityResponse)
def update_availability(
    data: WorkerAvailabilityUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.worker_profile
    if not profile:
        raise HTTPException(status_code=404, detail="Worker profile not found.")

    availability = profile.availability
    if not availability:
        availability = WorkerAvailability(worker_id=profile.id)
        db.add(availability)

    availability.is_available = data.is_available
    if data.available_skills_filter is not None:
        availability.available_skills_filter = json.dumps(data.available_skills_filter)
    if data.auto_notify is not None:
        availability.auto_notify = data.auto_notify

    db.commit()
    db.refresh(availability)
    return availability

@router.post("/portfolio", response_model=PortfolioItemResponse, status_code=status.HTTP_201_CREATED)
def add_portfolio_item(
    data: PortfolioItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.worker_profile
    item = PortfolioItem(
        worker_id=profile.id,
        title=data.title,
        description=data.description,
        project_url=data.project_url,
        skills_used=data.skills_used
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.post("/history", response_model=WorkHistoryResponse, status_code=status.HTTP_201_CREATED)
def add_work_history(
    data: WorkHistoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.worker_profile
    history = WorkHistory(
        worker_id=profile.id,
        company_or_client=data.company_or_client,
        role=data.role,
        duration=data.duration,
        description=data.description
    )
    db.add(history)
    db.commit()
    db.refresh(history)
    return history
