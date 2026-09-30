from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.models import *  # Import all models to ensure metadata registration
from app.api.auth import router as auth_router
from app.api.worker import router as worker_router
from app.api.skills import router as skills_router
from app.api.work import router as work_router
from app.api.tasks import router as tasks_router
from app.api.notifications import router as notifications_router
from app.api.earnings import router as earnings_router
from app.api.performance import router as performance_router
import os
import sys

# Ensure root directory is in sys.path
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from database.seed_data import seed_initial_database

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed default data
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_initial_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Worker-Side Allocation Platform API: Don't make workers search for work. Bring suitable work to them.",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(worker_router, prefix=settings.API_V1_STR)
app.include_router(skills_router, prefix=settings.API_V1_STR)
app.include_router(work_router, prefix=settings.API_V1_STR)
app.include_router(tasks_router, prefix=settings.API_V1_STR)
app.include_router(notifications_router, prefix=settings.API_V1_STR)
app.include_router(earnings_router, prefix=settings.API_V1_STR)
app.include_router(performance_router, prefix=settings.API_V1_STR)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "philosophy": "Don't make workers search for work. Bring suitable work to them."
    }

@app.get("/")
def root():
    return {
        "message": "Welcome to SkillWork Allocation Platform API",
        "docs_url": "/docs",
        "health_check": "/health"
    }
