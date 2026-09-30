import json
from datetime import datetime, timezone, date
from typing import Tuple, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.task import Task, TaskRequirement
from app.models.worker import WorkerProfile, WorkerAvailability
from app.models.assignment import TaskAssignment
from app.models.skill import WorkerSkill

TIER_ORDER = {
    "Beginner": 1,
    "Intermediate": 2,
    "Skilled": 3,
    "Advanced": 4,
    "Expert": 5
}

class EligibilityResult:
    def __init__(self, is_eligible: bool, reason: str = ""):
        self.is_eligible = is_eligible
        self.reason = reason

def get_utc_now() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)

def get_today_tasks_count(db: Session, worker_id: int) -> int:
    today_start = get_utc_now().replace(hour=0, minute=0, second=0, microsecond=0)
    count = db.query(TaskAssignment).filter(
        TaskAssignment.worker_id == worker_id,
        TaskAssignment.assigned_at >= today_start,
        TaskAssignment.status.in_(["ASSIGNED", "IN_PROGRESS", "SUBMITTED", "APPROVED", "COMPLETED"])
    ).count()
    return count

def check_worker_eligibility(db: Session, worker_id: int, task: Task) -> EligibilityResult:
    # 1. Fetch Worker Profile
    worker = db.query(WorkerProfile).filter(WorkerProfile.id == worker_id).first()
    if not worker or not worker.user.is_active:
        return EligibilityResult(False, "Worker account is inactive or not found.")

    # 2. Check Task Status and Slots
    if task.status != "AVAILABLE" or task.available_slots <= 0:
        return EligibilityResult(False, "This task is no longer available or already taken.")

    # 3. Check Task Expiry
    if task.expires_at:
        task_exp = task.expires_at.replace(tzinfo=None) if task.expires_at.tzinfo else task.expires_at
        if task_exp < get_utc_now():
            return EligibilityResult(False, "The allocation window for this task has expired.")

    # 4. Check Worker Availability
    availability = worker.availability
    if not availability or not availability.is_available:
        return EligibilityResult(False, "You are currently marked as unavailable. Switch your status to available to receive work.")

    # 5. Check Daily Work Limit
    today_count = get_today_tasks_count(db, worker_id)
    daily_limit = worker.daily_task_limit or 2
    if today_count >= daily_limit:
        return EligibilityResult(False, f"Daily work limit reached ({today_count}/{daily_limit} tasks today). Resets at midnight.")

    # 6. Check Conflicting Active Task
    active_assignment = db.query(TaskAssignment).filter(
        TaskAssignment.worker_id == worker_id,
        TaskAssignment.status.in_(["ASSIGNED", "IN_PROGRESS"])
    ).first()
    if active_assignment:
        return EligibilityResult(False, "You have an active in-progress task. Complete or submit it before grabbing another.")

    # 7. Check if worker already grabbed this specific task
    already_assigned = db.query(TaskAssignment).filter(
        TaskAssignment.task_id == task.id,
        TaskAssignment.worker_id == worker_id
    ).first()
    if already_assigned:
        return EligibilityResult(False, "You have already been assigned this task.")

    # 8. Check Skill Requirements
    requirements = task.requirements
    if requirements:
        worker_skills = {
            ws.skill_id: ws for ws in db.query(WorkerSkill).filter(WorkerSkill.worker_id == worker_id).all()
        }

        # Check availability skill filter if worker restricted their availability
        if availability.available_skills_filter:
            try:
                allowed_skills = json.loads(availability.available_skills_filter)
                task_skill_ids = [r.skill_id for r in requirements]
                if allowed_skills and not any(sid in allowed_skills for sid in task_skill_ids):
                    return EligibilityResult(False, "Task skill is not currently in your active availability filter.")
            except Exception:
                pass

        for req in requirements:
            if not req.is_mandatory:
                continue

            ws = worker_skills.get(req.skill_id)
            if not ws:
                return EligibilityResult(False, f"Missing required skill: {req.skill.name if req.skill else 'Required Skill'}.")

            # Check proficiency percentage
            if ws.proficiency_percentage < req.min_proficiency:
                return EligibilityResult(
                    False,
                    f"Required {req.min_proficiency}% proficiency in {req.skill.name}. Your verified score is {ws.proficiency_percentage}%."
                )

            # Check tier level
            req_tier_val = TIER_ORDER.get(req.min_level_tier, 1)
            worker_tier_val = TIER_ORDER.get(ws.level_tier, 1)
            if worker_tier_val < req_tier_val:
                return EligibilityResult(
                    False,
                    f"Requires {req.min_level_tier} level in {req.skill.name}. Current level is {ws.level_tier}."
                )

    return EligibilityResult(True, "Eligible")
