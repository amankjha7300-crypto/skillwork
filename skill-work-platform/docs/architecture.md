# System Architecture

## Core Philosophy
> "Don't make workers search for work. Bring suitable work to them."

## Architectural Diagram

```
[ New Work Opportunity Arrives ]
              ↓
  [ Eligibility Service ]
  - Skill matching & verified scores
  - Live availability check
  - Daily task limits check (e.g. 1/2 used)
  - Conflicting active task check
              ↓
  [ Candidate Priority Scorer ]
  - Verified proficiency (35%)
  - Completion rate (25%)
  - Reliability & on-time rate (15%)
  - Rating (15%)
  - Anti-monopoly fairness adjustment
              ↓
  [ Allocation Service ]
  - Partition into Tiered Notification Batches (Tier 1: High-performers)
              ↓
  [ Notification Service ]
  - Dispatches targeted "⚡ New Work Available" alert
              ↓
  [ Worker Clicks "Grab Work" ]
              ↓
  [ Atomic Database Transaction ]
  - Row-level lock / Atomic UPDATE WHERE available_slots > 0
  - Exactly 1 worker secures assignment (409 Conflict if taken)
              ↓
  [ Task Workspace Activated ]
  - 6-Stage Lifecycle: Assigned -> In Progress -> Submitted -> Under Review -> Approved -> Paid
```

## Backend Modules
- **FastAPI / Uvicorn**: High-performance asynchronous REST API.
- **SQLAlchemy ORM**: Entity mapping with ACID transactional guarantees.
- **SQLite / PostgreSQL**: Zero-config local development with immediate write-ahead logging (WAL) and production PostgreSQL support.
- **BCrypt & PyJWT**: Production standard authentication.

## Frontend
- **Next.js 14 (App Router)**: Fast rendering, layout nesting, modern ergonomics.
- **White + Sky Blue Theme**: Curated professional color palette (Primary Sky `#38BDF8`, Dark Blue `#0284C7`, Background `#F8FCFF`).
- **Responsive Mobile Navigation**: Clean bottom navigation bar for mobile viewports.
