# API Reference

All endpoints are hosted under `/api`.

## 1. Authentication (`/api/auth`)
- `POST /api/auth/register`: Create a new worker account (Full Name, Email, Password, Phone).
- `POST /api/auth/login`: Authenticate and obtain JWT access token.
- `GET /api/auth/me`: Retrieve current logged-in user profile.

## 2. Worker Profile & Availability (`/api/worker`)
- `GET /api/worker/profile`: Full worker profile, levels, metrics, portfolio, today's task count.
- `PATCH /api/worker/profile`: Update headline, bio, location, education, experience.
- `PATCH /api/worker/availability`: Update live availability toggle (`is_available: true/false`).
- `POST /api/worker/portfolio`: Add portfolio projects.
- `POST /api/worker/history`: Add prior work or client history.

## 3. Skills & Assessments (`/api/skills`)
- `GET /api/skills`: Platform skill catalog.
- `GET /api/skills/worker`: Current worker's registered competencies.
- `POST /api/skills/worker`: Add or update a worker skill.
- `GET /api/skills/{id}/assessment`: Fetch assessment questions for a skill.
- `POST /api/skills/assessment`: Submit assessment answers, grade score, verify badge.
- `GET /api/skills/recommendations`: Targeted learning recommendations connected to earnings.

## 4. Live Work & Atomic Grab (`/api/work`)
- `GET /api/work`: Retrieve live tasks annotated with eligibility status.
- `GET /api/work/{id}`: Detailed work briefing.
- `POST /api/work/{id}/grab`: **Atomic Grab Work action**.

## 5. Worker Tasks (`/api/tasks`)
- `GET /api/tasks`: List worker's assigned tasks (filters: `ACTIVE`, `SUBMITTED`, `COMPLETED`).
- `GET /api/tasks/{id}`: Task workspace briefing with submissions.
- `POST /api/tasks/{id}/start`: Mark assigned task as in progress.
- `POST /api/tasks/{id}/submit`: Submit deliverable files and notes for review.
- `POST /api/tasks/upload`: Multipart file upload endpoint.

## 6. Earnings & Withdrawals (`/api/earnings`)
- `GET /api/earnings`: Balance summary (Total, Available, This Month, Pending).
- `GET /api/earnings/transactions`: Chronological ledger.
- `POST /api/earnings/withdraw`: Request withdrawal to UPI or Bank Account.
- `GET /api/earnings/withdrawals`: Withdrawal audit log.

## 7. Performance & Levels (`/api/performance`)
- `GET /api/performance`: Worker completion rate, on-time delivery, rating, and quality score.
- `GET /api/performance/level`: Current worker level and advancement requirements.

## 8. Notifications (`/api/notifications`)
- `GET /api/notifications`: Retrieve in-app notifications.
- `POST /api/notifications/{id}/read`: Mark notification as read.
- `POST /api/notifications/read-all`: Mark all notifications as read.
