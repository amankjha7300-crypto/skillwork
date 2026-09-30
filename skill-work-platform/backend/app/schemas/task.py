from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.skill import SkillResponse

class TaskRequirementResponse(BaseModel):
    id: int
    skill_id: int
    skill: SkillResponse
    min_proficiency: int
    min_level_tier: str
    is_mandatory: bool

    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    title: str
    description: str
    category: str
    payment_amount: float
    currency: str = "INR"
    estimated_time: str
    deadline_hours: int
    total_slots: int = 1
    urgency: str = "NORMAL"
    instructions: Optional[str] = None
    expected_output: Optional[str] = None
    submission_rules: Optional[str] = None

class TaskCreate(TaskBase):
    requirements: List[dict] # skill_id, min_proficiency, min_level_tier

class TaskResponse(TaskBase):
    id: int
    available_slots: int
    status: str
    expires_at: Optional[datetime] = None
    current_notification_tier: int
    reference_files_json: Optional[str] = None
    created_at: datetime
    requirements: List[TaskRequirementResponse] = []
    is_eligible: Optional[bool] = None
    eligibility_reason: Optional[str] = None

    class Config:
        from_attributes = True

class TaskAssignmentResponse(BaseModel):
    id: int
    task_id: int
    task: TaskResponse
    worker_id: int
    status: str
    assigned_at: datetime
    started_at: Optional[datetime] = None
    due_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    earnings_processed: bool

    class Config:
        from_attributes = True

class GrabWorkResponse(BaseModel):
    success: bool
    message: str
    assignment_id: Optional[int] = None
    task: Optional[TaskResponse] = None
    today_tasks_count: Optional[int] = None
    daily_limit: Optional[int] = None
