import os
from pathlib import Path
from pydantic_settings import BaseSettings

_BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
_DEFAULT_DB_FILE = (_BACKEND_DIR / "skillwork.db").as_posix()
_DEFAULT_DB_URL = f"sqlite:///{_DEFAULT_DB_FILE}"

class Settings(BaseSettings):
    PROJECT_NAME: str = "SkillWork Work-Allocation Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "skillwork-super-secret-jwt-key-2026-production-ready")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", _DEFAULT_DB_URL)
    
    # Task & Allocation Settings
    DEFAULT_DAILY_TASK_LIMIT: int = 2
    BATCH_EXPIRY_SECONDS: int = 90  # 90 seconds for Tier 1 before opening to Tier 2
    TASK_GRAB_TIMEOUT_SECONDS: int = 300  # 5 minutes
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:8000",
        "*"
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
