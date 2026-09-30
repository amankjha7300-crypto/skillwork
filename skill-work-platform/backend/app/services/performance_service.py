from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.performance import WorkerPerformance
from app.models.worker import WorkerProfile, WorkerLevel
from app.models.assignment import TaskAssignment
from app.services.notification_service import create_notification

def get_or_create_performance(db: Session, worker_id: int) -> WorkerPerformance:
    perf = db.query(WorkerPerformance).filter(WorkerPerformance.worker_id == worker_id).first()
    if not perf:
        perf = WorkerPerformance(
            worker_id=worker_id,
            tasks_completed=0,
            tasks_assigned=0,
            tasks_on_time=0,
            completion_rate=100.0,
            on_time_delivery_rate=100.0,
            average_rating=5.0,
            quality_score=95,
            reliability_score=95,
            overall_performance_score=90
        )
        db.add(perf)
        db.commit()
        db.refresh(perf)
    return perf

def update_performance_after_task(db: Session, worker_id: int, rating: float = 5.0):
    perf = get_or_create_performance(db, worker_id)
    worker = db.query(WorkerProfile).filter(WorkerProfile.id == worker_id).first()

    completed_assignments = db.query(TaskAssignment).filter(
        TaskAssignment.worker_id == worker_id,
        TaskAssignment.status.in_(["APPROVED", "COMPLETED"])
    ).all()

    total_assigned = db.query(TaskAssignment).filter(
        TaskAssignment.worker_id == worker_id
    ).count()

    completed_count = len(completed_assignments)
    perf.tasks_completed = completed_count
    perf.tasks_assigned = max(total_assigned, completed_count)

    # Check on time
    on_time_count = 0
    for a in completed_assignments:
        if a.due_at and a.completed_at and a.completed_at <= a.due_at:
            on_time_count += 1
        elif not a.due_at:
            on_time_count += 1
    
    perf.tasks_on_time = on_time_count
    perf.completion_rate = round((completed_count / perf.tasks_assigned * 100), 1) if perf.tasks_assigned > 0 else 100.0
    perf.on_time_delivery_rate = round((on_time_count / completed_count * 100), 1) if completed_count > 0 else 100.0

    # Moving average rating
    perf.average_rating = round(((perf.average_rating * max(completed_count - 1, 0)) + rating) / max(completed_count, 1), 2)
    perf.quality_score = min(100, int(perf.average_rating * 20))
    perf.reliability_score = min(100, int((perf.completion_rate * 0.6) + (perf.on_time_delivery_rate * 0.4)))
    perf.overall_performance_score = int((perf.quality_score * 0.5) + (perf.reliability_score * 0.5))

    # Check level advancement
    if worker:
        all_levels = db.query(WorkerLevel).order_by(WorkerLevel.level_number.asc()).all()
        for lvl in all_levels:
            if (perf.tasks_completed >= lvl.min_tasks_required and
                perf.completion_rate >= lvl.min_completion_rate and
                perf.average_rating >= lvl.min_rating):
                if not worker.level or lvl.level_number > worker.level.level_number:
                    worker.current_level_id = lvl.id
                    worker.daily_task_limit = lvl.daily_limit
                    # Notify worker of upgrade
                    create_notification(
                        db=db,
                        user_id=worker.user_id,
                        notif_type="LEVEL_UPGRADE",
                        title=f"Level Up! You are now {lvl.title} (Level {lvl.level_number}) 🚀",
                        message=f"Your outstanding performance has unlocked Level {lvl.level_number}. Your daily work limit increased to {lvl.daily_limit} tasks!",
                        priority="HIGH",
                        action_url="/profile"
                    )

    db.commit()
    db.refresh(perf)
    return perf
