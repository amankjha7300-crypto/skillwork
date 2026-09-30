from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException, status
from app.models.task import Task
from app.models.worker import WorkerProfile
from app.models.assignment import TaskAssignment
from app.models.performance import WorkerPerformance
from app.services.eligibility_service import check_worker_eligibility, get_today_tasks_count
from app.services.notification_service import create_notification, notify_eligible_batch

def calculate_worker_priority(db: Session, worker: WorkerProfile, task: Task) -> float:
    """
    Priority scoring algorithm:
    Combines:
    - Skill match & verified score
    - Overall performance & reliability
    - Completion rate
    - Average rating
    - Fairness penalty: recent assignments reduce early priority slightly so same worker doesn't monopolize.
    """
    perf = worker.performance
    base_score = 70.0

    if perf:
        base_score = (
            (perf.overall_performance_score * 0.35) +
            (perf.completion_rate * 0.25) +
            (perf.on_time_delivery_rate * 0.15) +
            ((perf.average_rating / 5.0) * 100 * 0.15) +
            (10.0 if worker.is_verified_badge else 0.0)
        )

    # Check recent assignments in past 48 hours for fairness
    two_days_ago = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(hours=48)
    recent_tasks_count = db.query(TaskAssignment).filter(
        TaskAssignment.worker_id == worker.id,
        TaskAssignment.assigned_at >= two_days_ago
    ).count()

    fairness_penalty = min(recent_tasks_count * 5.0, 20.0)
    final_priority = max(base_score - fairness_penalty, 10.0)
    return round(final_priority, 2)

def allocate_task_to_candidates(db: Session, task_id: int) -> Dict[str, Any]:
    """
    Finds all eligible available workers, sorts them by priority, and creates notification batches.
    """
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task or task.status != "AVAILABLE" or task.available_slots <= 0:
        return {"eligible_count": 0, "batches": {}}

    all_active_workers = db.query(WorkerProfile).all()
    candidates = []

    for worker in all_active_workers:
        eligibility = check_worker_eligibility(db, worker.id, task)
        if eligibility.is_eligible:
            priority = calculate_worker_priority(db, worker, task)
            candidates.append({"worker": worker, "priority": priority})

    # Sort descending by priority
    candidates.sort(key=lambda x: x["priority"], reverse=True)

    # Organize into tiered batches
    # Tier 1: Top 33%
    # Tier 2: Next 33%
    # Tier 3: Remaining
    total = len(candidates)
    t1_end = max(1, total // 3) if total > 2 else total
    t2_end = max(t1_end + 1, (2 * total) // 3) if total > 2 else total

    tier_1 = [c["worker"] for c in candidates[:t1_end]]
    tier_2 = [c["worker"] for c in candidates[t1_end:t2_end]]
    tier_3 = [c["worker"] for c in candidates[t2_end:]]

    # Notify Tier 1 workers immediately
    if tier_1:
        notify_eligible_batch(db, tier_1, task, tier=1)

    return {
        "eligible_count": total,
        "tier_1_count": len(tier_1),
        "tier_2_count": len(tier_2),
        "tier_3_count": len(tier_3)
    }

def grab_work_atomic(db: Session, worker_id: int, task_id: int) -> Dict[str, Any]:
    """
    ATOMIC GRAB WORK TRANSACTION:
    Guarantees strict single-assignment under concurrency without race conditions.
    """
    # 1. Fetch task
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The requested task could not be found."
        )

    # 2. Check full business eligibility
    eligibility = check_worker_eligibility(db, worker_id, task)
    if not eligibility.is_eligible:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=eligibility.reason
        )

    # 3. ATOMIC DECREMENT WITH ROW CHECK
    # Works in SQLite and PostgreSQL: Executes atomic UPDATE with WHERE available_slots > 0
    # Only one concurrent worker can succeed if available_slots == 1!
    try:
        # Check database dialect
        bind = db.get_bind()
        is_postgres = "postgres" in bind.dialect.name

        if is_postgres:
            # Row level lock for PostgreSQL
            locked_task = db.query(Task).filter(
                Task.id == task_id,
                Task.available_slots > 0,
                Task.status == "AVAILABLE"
            ).with_for_update().first()

            if not locked_task:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="This work has already been assigned to another worker."
                )
            
            locked_task.available_slots -= 1
            if locked_task.available_slots <= 0:
                locked_task.status = "ASSIGNED"
            db.flush()
        else:
            # Atomic update for SQLite / general SQL
            stmt = text(
                "UPDATE tasks SET available_slots = available_slots - 1 "
                "WHERE id = :task_id AND available_slots > 0 AND status = 'AVAILABLE'"
            )
            res = db.execute(stmt, {"task_id": task_id})
            if res.rowcount == 0:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="This work has already been assigned to another worker."
                )

            # Update status if slots reached 0
            db.refresh(task)
            if task.available_slots <= 0:
                task.status = "ASSIGNED"
                db.flush()

        # 4. Create TaskAssignment
        due_date = datetime.now(timezone.utc) + timedelta(hours=task.deadline_hours or 24)
        assignment = TaskAssignment(
            task_id=task.id,
            worker_id=worker_id,
            status="ASSIGNED",
            assigned_at=datetime.now(timezone.utc),
            due_at=due_date
        )
        db.add(assignment)

        # 5. Update worker performance task counter
        worker = db.query(WorkerProfile).filter(WorkerProfile.id == worker_id).first()
        if worker and worker.performance:
            worker.performance.tasks_assigned += 1

        # 6. Send immediate Task Assigned Notification
        create_notification(
            db=db,
            user_id=worker.user_id,
            task_id=task.id,
            notif_type="TASK_ASSIGNED",
            title="Work Successfully Assigned",
            message=f"You successfully grabbed '{task.title}'. Reward: ₹{task.payment_amount:.0f}. Deadline: {task.deadline_hours} hours.",
            priority="HIGH",
            action_url=f"/tasks/{task.id}"
        )

        db.commit()
        db.refresh(assignment)
        db.refresh(task)

        today_count = get_today_tasks_count(db, worker_id)

        return {
            "success": True,
            "message": "Work successfully assigned to you!",
            "assignment_id": assignment.id,
            "task": task,
            "today_tasks_count": today_count,
            "daily_limit": worker.daily_task_limit if worker else 2
        }

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Allocation transaction error: {str(e)}"
        )
