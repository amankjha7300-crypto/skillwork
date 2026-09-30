import json
from typing import List, Optional, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.skill import (
    SkillResponse,
    WorkerSkillResponse,
    WorkerSkillCreate,
    SkillAssessmentResponse,
    AssessmentSubmission,
    AssessmentResultResponse
)
from app.services.auth_service import get_current_user
from app.services.skill_service import (
    get_all_skills,
    get_worker_skills,
    add_or_update_worker_skill,
    get_assessment_for_skill,
    evaluate_assessment,
    get_skill_recommendations
)

router = APIRouter(prefix="/skills", tags=["Skills & Assessments"])

@router.get("", response_model=List[SkillResponse])
def list_skills(category: Optional[str] = None, db: Session = Depends(get_db)):
    return get_all_skills(db, category)

@router.get("/worker", response_model=List[WorkerSkillResponse])
def list_worker_skills(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.worker_profile
    return get_worker_skills(db, profile.id)

@router.post("/worker", response_model=WorkerSkillResponse)
def save_worker_skill(
    data: WorkerSkillCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.worker_profile
    return add_or_update_worker_skill(db, profile.id, data)

@router.get("/{skill_id}/assessment", response_model=SkillAssessmentResponse)
def get_assessment(
    skill_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    assessment = get_assessment_for_skill(db, skill_id)
    if not assessment:
        raise HTTPException(status_code=404, detail="No assessment available for this skill yet.")

    try:
        raw_questions = json.loads(assessment.questions_json)
        # Strip correct_option_index from client view
        client_questions = []
        for q in raw_questions:
            client_questions.append({
                "id": q.get("id"),
                "question": q.get("question"),
                "options": q.get("options", []),
                "question_type": q.get("question_type", "mcq"),
                "code_snippet": q.get("code_snippet")
            })
    except Exception:
        client_questions = []

    return {
        "id": assessment.id,
        "skill_id": assessment.skill_id,
        "title": assessment.title,
        "description": assessment.description,
        "time_limit_minutes": assessment.time_limit_minutes,
        "total_questions": assessment.total_questions,
        "passing_score": assessment.passing_score,
        "questions": client_questions
    }

@router.post("/assessment", response_model=AssessmentResultResponse)
def submit_assessment(
    data: AssessmentSubmission,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.worker_profile
    result, _ = evaluate_assessment(db, profile.id, data)
    return result

@router.get("/recommendations")
def get_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.worker_profile
    return get_skill_recommendations(db, profile.id)
