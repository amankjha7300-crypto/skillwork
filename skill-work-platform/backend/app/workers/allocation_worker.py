from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.config import settings
from app.models.task import Task
from app.models.worker import WorkerProfile
from app.services.eligibility_service import check_worker_eligibility
from app.services.allocation_service import calculate_worker_priority
from app.services.notification_service import notify_eligible_batch

def escalate_unclaimed_tasks():
    """
    Checks tasks that have remained unclaimed in Tier 1 or Tier 2,
    and escalates them to the next notification tier batch.
    """
    db = SessionLocal()
    try:
        now = datetime.now(timezone.utc)
        threshold_time = now - timedelta(seconds=settings.BATCH_EXPIRY_SECONDS)

        # Find available tasks created before threshold that are still at Tier 1 or Tier 2
        tasks_to_escalate = db.query(Task).filter(
            Task.status == "AVAILABLE",
            Task.available_slots > 0,
            Task.created_at <= threshold_time,
            Task.current_notification_tier < 3
        ).all()

        for task in tasks_to_escalate:
            task.current_notification_tier += 1
            db.flush()

            # Find candidates for new tier
            all_workers = db.query(WorkerProfile).all()
            eligible_workers = []
            for w in all_workers:
                elig = check_worker_eligibility(db, w.id, task)
                if elig.is_eligible:
                    eligible_workers.append(w)

            notify_eligible_batch(db, eligible_workers, task, tier=task.current_notification_tier)

        db.commit()
    finally:
        db.close()
