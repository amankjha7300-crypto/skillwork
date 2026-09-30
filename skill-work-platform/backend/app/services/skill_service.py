import json
from datetime import datetime, timezone
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.skill import Skill, WorkerSkill, SkillAssessment, AssessmentResult
from app.models.worker import WorkerProfile
from app.schemas.skill import WorkerSkillCreate, AssessmentSubmission

LEVEL_THRESHOLDS = [
    (90, "Expert"),
    (80, "Advanced"),
    (70, "Skilled"),
    (55, "Intermediate"),
    (0, "Beginner")
]

def score_to_tier(score: int) -> str:
    for threshold, tier in LEVEL_THRESHOLDS:
        if score >= threshold:
            return tier
    return "Beginner"

def get_all_skills(db: Session, category: Optional[str] = None) -> List[Skill]:
    query = db.query(Skill)
    if category:
        query = query.filter(Skill.category == category)
    return query.order_by(Skill.name.asc()).all()

def get_worker_skills(db: Session, worker_id: int) -> List[WorkerSkill]:
    return db.query(WorkerSkill).filter(WorkerSkill.worker_id == worker_id).all()

def add_or_update_worker_skill(db: Session, worker_id: int, data: WorkerSkillCreate) -> WorkerSkill:
    worker_skill = db.query(WorkerSkill).filter(
        WorkerSkill.worker_id == worker_id,
        WorkerSkill.skill_id == data.skill_id
    ).first()

    if worker_skill:
        if data.proficiency_percentage is not None:
            worker_skill.proficiency_percentage = data.proficiency_percentage
            worker_skill.level_tier = score_to_tier(data.proficiency_percentage)
    else:
        worker_skill = WorkerSkill(
            worker_id=worker_id,
            skill_id=data.skill_id,
            proficiency_percentage=data.proficiency_percentage or 50,
            level_tier=data.level_tier or score_to_tier(data.proficiency_percentage or 50),
            is_verified=False
        )
        db.add(worker_skill)
    
    db.commit()
    db.refresh(worker_skill)
    return worker_skill

def get_assessment_for_skill(db: Session, skill_id: int) -> Optional[SkillAssessment]:
    return db.query(SkillAssessment).filter(SkillAssessment.skill_id == skill_id).first()

def evaluate_assessment(db: Session, worker_id: int, submission: AssessmentSubmission) -> Tuple[AssessmentResult, WorkerSkill]:
    assessment = db.query(SkillAssessment).filter(SkillAssessment.id == submission.assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found.")

    try:
        questions = json.loads(assessment.questions_json)
    except Exception:
        questions = []

    if not questions:
        raise HTTPException(status_code=400, detail="Invalid assessment structure.")

    total_q = len(questions)
    correct_count = 0

    for i, q in enumerate(questions):
        expected_idx = q.get("correct_option_index")
        if i < len(submission.answers) and submission.answers[i] == expected_idx:
            correct_count += 1

    score = int((correct_count / total_q) * 100) if total_q > 0 else 0
    achieved_tier = score_to_tier(score)
    passed = score >= assessment.passing_score

    # Save assessment result
    result = AssessmentResult(
        assessment_id=assessment.id,
        worker_id=worker_id,
        score=score,
        achieved_level=achieved_tier,
        passed=passed,
        answers_submitted=json.dumps(submission.answers)
    )
    db.add(result)

    # Update WorkerSkill
    worker_skill = db.query(WorkerSkill).filter(
        WorkerSkill.worker_id == worker_id,
        WorkerSkill.skill_id == assessment.skill_id
    ).first()

    if not worker_skill:
        worker_skill = WorkerSkill(
            worker_id=worker_id,
            skill_id=assessment.skill_id,
            proficiency_percentage=score,
            level_tier=achieved_tier,
            is_verified=passed,
            verified_at=datetime.now(timezone.utc) if passed else None,
            last_assessment_score=score
        )
        db.add(worker_skill)
    else:
        worker_skill.last_assessment_score = score
        if score > worker_skill.proficiency_percentage:
            worker_skill.proficiency_percentage = score
            worker_skill.level_tier = achieved_tier
        if passed:
            worker_skill.is_verified = True
            worker_skill.verified_at = datetime.now(timezone.utc)

    # Check worker verified badge
    worker = db.query(WorkerProfile).filter(WorkerProfile.id == worker_id).first()
    if worker:
        verified_count = db.query(WorkerSkill).filter(
            WorkerSkill.worker_id == worker_id,
            WorkerSkill.is_verified == True
        ).count()
        if verified_count >= 1:
            worker.is_verified_badge = True

    db.commit()
    db.refresh(result)
    db.refresh(worker_skill)
    return result, worker_skill

def get_skill_recommendations(db: Session, worker_id: int):
    # Find worker's skills that are either unverified or below 80%
    worker_skills = db.query(WorkerSkill).filter(WorkerSkill.worker_id == worker_id).all()
    recommendations = []

    for ws in worker_skills:
        if not ws.is_verified or ws.proficiency_percentage < 80:
            potential_reward_increase = "₹250 - ₹500 more per task"
            recommendations.append({
                "skill_id": ws.skill.id,
                "skill_name": ws.skill.name,
                "current_proficiency": ws.proficiency_percentage,
                "current_tier": ws.level_tier,
                "is_verified": ws.is_verified,
                "target_tier": "Advanced" if ws.proficiency_percentage >= 60 else "Skilled",
                "headline": f"Improve {ws.skill.name} to unlock higher value tasks.",
                "potential_earnings": potential_reward_increase,
                "next_action": "Take Skill Assessment" if not ws.is_verified else "Practice Challenges"
            })
    return recommendations
