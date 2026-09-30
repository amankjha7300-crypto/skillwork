from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.notification import NotificationResponse
from app.services.auth_service import get_current_user
from app.services.notification_service import (
    get_user_notifications,
    mark_notification_read,
    mark_all_notifications_read
)

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=List[NotificationResponse])
def get_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_user_notifications(db, current_user.id)

@router.post("/{notification_id}/read")
def read_notification(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    success = mark_notification_read(db, notification_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found.")
    return {"success": True}

@router.post("/read-all")
def read_all_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mark_all_notifications_read(db, current_user.id)
    return {"success": True}
