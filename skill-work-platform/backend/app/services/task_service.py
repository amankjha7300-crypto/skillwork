import json
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.task import Task, TaskRequirement
from app.models.assignment import TaskAssignment
from app.models.submission import TaskSubmission, TaskReview
from app.models.worker import WorkerProfile
from app.services.eligibility_service import check_worker_eligibility
from app.services.notification_service import create_notification
from app.services.earnings_service import credit_task_payment
from app.services.performance_service import update_performance_after_task

def get_available_work_for_worker(db: Session, worker_id: int) -> List[Dict[str, Any]]:
    tasks = db.query(Task).filter(
        Task.status == "AVAILABLE",
        Task.available_slots > 0
    ).order_by(Task.created_at.desc()).all()

    result = []
    for task in tasks:
        eligibility = check_worker_eligibility(db, worker_id, task)
        task_dict = {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "category": task.category,
            "payment_amount": task.payment_amount,
            "currency": task.currency,
            "estimated_time": task.estimated_time,
            "deadline_hours": task.deadline_hours,
            "total_slots": task.total_slots,
            "available_slots": task.available_slots,
            "status": task.status,
            "urgency": task.urgency,
            "expires_at": task.expires_at,
            "current_notification_tier": task.current_notification_tier,
            "instructions": task.instructions,
            "expected_output": task.expected_output,
            "submission_rules": task.submission_rules,
            "reference_files_json": task.reference_files_json,
            "created_at": task.created_at,
            "requirements": task.requirements,
            "is_eligible": eligibility.is_eligible,
            "eligibility_reason": eligibility.reason
        }
        result.append(task_dict)
    
    # Sort eligible tasks first, then by payment
    result.sort(key=lambda x: (x["is_eligible"], x["payment_amount"]), reverse=True)
    return result

def get_task_by_id(db: Session, task_id: int, worker_id: Optional[int] = None) -> Dict[str, Any]:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    eligibility_info = None
    if worker_id:
        eligibility = check_worker_eligibility(db, worker_id, task)
        eligibility_info = {
            "is_eligible": eligibility.is_eligible,
            "reason": eligibility.reason
        }

    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "category": task.category,
        "payment_amount": task.payment_amount,
        "currency": task.currency,
        "estimated_time": task.estimated_time,
        "deadline_hours": task.deadline_hours,
        "total_slots": task.total_slots,
        "available_slots": task.available_slots,
        "status": task.status,
        "urgency": task.urgency,
        "expires_at": task.expires_at,
        "current_notification_tier": task.current_notification_tier,
        "instructions": task.instructions,
        "expected_output": task.expected_output,
        "submission_rules": task.submission_rules,
        "reference_files_json": task.reference_files_json,
        "created_at": task.created_at,
        "requirements": task.requirements,
        "is_eligible": eligibility_info["is_eligible"] if eligibility_info else None,
        "eligibility_reason": eligibility_info["reason"] if eligibility_info else None
    }

def get_worker_assignments(db: Session, worker_id: int, status_filter: Optional[str] = None):
    query = db.query(TaskAssignment).filter(TaskAssignment.worker_id == worker_id)
    if status_filter:
        if status_filter.upper() == "ACTIVE":
            query = query.filter(TaskAssignment.status.in_(["ASSIGNED", "IN_PROGRESS"]))
        elif status_filter.upper() == "SUBMITTED":
            query = query.filter(TaskAssignment.status.in_(["SUBMITTED", "UNDER_REVIEW", "NEEDS_CHANGES"]))
        elif status_filter.upper() == "COMPLETED":
            query = query.filter(TaskAssignment.status.in_(["APPROVED", "COMPLETED"]))
        else:
            query = query.filter(TaskAssignment.status == status_filter.upper())
    return query.order_by(TaskAssignment.assigned_at.desc()).all()

def start_task(db: Session, worker_id: int, assignment_id: int) -> TaskAssignment:
    assignment = db.query(TaskAssignment).filter(
        TaskAssignment.id == assignment_id,
        TaskAssignment.worker_id == worker_id
    ).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Task assignment not found")
    
    if assignment.status == "ASSIGNED":
        assignment.status = "IN_PROGRESS"
        assignment.started_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(assignment)
    return assignment

def submit_task(
    db: Session,
    worker_id: int,
    assignment_id: int,
    notes: Optional[str],
    files: List[dict]
) -> TaskSubmission:
    assignment = db.query(TaskAssignment).filter(
        TaskAssignment.id == assignment_id,
        TaskAssignment.worker_id == worker_id
    ).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Task assignment not found")

    if assignment.status not in ["ASSIGNED", "IN_PROGRESS", "NEEDS_CHANGES"]:
        raise HTTPException(status_code=400, detail=f"Cannot submit task in status '{assignment.status}'")

    existing_count = db.query(TaskSubmission).filter(TaskSubmission.assignment_id == assignment.id).count()

    submission = TaskSubmission(
        assignment_id=assignment.id,
        worker_id=worker_id,
        submission_notes=notes,
        files_json=json.dumps(files),
        version=existing_count + 1,
        status="SUBMITTED"
    )
    db.add(submission)

    assignment.status = "SUBMITTED"
    db.commit()
    db.refresh(submission)
    db.refresh(assignment)

    # Trigger automatic instant review verification in MVP for seamless full-flow demo
    review_and_approve_task(db, submission.id, rating=5.0, feedback="Excellent execution! All requirements satisfied.")
    return submission

def review_and_approve_task(db: Session, submission_id: int, rating: float = 5.0, feedback: str = "Approved"):
    submission = db.query(TaskSubmission).filter(TaskSubmission.id == submission_id).first()
    if not submission:
        return

    review = TaskReview(
        submission_id=submission.id,
        status="APPROVED",
        rating=rating,
        feedback=feedback,
        reviewed_at=datetime.now(timezone.utc)
    )
    db.add(review)

    submission.status = "APPROVED"
    assignment = submission.assignment
    assignment.status = "COMPLETED"
    assignment.completed_at = datetime.now(timezone.utc)

    # Process earnings if not already processed
    if not assignment.earnings_processed:
        credit_task_payment(db, assignment)
        assignment.earnings_processed = True

    # Update performance metrics
    update_performance_after_task(db, assignment.worker_id, rating=rating)

    # Send Notification
    worker = assignment.worker
    if worker and worker.user_id:
        create_notification(
            db=db,
            user_id=worker.user_id,
            task_id=assignment.task_id,
            notif_type="TASK_APPROVED",
            title="Task Approved & Payment Released! 🎉",
            message=f"Your submission for '{assignment.task.title}' was approved with rating {rating:.1f}/5. ₹{assignment.task.payment_amount:.0f} credited to your available balance!",
            priority="HIGH",
            action_url="/earnings"
        )

    db.commit()
