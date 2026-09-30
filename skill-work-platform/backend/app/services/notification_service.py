import json
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.models.task import Task
from app.models.worker import WorkerProfile

def create_notification(
    db: Session,
    user_id: int,
    notif_type: str,
    title: str,
    message: str,
    task_id: Optional[int] = None,
    priority: str = "NORMAL",
    action_url: Optional[str] = None,
    data: Optional[dict] = None
) -> Notification:
    notif = Notification(
        user_id=user_id,
        task_id=task_id,
        type=notif_type,
        title=title,
        message=message,
        priority=priority,
        is_read=False,
        action_url=action_url,
        data_json=json.dumps(data) if data else None
    )
    db.add(notif)
    db.flush()
    return notif

def notify_eligible_batch(db: Session, workers: List[WorkerProfile], task: Task, tier: int = 1):
    for worker in workers:
        if not worker.user_id:
            continue
        # Check if already notified for this task
        existing = db.query(Notification).filter(
            Notification.user_id == worker.user_id,
            Notification.task_id == task.id,
            Notification.type == "NEW_WORK"
        ).first()
        if not existing:
            create_notification(
                db=db,
                user_id=worker.user_id,
                task_id=task.id,
                notif_type="NEW_WORK",
                title="⚡ New work available",
                message=f"{task.title} • ₹{task.payment_amount:.0f} • {task.available_slots} slot available",
                priority="HIGH" if tier == 1 else "NORMAL",
                action_url=f"/work/{task.id}",
                data={"task_id": task.id, "reward": task.payment_amount, "tier": tier}
            )
    db.commit()

def get_user_notifications(db: Session, user_id: int, limit: int = 50) -> List[Notification]:
    return db.query(Notification).filter(
        Notification.user_id == user_id
    ).order_by(Notification.created_at.desc()).limit(limit).all()

def mark_notification_read(db: Session, notif_id: int, user_id: int) -> bool:
    notif = db.query(Notification).filter(
        Notification.id == notif_id,
        Notification.user_id == user_id
    ).first()
    if notif:
        notif.is_read = True
        db.commit()
        return True
    return False

def mark_all_notifications_read(db: Session, user_id: int):
    db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
