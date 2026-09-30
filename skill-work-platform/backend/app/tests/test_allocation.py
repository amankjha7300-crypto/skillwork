from app.services.allocation_service import calculate_worker_priority, allocate_task_to_candidates
from app.models.worker import WorkerProfile
from app.models.task import Task

def test_priority_calculation_and_batching(db):
    aman = db.query(WorkerProfile).filter(WorkerProfile.id == 1).first()
    task = db.query(Task).filter(Task.id == 1).first()

    priority = calculate_worker_priority(db, aman, task)
    assert priority > 70.0 # High performer score

    allocation = allocate_task_to_candidates(db, task.id)
    assert allocation["eligible_count"] >= 1
    assert allocation["tier_1_count"] >= 1
