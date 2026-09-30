from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    task_id: Optional[int] = None
    type: str
    title: str
    message: str
    priority: str
    is_read: bool
    action_url: Optional[str] = None
    data_json: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationMarkRead(BaseModel):
    is_read: bool = True
