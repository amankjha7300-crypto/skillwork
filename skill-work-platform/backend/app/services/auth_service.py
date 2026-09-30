from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token, decode_access_token
from app.models.user import User
from app.models.worker import WorkerProfile, WorkerAvailability, WorkerLevel
from app.models.performance import WorkerPerformance
from app.models.earnings import Earnings
from app.schemas.auth import UserRegister, UserLogin

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

def register_user(db: Session, data: UserRegister) -> User:
    existing = db.query(User).filter(User.email == data.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    user = User(
        full_name=data.full_name.strip(),
        email=data.email.lower().strip(),
        phone_number=data.phone_number.strip() if data.phone_number else None,
        hashed_password=get_password_hash(data.password),
        is_active=True,
        is_verified=False
    )
    db.add(user)
    db.flush()

    # Find level 1
    level_1 = db.query(WorkerLevel).filter(WorkerLevel.level_number == 1).first()
    level_id = level_1.id if level_1 else 1

    # Create WorkerProfile
    profile = WorkerProfile(
        user_id=user.id,
        headline="Skilled Worker",
        location="Remote",
        current_level_id=level_id,
        daily_task_limit=2,
        onboarding_completed=False,
        onboarding_step=1
    )
    db.add(profile)
    db.flush()

    # Create Availability
    availability = WorkerAvailability(
        worker_id=profile.id,
        is_available=True,
        auto_notify=True
    )
    db.add(availability)

    # Create Performance Tracker
    performance = WorkerPerformance(
        worker_id=profile.id,
        tasks_completed=0,
        tasks_assigned=0,
        tasks_on_time=0,
        completion_rate=100.0,
        on_time_delivery_rate=100.0,
        average_rating=5.0,
        quality_score=95,
        reliability_score=95,
        overall_performance_score=90
    )
    db.add(performance)

    # Create Earnings
    earnings = Earnings(
        worker_id=profile.id,
        total_earned=0.0,
        this_month=0.0,
        pending_clearance=0.0,
        available_balance=0.0,
        withdrawn_total=0.0
    )
    db.add(earnings)

    db.commit()
    db.refresh(user)
    return user

def authenticate_user(db: Session, data: UserLogin) -> tuple[User, str]:
    user = db.query(User).filter(User.email == data.email.lower().strip()).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated. Please contact support."
        )
    
    token = create_access_token(user.id)
    return user, token

def get_current_user(token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in."
        )
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has expired. Please log in again."
        )
    try:
        user_id = int(payload["sub"])
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token."
        )
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive."
        )
    return user
