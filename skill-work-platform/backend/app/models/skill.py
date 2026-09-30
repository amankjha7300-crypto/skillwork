from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    category = Column(String(100), default="Development") # Development, Design, Writing, Data, Marketing
    description = Column(Text, nullable=True)
    icon = Column(String(50), default="code")
    demand_level = Column(String(20), default="High") # High, Medium, Low
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    worker_skills = relationship("WorkerSkill", back_populates="skill")
    assessments = relationship("SkillAssessment", back_populates="skill")


class WorkerSkill(Base):
    __tablename__ = "worker_skills"

    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer, ForeignKey("worker_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)
    proficiency_percentage = Column(Integer, default=50) # 0 to 100
    level_tier = Column(String(30), default="Beginner") # Beginner, Intermediate, Skilled, Advanced, Expert
    is_verified = Column(Boolean, default=False, index=True)
    verified_at = Column(DateTime, nullable=True)
    last_assessment_score = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    worker = relationship("WorkerProfile", back_populates="skills")
    skill = relationship("Skill", back_populates="worker_skills")


class SkillAssessment(Base):
    __tablename__ = "skill_assessments"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    time_limit_minutes = Column(Integer, default=15)
    total_questions = Column(Integer, default=5)
    passing_score = Column(Integer, default=70) # percentage
    questions_json = Column(Text, nullable=False) # JSON array of questions, options, correct answers
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    skill = relationship("Skill", back_populates="assessments")
    results = relationship("AssessmentResult", back_populates="assessment")


class AssessmentResult(Base):
    __tablename__ = "assessment_results"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("skill_assessments.id", ondelete="CASCADE"), nullable=False)
    worker_id = Column(Integer, ForeignKey("worker_profiles.id", ondelete="CASCADE"), nullable=False)
    score = Column(Integer, nullable=False) # 0 to 100
    achieved_level = Column(String(30), nullable=False) # Beginner, Intermediate, Skilled, Advanced, Expert
    passed = Column(Boolean, default=True)
    answers_submitted = Column(Text, nullable=True)
    completed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    assessment = relationship("SkillAssessment", back_populates="results")
    worker = relationship("WorkerProfile")
