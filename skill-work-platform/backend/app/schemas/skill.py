from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class SkillBase(BaseModel):
    name: str
    category: str
    description: Optional[str] = None
    icon: Optional[str] = "code"
    demand_level: Optional[str] = "High"

class SkillResponse(SkillBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class WorkerSkillCreate(BaseModel):
    skill_id: int
    proficiency_percentage: Optional[int] = 50
    level_tier: Optional[str] = "Beginner"

class WorkerSkillResponse(BaseModel):
    id: int
    skill_id: int
    skill: SkillResponse
    proficiency_percentage: int
    level_tier: str
    is_verified: bool
    verified_at: Optional[datetime] = None
    last_assessment_score: Optional[int] = None

    class Config:
        from_attributes = True

class AssessmentQuestion(BaseModel):
    id: int
    question: str
    options: List[str]
    correct_option_index: Optional[int] = None # omitted for taker
    question_type: str = "mcq" # mcq or practical
    code_snippet: Optional[str] = None

class SkillAssessmentResponse(BaseModel):
    id: int
    skill_id: int
    title: str
    description: Optional[str] = None
    time_limit_minutes: int
    total_questions: int
    passing_score: int
    questions: List[Any]

    class Config:
        from_attributes = True

class AssessmentSubmission(BaseModel):
    assessment_id: int
    answers: List[int] # List of chosen option indexes

class AssessmentResultResponse(BaseModel):
    id: int
    assessment_id: int
    score: int
    achieved_level: str
    passed: bool
    completed_at: datetime

    class Config:
        from_attributes = True
