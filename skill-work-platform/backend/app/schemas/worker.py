from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.auth import UserResponse
from app.schemas.skill import WorkerSkillResponse

class WorkerLevelResponse(BaseModel):
    id: int
    level_number: int
    title: str
    min_tasks_required: int
    min_completion_rate: float
    min_rating: float
    daily_limit: int
    badge_name: str

    class Config:
        from_attributes = True

class WorkerAvailabilityUpdate(BaseModel):
    is_available: bool
    available_skills_filter: Optional[List[int]] = None # List of skill IDs
    auto_notify: Optional[bool] = True

class WorkerAvailabilityResponse(BaseModel):
    is_available: bool
    available_skills_filter: Optional[str] = None
    auto_notify: bool
    updated_at: datetime

    class Config:
        from_attributes = True

class WorkerProfileUpdate(BaseModel):
    headline: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    education: Optional[str] = None
    experience_years: Optional[float] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    onboarding_step: Optional[int] = None
    onboarding_completed: Optional[bool] = None

class PortfolioItemCreate(BaseModel):
    title: str
    description: Optional[str] = None
    project_url: Optional[str] = None
    skills_used: Optional[str] = None

class PortfolioItemResponse(PortfolioItemCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class WorkHistoryCreate(BaseModel):
    company_or_client: str
    role: str
    duration: Optional[str] = None
    description: Optional[str] = None

class WorkHistoryResponse(WorkHistoryCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class WorkerPerformanceResponse(BaseModel):
    tasks_completed: int
    tasks_assigned: int
    completion_rate: float
    on_time_delivery_rate: float
    average_rating: float
    quality_score: int
    reliability_score: int
    overall_performance_score: int

    class Config:
        from_attributes = True

class WorkerProfileResponse(BaseModel):
    id: int
    user_id: int
    user: UserResponse
    headline: str
    bio: Optional[str] = None
    location: str
    avatar_url: Optional[str] = None
    education: Optional[str] = None
    experience_years: float
    daily_task_limit: int
    onboarding_completed: bool
    onboarding_step: int
    is_verified_badge: bool
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    level: Optional[WorkerLevelResponse] = None
    availability: Optional[WorkerAvailabilityResponse] = None
    performance: Optional[WorkerPerformanceResponse] = None
    skills: List[WorkerSkillResponse] = []
    portfolio_items: List[PortfolioItemResponse] = []
    work_history: List[WorkHistoryResponse] = []
    today_tasks_count: Optional[int] = 0

    class Config:
        from_attributes = True
