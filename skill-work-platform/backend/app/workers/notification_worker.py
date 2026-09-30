from app.core.database import SessionLocal
from app.models.notification import Notification

def dispatch_external_notifications():
    """
    Simulates external notification dispatch (Email/Push notifications)
    for high priority unread notifications.
    """
    db = SessionLocal()
    try:
        # In MVP, this logs or dispatches webhooks / push / email
        pass
    finally:
        db.close()
