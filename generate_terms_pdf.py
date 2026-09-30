import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether, PageBreak
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))

        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "SkillWork Platform — Major Technical Terms & Architectural Glossary")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.75)
            self.line(54, 744, 558, 744)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.75)
        self.line(54, 46, 558, 46)
        
        self.drawString(54, 34, "Confidential & Technical Documentation | SkillWork Platform")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 34, page_str)
        self.restoreState()

def create_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom styles matching Sky Blue + Slate theme
    primary_color = colors.HexColor("#0284C7")
    sky_blue = colors.HexColor("#38BDF8")
    dark_text = colors.HexColor("#0F172A")
    muted_text = colors.HexColor("#475569")
    bg_light = colors.HexColor("#F8FCFF")
    card_border = colors.HexColor("#BAE6FD")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=dark_text,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=16,
        textColor=muted_text,
        spaceAfter=15
    )

    badge_style = ParagraphStyle(
        'Badge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=primary_color
    )

    h1_style = ParagraphStyle(
        'Heading1Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=primary_color,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    term_name_style = ParagraphStyle(
        'TermName',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=dark_text
    )

    term_category_style = ParagraphStyle(
        'TermCat',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=primary_color
    )

    body_style = ParagraphStyle(
        'TermBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=dark_text
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=muted_text,
        leftIndent=10
    )

    story = []

    # Title Card Table
    title_data = [
        [
            Paragraph("TECHNICAL SPECIFICATION & GLOSSARY", badge_style),
        ],
        [
            Paragraph("SkillWork Platform: Major Technical Terms & Architectural Concepts", title_style),
        ],
        [
            Paragraph("Comprehensive reference guide covering the automated work-allocation paradigm, concurrency control, backend engine, and full-stack architecture.", subtitle_style),
        ]
    ]
    title_table = Table(title_data, colWidths=[504])
    title_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F0F9FF")),
        ('BOX', (0,0), (-1,-1), 1, card_border),
        ('PADDING', (0,0), (-1,-1), 14),
        ('BOTTOMPADDING', (0,0), (-1,0), 4),
        ('TOPPADDING', (0,1), (-1,1), 2),
        ('BOTTOMPADDING', (0,1), (-1,1), 6),
        ('TOPPADDING', (0,2), (-1,2), 0),
        ('BOTTOMPADDING', (0,2), (-1,2), 8),
    ]))
    story.append(title_table)
    story.append(Spacer(1, 14))

    # Sections of technical terms
    sections = [
        {
            "category": "1. Work-Allocation Engine & Concurrency Control",
            "description": "Mechanisms that eliminate manual job searches and prevent race conditions when multiple workers compete for allocations.",
            "terms": [
                {
                    "name": "Automated Work Push Allocation",
                    "short": "Push-Based Work Distribution vs Pull-Based Gig Marketplaces",
                    "explanation": "Unlike traditional freelance marketplaces (e.g., Upwork, Fiverr) where workers search, bid, and wait, SkillWork operates on a reverse 'push' paradigm. The platform dynamically matches open tasks to qualified, available workers and pushes real-time opportunities directly to their dashboards.",
                    "details": [
                        "Eliminates unpaid bidding and proposal writing time for skilled workers.",
                        "Replaces the traditional search bar with an automated matching and notification pipeline."
                    ]
                },
                {
                    "name": "Atomic Database Row Locking & Race Condition Prevention",
                    "short": "SELECT FOR UPDATE / Atomic Conditional UPDATE (available_slots > 0)",
                    "explanation": "A critical concurrency mechanism that prevents two workers from successfully claiming the same single task slot simultaneously when clicking 'Grab Work' at the exact same millisecond.",
                    "details": [
                        "Executes: UPDATE tasks SET available_slots = available_slots - 1 WHERE id = :id AND available_slots > 0 AND status = 'AVAILABLE'.",
                        "Database guarantees only 1 transaction gets rowcount == 1 (200 OK); concurrent callers receive rowcount == 0 and an immediate HTTP 409 Conflict."
                    ]
                },
                {
                    "name": "Candidate Priority Scoring Algorithm",
                    "short": "Weighted Multi-Factor Deterministic Scoring Engine",
                    "explanation": "A mathematical scoring model used by the Allocation Service to rank eligible workers before dispatching notifications, ensuring top-performing and reliable workers receive priority access.",
                    "details": [
                        "Formula: Score = (Proficiency × 35%) + (Completion Rate × 25%) + (On-Time Rate × 15%) + (Rating × 15%) + Fairness Factor.",
                        "Includes an anti-monopoly cooldown so a single high performer cannot monopolize all incoming work."
                    ]
                },
                {
                    "name": "8-Point Eligibility Filter Engine",
                    "short": "Multi-Gate Pre-Qualification Verification",
                    "explanation": "A strict 8-step verification pipeline in the backend that any worker must satisfy before a task is visible or assignable to them.",
                    "details": [
                        "Gates: 1) Active Account, 2) Task Availability, 3) Open Allocation Window, 4) Worker Available (Online), 5) Exact Skill Match, 6) Verified Proficiency Threshold, 7) Daily Task Limit (< 2/day), 8) No Active Conflicting Task."
                    ]
                },
                {
                    "name": "Tiered Batch Notification & Escalation Window",
                    "short": "Staged Alert Dispatch with Expiry Timers",
                    "explanation": "Instead of blasting all 10,000 workers at once, work is dispatched in timed tiers. Tier 1 (top candidates) receives an exclusive 5-10 minute window. If unclaimed, background workers escalate the task to Tier 2 (wider pool).",
                    "details": [
                        "Protects worker attention and prevents alert fatigue.",
                        "Ensures high-urgency tasks are filled quickly while rewarding top reliability."
                    ]
                }
            ]
        },
        {
            "category": "2. Backend Engineering & Data Architecture",
            "description": "High-performance API layer, database design, and asynchronous worker architecture.",
            "terms": [
                {
                    "name": "FastAPI & ASGI (Asynchronous Server Gateway Interface)",
                    "short": "Modern Python Asynchronous Web Framework",
                    "explanation": "The core backend engine running Python 3.11+ using Uvicorn. ASGI enables non-blocking asynchronous request handling with native Python type annotations, achieving performance comparable to NodeJS and Go.",
                    "details": [
                        "Auto-generates interactive Swagger (OpenAPI 3.0) documentation at /docs.",
                        "Delivers sub-millisecond route dispatching for high-frequency work grabbing."
                    ]
                },
                {
                    "name": "Pydantic V2 Validation & Serialization",
                    "short": "High-Speed Rust-Powered Data Modeling",
                    "explanation": "The data parsing and validation core of the backend. Enforces strict type schemas on all incoming requests, query params, and outgoing JSON payloads with compile-time-like guarantees.",
                    "details": [
                        "Eliminates silent data corruption and runtime type errors.",
                        "Automatically sanitizes inputs against malicious payloads."
                    ]
                },
                {
                    "name": "SQLAlchemy ORM & SQLite WAL Mode",
                    "short": "Object-Relational Mapping with Write-Ahead Logging",
                    "explanation": "Maps Python classes directly to database tables while preserving ACID transactional integrity. Configured with SQLite WAL (Write-Ahead Logging) for zero-config local development, allowing concurrent readers and writers.",
                    "details": [
                        "Supports production drop-in migration to PostgreSQL without changing business logic.",
                        "WAL mode eliminates 'database table locked' errors during concurrent worker operations."
                    ]
                },
                {
                    "name": "JWT (JSON Web Token) & BCrypt Security",
                    "short": "Stateless Cryptographic Authentication",
                    "explanation": "Industry-standard authentication architecture. Passwords are salted and hashed using BCrypt (cost factor 12). Client sessions are validated statelessly via signed HS256 JWT tokens containing worker identity and role claims.",
                    "details": [
                        "Enables horizontal scaling without server-side session caches.",
                        "Protected endpoints require an 'Authorization: Bearer <token>' header."
                    ]
                },
                {
                    "name": "Background Daemon Workers (Workers & Cron)",
                    "short": "Autonomous Asynchronous Task Processors",
                    "explanation": "Autonomous background services that run concurrently with the API to perform housekeeping without blocking HTTP request threads.",
                    "details": [
                        "Allocation Worker: Monitors unclaimed tasks and promotes them across notification tiers.",
                        "Task Expiry Worker: Automatically reclaims abandoned or expired tasks and restores available slots."
                    ]
                }
            ]
        },
        {
            "category": "3. Worker Progression & Task Lifecycle Engine",
            "description": "State machines governing the 6-stage lifecycle, performance metrics, and skill unlocks.",
            "terms": [
                {
                    "name": "6-Stage Task Lifecycle State Machine",
                    "short": "Strict Deterministic Workflow State Transitions",
                    "explanation": "Every assigned task moves through a strictly ordered finite state machine: 1) Assigned → 2) In Progress → 3) Submitted → 4) Under Review → 5) Approved → 6) Paid.",
                    "details": [
                        "Enforces business rules at each transition (e.g., cannot submit without file attachments or review notes).",
                        "Provides transparent audit trails for both worker and platform admin."
                    ]
                },
                {
                    "name": "Exponential Moving Average (EMA) Performance Tracking",
                    "short": "Dynamic Quality & Reliability Metrics",
                    "explanation": "Worker statistics (On-Time Delivery Rate, Quality Rating, Task Completion Percentage) are calculated dynamically rather than as simple static averages. Recent performance is weighted more heavily to reward continuous improvement.",
                    "details": [
                        "Powers worker progression: Level 1 (Novice) → Level 2 (Competent) → Level 3 (Skilled) → Level 4 (Expert).",
                        "Higher tiers unlock higher-paying tasks and expanded daily task limits."
                    ]
                },
                {
                    "name": "Skill Competency Scoring & MCQ Quiz Engine",
                    "short": "Interactive In-Platform Skill Verification",
                    "explanation": "Workers verify their abilities by taking timed, domain-specific multiple-choice assessments. The engine scores submissions, calculates a percentile proficiency score, and updates the worker's verified skills profile.",
                    "details": [
                        "Only verified skills with score >= min_proficiency qualify for task allocation.",
                        "Directly links learning and testing to immediate earning unlocks."
                    ]
                }
            ]
        },
        {
            "category": "4. Financial Ledger & Payout Subsystem",
            "description": "Financial accounting models ensuring trust, transparency, and instant settlements.",
            "terms": [
                {
                    "name": "Immutable Double-Entry Financial Ledger",
                    "short": "Audit-Proof Transaction Recording",
                    "explanation": "Worker balances are never stored as a simple modifiable integer. Every monetary change (Task Reward, Platform Fee, Withdrawal, Reversal) is stored as an immutable ledger transaction with a timestamp, reference ID, and balance snapshot.",
                    "details": [
                        "Prevents phantom balance updates and unauthorized tampering.",
                        "Guarantees current balance = sum of credits - sum of debits."
                    ]
                },
                {
                    "name": "Instant Withdrawal Simulation (UPI / IMPS)",
                    "short": "Zero-Wait Worker Settlement",
                    "explanation": "Simulates immediate payouts to worker UPI IDs (e.g., worker@okhdfcbank) or direct bank accounts with zero platform lock-in, reflecting the gig economy requirement for rapid liquidity.",
                    "details": [
                        "Validates available balance vs minimum withdrawal thresholds.",
                        "Instantly shifts ledger status from PENDING to PROCESSED."
                    ]
                }
            ]
        },
        {
            "category": "5. Frontend Architecture & User Experience",
            "description": "Modern Next.js 14 architecture, state management, and real-time interface design.",
            "terms": [
                {
                    "name": "Next.js 14 App Router & React 18",
                    "short": "Modern Component Hierarchy with Nested Layouts",
                    "explanation": "The client-side architecture uses Next.js 14 App Router with TypeScript. Pages and layouts are nested cleanly, isolating UI updates and enabling fast client-side navigation without full-page reloads.",
                    "details": [
                        "Employs 'use client' directives for interactive components (timers, modals, grab buttons).",
                        "Pure Vanilla CSS architecture avoiding heavy external CSS framework overhead."
                    ]
                },
                {
                    "name": "Live Availability Toggle & Real-Time Polling",
                    "short": "Instant Worker State Synchronization",
                    "explanation": "The global live availability switch (🟢 Available / ⚪ Offline) in the top navigation bar immediately updates the backend state, gating the allocation engine in real time.",
                    "details": [
                        "Workers toggling offline immediately stop receiving task countdown notifications.",
                        "Hooks (useAvailability, useNotifications) poll endpoints to maintain UI freshness."
                    ]
                },
                {
                    "name": "Atomic CTA & Optimistic UI Updates",
                    "short": "Low-Latency User Feedback Loops",
                    "explanation": "When a worker taps 'Grab Work', the UI instantly enters an optimistic loading state with tactile feedback, locking the button against double-clicks while the backend executes the atomic row update.",
                    "details": [
                        "If successful: smooth transition into the 6-stage Task Workspace.",
                        "If claimed by someone else: immediate graceful alert banner with 409 Conflict explanation."
                    ]
                }
            ]
        }
    ]

    for section in sections:
        story.append(Paragraph(section["category"], h1_style))
        story.append(Paragraph(section["description"], subtitle_style))
        story.append(Spacer(1, 4))

        for term in section["terms"]:
            term_cell = [
                Paragraph(term["name"].upper(), term_name_style),
                Paragraph(term["short"], term_category_style),
                Spacer(1, 3),
                Paragraph(term["explanation"], body_style),
                Spacer(1, 4),
            ]
            for detail in term["details"]:
                term_cell.append(Paragraph(f"• <b>Key Mechanism:</b> {detail}", bullet_style))

            term_table = Table([[term_cell]], colWidths=[504])
            term_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FFFFFF")),
                ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#E2E8F0")),
                ('LINELEFT', (0,0), (-1,-1), 3, primary_color),
                ('PADDING', (0,0), (-1,-1), 8),
                ('TOPPADDING', (0,0), (-1,-1), 8),
                ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ]))
            story.append(term_table)
            story.append(Spacer(1, 8))

        story.append(Spacer(1, 6))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF at: {output_path}")

if __name__ == "__main__":
    out1 = r"c:\Users\Aman Kumar\OneDrive\Desktop\projects60\skill-work-platform\SkillWork_Technical_Terms_Guide.pdf"
    out2 = r"c:\Users\Aman Kumar\OneDrive\Desktop\projects60\SkillWork_Technical_Terms_Guide.pdf"
    create_pdf(out1)
    create_pdf(out2)
