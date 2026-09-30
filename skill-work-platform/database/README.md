# Database Schema & Seed Data

The SkillWork platform supports both PostgreSQL and SQLite.

## Database Entities

1. `users`: Authentication records, email, phone, hashed password.
2. `worker_profiles`: Worker persona, bio, current level, daily task limits.
3. `worker_levels`: Level 1 (Beginner) to Level 5 (Expert) with qualification requirements.
4. `skills`: Platform skill catalog with categories and demand metrics.
5. `worker_skills`: Worker proficiency scores, tiers, verification flags.
6. `skill_assessments`: Assessment quizzes, time limits, question definitions.
7. `assessment_results`: Test scores, timestamps, answers.
8. `worker_availability`: Live availability status toggle, active skill filters.
9. `tasks`: Work tasks, payment reward, time estimates, slots, countdown timers.
10. `task_requirements`: Mandatory skill and minimum score thresholds per task.
11. `task_assignments`: Secured assignments to workers with status tracking.
12. `task_submissions`: Deliverable files, notes, version history.
13. `task_reviews`: Ratings, reviewer feedback, completion timestamps.
14. `notifications`: In-app notifications with priority tiers.
15. `earnings`: Balances, total earnings, pending clearances, withdrawals.
16. `transactions`: Full ledger of credits and withdrawals.
17. `withdrawals`: Withdrawal requests, payment methods (UPI/Bank), status.
18. `worker_performance`: Ratings, completion rates, on-time metrics.
19. `portfolio_items`: Showcased projects with skill tags.
20. `work_history`: Prior employment/client track record.

## Running Seeds
The application automatically seeds necessary reference and demo data on boot via `database/seed_data.py`.
You can also run the SQL files directly against any PostgreSQL database:
```bash
psql -U postgres -d skillwork -f database/seeds/skills.sql
psql -U postgres -d skillwork -f database/seeds/demo_workers.sql
psql -U postgres -d skillwork -f database/seeds/demo_tasks.sql
```
