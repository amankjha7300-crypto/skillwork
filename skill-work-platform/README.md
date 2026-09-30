# SkillWork — Automated Worker-Side Work-Allocation Platform

> **Core Philosophy:** "Don't make workers search for work. Bring suitable work to them."

SkillWork is a complete worker-side web platform for a new work-allocation paradigm. Rather than making skilled workers sift through hundreds of postings, submit bids, and compete against crowds, the platform brings matching tasks directly to verified, available workers. When work becomes available, eligible workers receive priority notifications and can click **"Grab Work"** to secure the slot instantly.

---

## 1. Project Structure

```
skill-work-platform/
│
├── README.md
├── .gitignore
├── .env.example
├── docker-compose.yml
│
├── frontend/
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── Dockerfile
│   │
│   ├── public/
│   │   ├── images/
│   │   ├── icons/
│   │   └── logos/
│   │
│   └── src/
│       ├── app/
│       │   ├── page.tsx                           # Welcome / Landing Screen
│       │   ├── layout.tsx                         # Root Layout with White & Sky Blue Theme
│       │   ├── login/page.tsx                     # Worker Login (with 1-click Demo Worker)
│       │   ├── signup/page.tsx                    # Minimal Signup (4 basic fields)
│       │   ├── onboarding/                        # 7-Step Worker Onboarding Wizard
│       │   │   ├── page.tsx
│       │   │   ├── skills/page.tsx
│       │   │   ├── assessment/page.tsx
│       │   │   └── availability/page.tsx
│       │   ├── dashboard/page.tsx                 # Main Worker Dashboard (6 core questions answered)
│       │   ├── work/                              # Live Work Allocations
│       │   │   ├── page.tsx
│       │   │   └── [id]/page.tsx
│       │   ├── tasks/                             # My Tasks (Active, Submitted, Completed)
│       │   │   ├── page.tsx
│       │   │   └── [id]/page.tsx                  # 6-Stage Task Workspace & Submissions
│       │   ├── skills/                            # Skills & Verification Hub
│       │   │   ├── page.tsx
│       │   │   ├── assessments/page.tsx           # Interactive MCQ Skill Testing
│       │   │   └── improve/page.tsx               # Connecting Learning to Earning
│       │   ├── earnings/page.tsx                  # Balances & Instant UPI/Bank Withdrawals
│       │   ├── notifications/page.tsx             # Work Notifications & Alert Center
│       │   ├── profile/page.tsx                   # Professional Worker Profile
│       │   ├── settings/                          # Account, Security, Notifications, Payments
│       │   │   ├── page.tsx
│       │   │   ├── account/page.tsx
│       │   │   ├── security/page.tsx
│       │   │   ├── notifications/page.tsx
│       │   │   └── payments/page.tsx
│       │   └── help/page.tsx                      # FAQs, Report a Problem, Report Task
│       │
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Navbar.tsx                     # Live Availability Toggle, Alerts, Menu
│       │   │   ├── Sidebar.tsx                    # Desktop Sidebar Navigation
│       │   │   ├── MobileNav.tsx                  # Responsive Bottom Navigation Bar
│       │   │   └── PageHeader.tsx
│       │   ├── dashboard/
│       │   │   ├── AvailabilityCard.tsx           # 🟢 Available for Work Switch
│       │   │   ├── WorkAvailableCard.tsx          # ⚡ WORK AVAILABLE Focal Card
│       │   │   ├── DailyLimitCard.tsx             # 1/2 Tasks Completed Today
│       │   │   ├── EarningsCard.tsx               # Balances & Monthly Trends
│       │   │   └── PerformanceCard.tsx            # Level 3 Skilled, Rating, On-Time %
│       │   ├── work/
│       │   │   ├── WorkCard.tsx                   # Opportunity Card
│       │   │   ├── WorkDetails.tsx                # Task Briefing & Requirements
│       │   │   ├── GrabWorkButton.tsx             # Atomic CTA (Loading, Success, Taken)
│       │   │   └── WorkTimer.tsx                  # Real-Time Expiry Countdown
│       │   ├── tasks/
│       │   │   ├── TaskCard.tsx
│       │   │   ├── TaskStatus.tsx                 # Status Badges
│       │   │   ├── TaskTimeline.tsx               # 6-Stage Lifecycle Timeline
│       │   │   └── SubmissionForm.tsx             # File Uploads & Review Notes
│       │   ├── skills/
│       │   │   ├── SkillCard.tsx
│       │   │   ├── SkillProgress.tsx
│       │   │   ├── AssessmentCard.tsx             # Interactive Quiz Engine
│       │   │   └── ImprovementCard.tsx            # Learning -> Earning Unlocks
│       │   ├── earnings/
│       │   │   ├── EarningsSummary.tsx            # Balances & Withdrawal Modal
│       │   │   └── TransactionTable.tsx           # Chronological Ledger
│       │   ├── notifications/
│       │   │   ├── NotificationItem.tsx
│       │   │   └── WorkNotification.tsx           # Urgent Work Alert Banner
│       │   └── common/
│       │       ├── Button.tsx
│       │       ├── Modal.tsx
│       │       ├── Badge.tsx
│       │       ├── ProgressBar.tsx
│       │       ├── EmptyState.tsx
│       │       ├── LoadingState.tsx
│       │       └── ErrorState.tsx
│       │
│       ├── lib/
│       │   ├── api.ts                             # Typed Backend API Client
│       │   ├── auth.ts                            # JWT & LocalStorage Helpers
│       │   ├── constants.ts                       # Design System Colors & Config
│       │   └── utils.ts                           # INR Currency, Dates, Countdowns
│       │
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   ├── useAvailability.ts
│       │   ├── useNotifications.ts
│       │   └── useTasks.ts
│       │
│       ├── types/
│       │   ├── user.ts
│       │   ├── skill.ts
│       │   ├── task.ts
│       │   ├── earnings.ts
│       │   └── notification.ts
│       │
│       └── styles/
│           └── globals.css                        # White + Sky Blue Theme Tokens
│
├── backend/
│   ├── requirements.txt
│   ├── Dockerfile
│   │
│   └── app/
│       ├── main.py                                # FastAPI App & Lifespan Seeder
│       ├── core/
│       │   ├── config.py                          # App Settings & Batch Timers
│       │   ├── security.py                        # BCrypt & JWT Encoders
│       │   └── database.py                        # Engine (SQLite WAL & PostgreSQL)
│       ├── models/                                # 20 SQLAlchemy Database Models
│       ├── schemas/                               # Pydantic V2 Request/Response Schemas
│       ├── api/                                   # REST Routers
│       ├── services/
│       │   ├── auth_service.py
│       │   ├── skill_service.py
│       │   ├── eligibility_service.py             # 8-Point Business Rules Engine
│       │   ├── allocation_service.py              # Candidate Scoring & Atomic Grab
│       │   ├── notification_service.py            # Tiered Batch Notification Dispatcher
│       │   ├── task_service.py                    # Workspaces, Submissions, Reviews
│       │   ├── earnings_service.py                # Ledger & Withdrawal Processing
│       │   └── performance_service.py             # Moving Averages & Level Upgrades
│       ├── workers/
│       │   ├── allocation_worker.py               # Tier 1 -> Tier 2 Escalation
│       │   ├── notification_worker.py             # External Notification Worker
│       │   └── task_expiry_worker.py              # Task Expiry Cleaner
│       └── tests/
│           ├── conftest.py
│           ├── test_auth.py
│           ├── test_skills.py
│           ├── test_eligibility.py
│           ├── test_allocation.py
│           ├── test_grab_work.py                  # Multi-threaded Concurrency Race Test
│           ├── test_tasks.py
│           └── test_earnings.py
│
├── database/
│   ├── seed_data.py                               # Comprehensive Auto-Seeder
│   ├── seeds/
│   │   ├── skills.sql
│   │   ├── demo_workers.sql
│   │   └── demo_tasks.sql
│   └── README.md
│
└── docs/
    ├── architecture.md
    ├── api.md
    ├── database.md
    └── allocation-system.md
```

---

## 2. Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Lucide Icons, Pure CSS (No Tailwind dependency).
- **Backend**: FastAPI (Python 3.11+), Uvicorn, Pydantic V2, BCrypt, PyJWT.
- **Database**: PostgreSQL (Production) / SQLite with WAL Mode & Immediate Row Locking (Local zero-config).
- **Testing**: Pytest & TestClient with multi-threaded concurrent simulation.

---

## 3. Design Theme & Aesthetics

- **Primary Colors**:
  - Primary Sky Blue: `#38BDF8`
  - Primary Dark Blue: `#0284C7`
  - Very Light Blue: `#E0F2FE`
  - Background Canvas: `#F8FCFF`
  - Cards & Surfaces: `#FFFFFF`
  - Main Text: `#0F172A`
  - Secondary Text: `#64748B`
  - Success Green: `#16A34A`
- **Theme Constraint**: Strictly **White + Sky Blue**. No dark theme.
- **Responsive Layout**: Dedicated bottom navigation bar on mobile viewports (`Dashboard`, `Work`, `Tasks`, `Skills`, `Earnings`).

---

## 4. Work-Allocation Flow

```
New Work Opportunity
        ↓
Eligibility Service (Validates 8 criteria)
        ↓
Available Workers Filter
        ↓
Candidate Priority Calculation
        ↓
Allocation Service (Tiered Batching)
        ↓
Notification Service (Dispatches "⚡ New Work Available")
        ↓
Worker clicks "Grab Work"
        ↓
Atomic Database Row Check (SELECT FOR UPDATE / Atomic UPDATE)
        ↓
Task Assigned (First worker succeeds, second gets 409 Conflict)
        ↓
Task Workspace Activated
```

---

## 5. Setup & Running Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### Quick Start (Local)

#### 1. Run the Backend
```bash
cd skill-work-platform/backend
# Install dependencies
pip install -r requirements.txt

# Run backend (tables and seed data are created automatically)
uvicorn app.main:app --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

#### 2. Run the Frontend
```bash
cd skill-work-platform/frontend
# Install dependencies
npm install

# Start development server
npm run dev
```
- Frontend application runs at: `http://localhost:3000`

#### 3. Run Automated Tests
```bash
cd skill-work-platform/backend
python -m pytest app/tests -v
```
All 7 test suites pass including the critical multi-threaded race condition check:
- `test_auth.py`
- `test_skills.py`
- `test_eligibility.py`
- `test_allocation.py`
- `test_grab_work.py` (Atomic Single-Slot Concurrency Protection)
- `test_tasks.py`
- `test_earnings.py`

---

## 6. Demo Credentials

| Role | Email | Password | Level & Headline |
| :--- | :--- | :--- | :--- |
| **Primary Worker (Aman Kumar)** | `aman@example.com` | `password123` | Level 3 (Skilled), Backend Developer |
| **Second Worker (Rohan Sharma)** | `rohan@example.com` | `password123` | Level 3 (Skilled), Full Stack Developer |

*Note: On the login page, you can also click the **"Quick 1-Click Demo (Aman Kumar)"** button to log in instantly without typing.*

---

## 7. Features Implemented in this MVP

1. **Full Authentication**: Signup (minimal 4 fields), Login, JWT Tokens, Protected Routes, Logout.
2. **Onboarding Wizard**: 7-step onboarding with live progress tracker (`Profile setup: 75%`).
3. **Availability System**: One-tap toggle (`🟢 Available for Work` / `⚪ Not Available`) that updates the backend immediately.
4. **Task Eligibility Engine**: 8-point backend check preventing unauthorized grabs.
5. **Atomic Grab Work System**: Concurrency-protected slot grabbing ensuring single-assignment guarantee.
6. **Task Workspace & Lifecycle**: 6-stage timeline (Assigned -> In Progress -> Submitted -> Under Review -> Approved -> Paid).
7. **Deliverables Submission**: File upload and review submission.
8. **Skills & Assessments Engine**: Interactive MCQs with instant scoring and verification badge updates.
9. **Improve Your Skills**: Direct connection between learning and earning with targeted opportunity unlocks.
10. **Earnings & Withdrawals**: Live wallet with UPI and Bank Account withdrawal requests.
11. **Performance Metrics**: Ratings, on-time delivery rates, completion percentages, and level advancements.
12. **Notification Center**: Tiered work notifications and unread alert counters.
13. **Responsive Mobile Interface**: Bottom navigation for seamless mobile device usage.

---

## 8. Features Intentionally Left for Future Development

- Client/Employer dashboard and job posting wizard.
- Enterprise SSO and multi-factor hardware keys.
- Direct payment gateway webhooks (e.g. Razorpay/Stripe live banking rails).
- In-app real-time messaging/chat between client and worker.
- Complex community forum or social feeds.
