from datetime import datetime, timezone
from app.core.database import SessionLocal
from app.models.task import Task
from app.models.notification import Notification

def expire_stale_tasks():
    """
    Finds tasks where expires_at has passed and marks them EXPIRED.
    """
    db = SessionLocal()
    try:
        now = datetime.now(timezone.utc)
        expired_tasks = db.query(Task).filter(
            Task.status == "AVAILABLE",
            Task.expires_at != None,
            Task.expires_at < now
        ).all()

        for t in expired_tasks:
            t.status = "EXPIRED"
        
        db.commit()
    finally:
        db.close()
