import os
import sys

# Ensure backend directory is in sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import json
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.core.security import get_password_hash
from app.models.user import User
from app.models.worker import WorkerProfile, WorkerLevel, WorkerAvailability, PortfolioItem, WorkHistory
from app.models.skill import Skill, WorkerSkill, SkillAssessment
from app.models.task import Task, TaskRequirement
from app.models.assignment import TaskAssignment
from app.models.submission import TaskSubmission, TaskReview
from app.models.notification import Notification
from app.models.earnings import Earnings, Transaction
from app.models.performance import WorkerPerformance

def seed_initial_database(db: Session):
    # Check if already seeded
    if db.query(WorkerLevel).count() > 0:
        return

    print("Seeding initial platform data...")

    # 1. Worker Levels (1 to 5)
    levels = [
        WorkerLevel(id=1, level_number=1, title="Beginner", min_tasks_required=0, min_completion_rate=0.0, min_rating=0.0, daily_limit=1, badge_name="Level 1 — Beginner"),
        WorkerLevel(id=2, level_number=2, title="Verified", min_tasks_required=5, min_completion_rate=85.0, min_rating=4.2, daily_limit=2, badge_name="Level 2 — Verified"),
        WorkerLevel(id=3, level_number=3, title="Skilled", min_tasks_required=15, min_completion_rate=90.0, min_rating=4.5, daily_limit=2, badge_name="Level 3 — Skilled"),
        WorkerLevel(id=4, level_number=4, title="Advanced", min_tasks_required=30, min_completion_rate=95.0, min_rating=4.7, daily_limit=3, badge_name="Level 4 — Advanced"),
        WorkerLevel(id=5, level_number=5, title="Expert", min_tasks_required=50, min_completion_rate=98.0, min_rating=4.9, daily_limit=4, badge_name="Level 5 — Expert"),
    ]
    db.add_all(levels)
    db.flush()

    # 2. Skills
    skills_data = [
        {"name": "Python", "category": "Backend Development", "description": "Core Python, scripting, async, OOP, and data pipelines.", "icon": "python", "demand_level": "High"},
        {"name": "FastAPI", "category": "Backend Development", "description": "High-performance REST API architecture with Pydantic & AsyncIO.", "icon": "zap", "demand_level": "High"},
        {"name": "PostgreSQL", "category": "Database", "description": "Relational schema design, query optimization, indexing & transactions.", "icon": "database", "demand_level": "High"},
        {"name": "Git", "category": "DevOps & Tools", "description": "Branching workflows, merge conflicts, PRs and version control.", "icon": "git-branch", "demand_level": "Medium"},
        {"name": "Web Development", "category": "Frontend Development", "description": "Modern responsive web applications, HTML5, CSS3, DOM.", "icon": "globe", "demand_level": "High"},
        {"name": "React", "category": "Frontend Development", "description": "React 18 hooks, component patterns, state management.", "icon": "code", "demand_level": "High"},
        {"name": "JavaScript", "category": "Frontend Development", "description": "ES6+, closures, event loop, asynchronous promises.", "icon": "file-code", "demand_level": "High"},
        {"name": "UI/UX Design", "category": "Design", "description": "User research, wireframing, Figma design systems & prototypes.", "icon": "layout", "demand_level": "Medium"},
        {"name": "Video Editing", "category": "Media", "description": "Premiere Pro, DaVinci Resolve, color grading, pacing & audio.", "icon": "video", "demand_level": "High"},
        {"name": "Content Writing", "category": "Writing", "description": "Technical copywriting, SEO articles, documentation.", "icon": "edit-3", "demand_level": "Medium"},
        {"name": "Data Analysis", "category": "Data", "description": "Pandas, NumPy, data cleaning, statistical analysis.", "icon": "bar-chart-2", "demand_level": "High"}
    ]

    skill_records = {}
    for s in skills_data:
        skill = Skill(**s)
        db.add(skill)
        db.flush()
        skill_records[s["name"]] = skill

    # 3. Skill Assessments
    python_questions = [
        {
            "id": 1,
            "question": "What is the expected behavior of a Python generator function when `yield` is executed?",
            "options": [
                "It terminates the function and releases all memory",
                "It pauses execution, preserves local state, and yields a value",
                "It spawns an OS thread to process asynchronously",
                "It returns a tuple of all previously calculated values"
            ],
            "correct_option_index": 1,
            "question_type": "mcq"
        },
        {
            "id": 2,
            "question": "Which concurrency model does FastAPI leverage for non-blocking I/O endpoints?",
            "options": [
                "Multi-threaded preemptive multitasking",
                "Asynchronous event loop with Python asyncio (coroutine-based)",
                "Forked child worker processes per HTTP request",
                "Synchronous blocking threads only"
            ],
            "correct_option_index": 1,
            "question_type": "mcq"
        },
        {
            "id": 3,
            "question": "How do you protect against SQL injection when executing dynamic queries in Python?",
            "options": [
                "Use raw f-strings with input sanitization",
                "Use parameterized queries or ORM expression binding",
                "Encrypt all input strings with base64 before executing",
                "Execute the query twice and compare hashes"
            ],
            "correct_option_index": 1,
            "question_type": "mcq"
        },
        {
            "id": 4,
            "question": "In Python, which built-in data structure offers O(1) average time complexity for key lookups?",
            "options": ["list", "tuple", "dict (hash table)", "linked list"],
            "correct_option_index": 2,
            "question_type": "mcq"
        },
        {
            "id": 5,
            "question": "What is the primary purpose of `with` statement (context manager) in Python?",
            "options": [
                "To accelerate execution loops by JIT compilation",
                "To guarantee deterministic acquisition and release of resources (e.g. file handles/db sessions)",
                "To suppress all exceptions automatically",
                "To create a global singleton instance"
            ],
            "correct_option_index": 1,
            "question_type": "mcq"
        }
    ]

    py_assessment = SkillAssessment(
        skill_id=skill_records["Python"].id,
        title="Python Core & Backend Proficiency Assessment",
        description="Verify your expertise in Python data structures, memory management, generators, and backend patterns.",
        time_limit_minutes=15,
        total_questions=5,
        passing_score=70,
        questions_json=json.dumps(python_questions)
    )
    db.add(py_assessment)

    fastapi_questions = [
        {
            "id": 1,
            "question": "Which Pydantic feature is used in FastAPI to validate request payloads and provide auto-generated OpenAPI documentation?",
            "options": ["BaseModel", "DictValidation", "FastModel", "RequestSchema"],
            "correct_option_index": 0,
            "question_type": "mcq"
        },
        {
            "id": 2,
            "question": "What is the role of `Depends()` in FastAPI route handlers?",
            "options": [
                "It loads external CSS styles",
                "It implements hierarchical Dependency Injection for db sessions, auth, and validations",
                "It delays route execution until client polls",
                "It creates a subprocess"
            ],
            "correct_option_index": 1,
            "question_type": "mcq"
        }
    ]
    fastapi_assessment = SkillAssessment(
        skill_id=skill_records["FastAPI"].id,
        title="FastAPI Microservices & REST Engineering Assessment",
        description="Validate your knowledge of FastAPI dependencies, Pydantic schemas, and asynchronous route handling.",
        time_limit_minutes=10,
        total_questions=2,
        passing_score=70,
        questions_json=json.dumps(fastapi_questions)
    )
    db.add(fastapi_assessment)

    # 4. Primary Worker User: Aman Kumar
    hashed_pwd = get_password_hash("password123")
    aman_user = User(
        full_name="Aman Kumar",
        email="aman@example.com",
        phone_number="+91 98765 43210",
        hashed_password=hashed_pwd,
        is_active=True,
        is_verified=True
    )
    db.add(aman_user)
    db.flush()

    aman_profile = WorkerProfile(
        user_id=aman_user.id,
        headline="Backend Developer",
        bio="Passionate backend engineer specializing in high-concurrency FastAPI microservices, PostgreSQL query optimization, and resilient work-allocation systems.",
        location="Bengaluru, India",
        experience_years=3.5,
        current_level_id=3, # Level 3 Skilled
        daily_task_limit=2,
        onboarding_completed=True,
        onboarding_step=7,
        is_verified_badge=True,
        github_url="https://github.com/amankumar",
        linkedin_url="https://linkedin.com/in/amankumar",
        portfolio_url="https://amankumar.dev"
    )
    db.add(aman_profile)
    db.flush()

    # Aman Availability
    aman_avail = WorkerAvailability(
        worker_id=aman_profile.id,
        is_available=True,
        available_skills_filter=json.dumps([skill_records["Python"].id, skill_records["FastAPI"].id, skill_records["PostgreSQL"].id]),
        auto_notify=True
    )
    db.add(aman_avail)

    # Aman Performance (matching prompt specifications)
    aman_perf = WorkerPerformance(
        worker_id=aman_profile.id,
        tasks_completed=24,
        tasks_assigned=25,
        tasks_on_time=23,
        completion_rate=97.0,
        on_time_delivery_rate=96.0,
        average_rating=4.8,
        quality_score=94,
        reliability_score=96,
        overall_performance_score=92
    )
    db.add(aman_perf)

    # Aman Skills
    aman_skills_data = [
        (skill_records["Python"].id, 91, "Expert", True, 92),
        (skill_records["FastAPI"].id, 82, "Advanced", True, 84),
        (skill_records["PostgreSQL"].id, 76, "Skilled", True, 78),
        (skill_records["Git"].id, 88, "Advanced", True, 88),
    ]
    for sid, prof, tier, ver, score in aman_skills_data:
        ws = WorkerSkill(
            worker_id=aman_profile.id,
            skill_id=sid,
            proficiency_percentage=prof,
            level_tier=tier,
            is_verified=ver,
            verified_at=datetime.now(timezone.utc) - timedelta(days=20),
            last_assessment_score=score
        )
        db.add(ws)

    # Aman Earnings
    aman_earnings = Earnings(
        worker_id=aman_profile.id,
        total_earned=12450.0,
        this_month=5820.0,
        pending_clearance=850.0,
        available_balance=4970.0,
        withdrawn_total=6630.0
    )
    db.add(aman_earnings)

    # Aman Portfolio
    portfolio1 = PortfolioItem(
        worker_id=aman_profile.id,
        title="Async Task Allocation Engine",
        description="High-throughput distributed task scheduler with atomic grab logic, concurrency locking, and Postgres.",
        project_url="https://github.com/amankumar/task-allocator",
        skills_used="Python, FastAPI, PostgreSQL, Redis"
    )
    portfolio2 = PortfolioItem(
        worker_id=aman_profile.id,
        title="Real-time Notification Service",
        description="WebSocket-based instant notification pipeline delivering alerts under 50ms latency.",
        project_url="https://github.com/amankumar/push-pipeline",
        skills_used="Python, AsyncIO, WebSockets"
    )
    db.add_all([portfolio1, portfolio2])

    # Aman Work History
    wh1 = WorkHistory(
        worker_id=aman_profile.id,
        company_or_client="NexGen Tech Labs",
        role="Backend Engineer",
        duration="Jan 2025 – Present",
        description="Architected core REST microservices and database migrations for high-traffic platforms."
    )
    db.add(wh1)

    # Aman Transactions
    txns = [
        Transaction(worker_id=aman_profile.id, amount=850.0, type="TASK_PAYMENT", title="Backend API Development", status="PAID", reference_id="TXN-984210", created_at=datetime.now(timezone.utc) - timedelta(days=1)),
        Transaction(worker_id=aman_profile.id, amount=600.0, type="TASK_PAYMENT", title="PostgreSQL Schema Optimization", status="PAID", reference_id="TXN-873112", created_at=datetime.now(timezone.utc) - timedelta(days=2)),
        Transaction(worker_id=aman_profile.id, amount=-2000.0, type="WITHDRAWAL", title="Withdrawal to UPI (aman@okaxis)", status="PAID", reference_id="WTH-441029", created_at=datetime.now(timezone.utc) - timedelta(days=4)),
        Transaction(worker_id=aman_profile.id, amount=1200.0, type="TASK_PAYMENT", title="FastAPI Async Ingestion Microservice", status="PAID", reference_id="TXN-654921", created_at=datetime.now(timezone.utc) - timedelta(days=6)),
    ]
    db.add_all(txns)

    # 5. Competitor / Second Worker: Rohan Sharma (for race condition & multi-worker tests)
    rohan_user = User(
        full_name="Rohan Sharma",
        email="rohan@example.com",
        phone_number="+91 99887 76655",
        hashed_password=hashed_pwd,
        is_active=True,
        is_verified=True
    )
    db.add(rohan_user)
    db.flush()

    rohan_profile = WorkerProfile(
        user_id=rohan_user.id,
        headline="Full Stack & Python Developer",
        current_level_id=3,
        daily_task_limit=2,
        onboarding_completed=True,
        is_verified_badge=True
    )
    db.add(rohan_profile)
    db.flush()

    rohan_avail = WorkerAvailability(worker_id=rohan_profile.id, is_available=True, auto_notify=True)
    db.add(rohan_avail)

    rohan_perf = WorkerPerformance(
        worker_id=rohan_profile.id,
        tasks_completed=18,
        tasks_assigned=20,
        completion_rate=90.0,
        on_time_delivery_rate=92.0,
        average_rating=4.6,
        overall_performance_score=86
    )
    db.add(rohan_perf)

    rohan_ws = WorkerSkill(
        worker_id=rohan_profile.id,
        skill_id=skill_records["Python"].id,
        proficiency_percentage=85,
        level_tier="Advanced",
        is_verified=True
    )
    db.add(rohan_ws)

    rohan_earnings = Earnings(worker_id=rohan_profile.id, total_earned=8400.0, available_balance=3200.0)
    db.add(rohan_earnings)

    # 6. DEMO TASKS (Ready for Grab Work demo and real-time interaction!)
    # Task 1: ⚡ NEW WORK AVAILABLE (Backend API Development)
    expiry_time = datetime.now(timezone.utc) + timedelta(minutes=45)
    task1 = Task(
        title="Backend API Development",
        description="Build and integrate a clean, async FastAPI endpoint with PostgreSQL database models, JWT validation, and automated test coverage.",
        category="Backend Development",
        payment_amount=900.0,
        currency="INR",
        estimated_time="3 hours",
        deadline_hours=24,
        total_slots=1,
        available_slots=1,
        status="AVAILABLE",
        urgency="HIGH",
        expires_at=expiry_time,
        current_notification_tier=1,
        instructions="Implement the provided endpoint schema. Ensure all input params are strictly validated using Pydantic. Use async/await for database session queries.",
        expected_output="Python files containing router, service function, Pydantic schemas, and a test file demonstrating 100% test pass.",
        submission_rules="Upload clean code in a ZIP file or provide GitHub repo link. No mock credentials in code."
    )
    db.add(task1)
    db.flush()

    req1_1 = TaskRequirement(task_id=task1.id, skill_id=skill_records["Python"].id, min_proficiency=75, min_level_tier="Skilled", is_mandatory=True)
    req1_2 = TaskRequirement(task_id=task1.id, skill_id=skill_records["FastAPI"].id, min_proficiency=70, min_level_tier="Intermediate", is_mandatory=True)
    db.add_all([req1_1, req1_2])

    # Task 2: Frontend Development - Landing Page
    task2 = Task(
        title="Responsive Sky-Blue Landing Page",
        description="Build a high-converting, mobile-responsive landing page showcasing our automated work allocation philosophy with interactive live counters.",
        category="Frontend Development",
        payment_amount=850.0,
        currency="INR",
        estimated_time="3–4 hours",
        deadline_hours=24,
        total_slots=1,
        available_slots=1,
        status="AVAILABLE",
        urgency="NORMAL",
        expires_at=datetime.now(timezone.utc) + timedelta(hours=2),
        current_notification_tier=1,
        instructions="Create semantic HTML and responsive Vanilla CSS. Follow the White + Sky Blue theme strictly.",
        expected_output="HTML, CSS, JS source files zipped or hosted demo link."
    )
    db.add(task2)
    db.flush()

    req2_1 = TaskRequirement(task_id=task2.id, skill_id=skill_records["Web Development"].id, min_proficiency=65, min_level_tier="Intermediate", is_mandatory=True)
    db.add(req2_1)

    # Task 3: PostgreSQL Schema Optimization (Higher level task for demonstration)
    task3 = Task(
        title="PostgreSQL Index & Query Optimization",
        description="Analyze slow queries on a high-throughput transaction ledger and design B-tree and partial indexes to reduce latency below 10ms.",
        category="Database",
        payment_amount=1400.0,
        currency="INR",
        estimated_time="4 hours",
        deadline_hours=48,
        total_slots=1,
        available_slots=1,
        status="AVAILABLE",
        urgency="NORMAL",
        expires_at=datetime.now(timezone.utc) + timedelta(hours=4),
        current_notification_tier=1,
        instructions="Provide EXPLAIN ANALYZE benchmarks before and after index migration.",
        expected_output="SQL migration script and execution plan diff analysis."
    )
    db.add(task3)
    db.flush()

    req3_1 = TaskRequirement(task_id=task3.id, skill_id=skill_records["PostgreSQL"].id, min_proficiency=75, min_level_tier="Skilled", is_mandatory=True)
    db.add(req3_1)

    # 7. One Previous Assigned/Completed task today for Aman (so today count = 1 / 2 completed!)
    task_done = Task(
        title="FastAPI Health Check & Metrics Middleware",
        description="Implement Prometheus metrics middleware and health check probing.",
        category="Backend Development",
        payment_amount=750.0,
        currency="INR",
        estimated_time="2 hours",
        deadline_hours=12,
        total_slots=1,
        available_slots=0,
        status="COMPLETED",
        instructions="Middleware implementation",
        expected_output="Python file"
    )
    db.add(task_done)
    db.flush()

    today_start = datetime.now(timezone.utc).replace(hour=1, minute=0, second=0)
    assigned_done = TaskAssignment(
        task_id=task_done.id,
        worker_id=aman_profile.id,
        status="COMPLETED",
        assigned_at=today_start,
        started_at=today_start,
        due_at=today_start + timedelta(hours=12),
        completed_at=today_start + timedelta(hours=2),
        earnings_processed=True
    )
    db.add(assigned_done)
    db.flush()

    sub_done = TaskSubmission(
        assignment_id=assigned_done.id,
        worker_id=aman_profile.id,
        submission_notes="Implemented prometheus middleware with latency percentiles.",
        files_json=json.dumps([{"name": "middleware.py", "size": 3400, "type": "code/python", "url": "/uploads/middleware.py"}]),
        version=1,
        status="APPROVED",
        submitted_at=today_start + timedelta(hours=2)
    )
    db.add(sub_done)
    db.flush()

    rev_done = TaskReview(
        submission_id=sub_done.id,
        status="APPROVED",
        feedback="Clean, idiomatic middleware implementation. Approved!",
        rating=5.0,
        reviewed_at=today_start + timedelta(hours=2, minutes=15)
    )
    db.add(rev_done)

    # 8. Notifications for Aman
    notif1 = Notification(
        user_id=aman_user.id,
        task_id=task1.id,
        type="NEW_WORK",
        title="⚡ New work available",
        message="Backend API Development • ₹900 • 1 slot available",
        priority="HIGH",
        is_read=False,
        action_url=f"/work/{task1.id}",
        data_json=json.dumps({"task_id": task1.id, "reward": 900.0})
    )
    notif2 = Notification(
        user_id=aman_user.id,
        task_id=task_done.id,
        type="TASK_APPROVED",
        title="Task Approved & Payment Released! 🎉",
        message="Your submission for 'FastAPI Health Check & Metrics Middleware' was approved. ₹750 credited to your balance.",
        priority="HIGH",
        is_read=True,
        action_url="/earnings"
    )
    db.add_all([notif1, notif2])

    db.commit()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    from app.core.database import Base, engine, SessionLocal
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    try:
        seed_initial_database(session)
    finally:
        session.close()
