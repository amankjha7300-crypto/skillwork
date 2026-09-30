from app.services.eligibility_service import check_worker_eligibility
from app.models.task import Task
from app.models.worker import WorkerProfile, WorkerAvailability

def test_eligibility_engine_rules(db):
    aman_worker = db.query(WorkerProfile).filter(WorkerProfile.id == 1).first()
    task = db.query(Task).filter(Task.id == 1).first() # Backend API Development

    # Baseline check: Aman should be eligible
    result = check_worker_eligibility(db, aman_worker.id, task)
    assert result.is_eligible is True

    # Rule 1: Worker not available
    aman_worker.availability.is_available = False
    db.commit()
    result_unavail = check_worker_eligibility(db, aman_worker.id, task)
    assert result_unavail.is_eligible is False
    assert "unavailable" in result_unavail.reason.lower()

    # Restore availability
    aman_worker.availability.is_available = True
    db.commit()

    # Rule 2: Daily limit reached
    original_limit = aman_worker.daily_task_limit
    aman_worker.daily_task_limit = 1 # Aman already has 1 completed today in seed data
    db.commit()
    result_limit = check_worker_eligibility(db, aman_worker.id, task)
    assert result_limit.is_eligible is False
    assert "daily work limit reached" in result_limit.reason.lower()

    # Restore limit
    aman_worker.daily_task_limit = original_limit
    db.commit()
