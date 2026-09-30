import concurrent.futures
from app.services.allocation_service import grab_work_atomic
from app.models.user import User
from app.models.worker import WorkerProfile, WorkerAvailability
from app.models.performance import WorkerPerformance
from app.models.task import Task
from app.core.database import SessionLocal
from app.core.security import get_password_hash
from fastapi import HTTPException

def test_atomic_single_slot_grab_race_condition():
    """
    Critical Test: Two fresh eligible workers attempt to grab the same single-slot task concurrently.
    Guarantees: Exactly one worker succeeds, the second worker gets 409 Conflict.
    """
    setup_db = SessionLocal()

    # 1. Create two fresh eligible test workers
    w1_user = User(full_name="Race Worker 1", email="race1@example.com", hashed_password=get_password_hash("pwd"), is_active=True)
    w2_user = User(full_name="Race Worker 2", email="race2@example.com", hashed_password=get_password_hash("pwd"), is_active=True)
    setup_db.add_all([w1_user, w2_user])
    setup_db.flush()

    w1_profile = WorkerProfile(user_id=w1_user.id, daily_task_limit=5, onboarding_completed=True)
    w2_profile = WorkerProfile(user_id=w2_user.id, daily_task_limit=5, onboarding_completed=True)
    setup_db.add_all([w1_profile, w2_profile])
    setup_db.flush()

    w1_avail = WorkerAvailability(worker_id=w1_profile.id, is_available=True)
    w2_avail = WorkerAvailability(worker_id=w2_profile.id, is_available=True)
    w1_perf = WorkerPerformance(worker_id=w1_profile.id, completion_rate=100.0, average_rating=5.0)
    w2_perf = WorkerPerformance(worker_id=w2_profile.id, completion_rate=100.0, average_rating=5.0)
    setup_db.add_all([w1_avail, w2_avail, w1_perf, w2_perf])

    # 2. Create single-slot task with no restrictive requirements
    task = Task(
        title="Concurrent Race Condition Isolation Task",
        description="Testing atomic concurrency locking",
        category="Backend Development",
        payment_amount=1000.0,
        currency="INR",
        estimated_time="1 hour",
        deadline_hours=12,
        total_slots=1,
        available_slots=1,
        status="AVAILABLE"
    )
    setup_db.add(task)
    setup_db.commit()
    setup_db.refresh(task)
    task_id = task.id
    w1_id = w1_profile.id
    w2_id = w2_profile.id
    setup_db.close()

    results = []

    def attempt_grab(worker_id: int):
        db_thread = SessionLocal()
        try:
            res = grab_work_atomic(db_thread, worker_id, task_id)
            results.append({"worker_id": worker_id, "success": True, "res": res})
        except HTTPException as e:
            results.append({"worker_id": worker_id, "success": False, "status_code": e.status_code, "detail": e.detail})
        except Exception as e:
            results.append({"worker_id": worker_id, "success": False, "error": str(e)})
        finally:
            db_thread.close()

    # Worker 1 and Worker 2 grab simultaneously
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        f1 = executor.submit(attempt_grab, w1_id)
        f2 = executor.submit(attempt_grab, w2_id)
        concurrent.futures.wait([f1, f2])

    success_count = sum(1 for r in results if r["success"] is True)
    conflict_count = sum(1 for r in results if r.get("status_code") == 409)

    # Exactly one succeeded!
    assert success_count == 1, f"Expected exactly 1 success, got {success_count}. Results: {results}"
    # Exactly one received 409 conflict!
    assert conflict_count == 1, f"Expected exactly 1 conflict, got {conflict_count}. Results: {results}"

    # Verify task state in database
    verify_db = SessionLocal()
    updated_task = verify_db.query(Task).filter(Task.id == task_id).first()
    assert updated_task.available_slots == 0
    assert updated_task.status == "ASSIGNED"
    verify_db.close()
