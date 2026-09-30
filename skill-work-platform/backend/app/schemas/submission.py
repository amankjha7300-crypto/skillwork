from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class TaskSubmissionCreate(BaseModel):
    submission_notes: Optional[str] = None
    files: List[dict] # {name, size, type, url}

class TaskReviewResponse(BaseModel):
    id: int
    submission_id: int
    status: str
    feedback: Optional[str] = None
    rating: float
    reviewed_at: datetime

    class Config:
        from_attributes = True

class TaskSubmissionResponse(BaseModel):
    id: int
    assignment_id: int
    worker_id: int
    submission_notes: Optional[str] = None
    files_json: str
    version: int
    status: str
    submitted_at: datetime
    reviews: List[TaskReviewResponse] = []

    class Config:
        from_attributes = True
