# Allocation & Concurrency Engine

## 1. The Workflow
```
New Work
   ↓
Eligibility Service
   ↓
Available Workers
   ↓
Priority Calculation
   ↓
Allocation Service
   ↓
Notification Service
   ↓
Worker clicks "Grab"
   ↓
Atomic Database Check
   ↓
Task Assigned
```

## 2. Eligibility Engine Rules
Before any worker can grab a task, the backend validates 8 mandatory criteria:
1. **Account Active**: Account must be active and verified.
2. **Task Available**: Task status must be `AVAILABLE` and `available_slots > 0`.
3. **Allocation Window Open**: Task countdown timer (`expires_at`) must not be expired.
4. **Availability Status**: Worker's `is_available` flag must be true.
5. **Skill Match**: Worker must possess all required skills.
6. **Competency Score**: Worker's verified proficiency score must meet or exceed `min_proficiency`.
7. **Daily Limit Check**: Tasks assigned to the worker today must be strictly less than `daily_task_limit`.
8. **Active Task Conflict**: Worker cannot hold conflicting in-progress tasks simultaneously.

## 3. Race Condition & Atomic Database Lock
When a task has 1 slot and two workers click "Grab Work" concurrently:
- An atomic SQL UPDATE is executed:
  ```sql
  UPDATE tasks 
  SET available_slots = available_slots - 1 
  WHERE id = :task_id AND available_slots > 0 AND status = 'AVAILABLE';
  ```
- **Result**:
  - The worker whose query acquires the write lock first receives `rowcount == 1`. Their assignment is created and confirmed (`200 OK`).
  - The second worker receives `rowcount == 0`. An immediate `409 Conflict` is raised ("This work has already been assigned to another worker.").
- Tested and verified under `test_grab_work.py` with multi-threaded concurrency.
