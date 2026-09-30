# Database Schema

The platform defines 20 database entities with strict foreign key constraints and transactional integrity.

```
+-----------------------------------------------------------+
|                           users                           |
+-----------------------------------------------------------+
| id, full_name, email, phone_number, hashed_password, ...  |
+-----------------------------------------------------------+
                             | 1
                             |
                             | 1
+-----------------------------------------------------------+
|                      worker_profiles                      |
+-----------------------------------------------------------+
| id, user_id, headline, bio, location, level_id, limit, ...|
+-----------------------------------------------------------+
        |                 |               |            |
        | 1:N             | 1:1           | 1:1        | 1:N
        v                 v               v            v
  worker_skills     worker_availability earnings  task_assignments
        |                                              |
        v                                              v
      skills                                    task_submissions
        |                                              |
        v                                              v
skill_assessments                                 task_reviews
```

### Key Models:
- `users`: Authenticated accounts with bcrypt passwords.
- `worker_profiles`: Worker bio, level, daily limit, verified badges.
- `worker_availability`: Live availability toggle (`is_available`).
- `tasks`: Available slots, payment reward, time estimates, expiry countdown.
- `task_assignments`: Secured assignments to workers with atomic unique constraint `uq_task_worker_assignment`.
- `earnings` & `transactions`: Financial ledger tracking credits and withdrawals.
- `worker_performance`: Moving average rating, completion %, and on-time scores.
