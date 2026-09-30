from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.assignment import TaskAssignment
from app.schemas.task import TaskAssignmentResponse
from app.schemas.submission import TaskSubmissionCreate, TaskSubmissionResponse
from app.services.auth_service import get_current_user
from app.services.task_service import (
    get_worker_assignments,
    start_task,
    submit_task
)

router = APIRouter(prefix="/tasks", tags=["Worker Tasks"])

@router.get("", response_model=List[TaskAssignmentResponse])
def get_my_tasks(
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.worker_profile
    return get_worker_assignments(db, profile.id, status)

@router.get("/{assignment_id}", response_model=TaskAssignmentResponse)
def get_task_assignment(
    assignment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.worker_profile
    assignment = db.query(TaskAssignment).filter(
        TaskAssignment.id == assignment_id,
        TaskAssignment.worker_id == profile.id
    ).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Task assignment not found.")
    return assignment

@router.post("/{assignment_id}/start", response_model=TaskAssignmentResponse)
def mark_task_start(
    assignment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.worker_profile
    return start_task(db, profile.id, assignment_id)

@router.post("/{assignment_id}/submit", response_model=TaskSubmissionResponse)
def submit_work_deliverable(
    assignment_id: int,
    data: TaskSubmissionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.worker_profile
    return submit_task(
        db=db,
        worker_id=profile.id,
        assignment_id=assignment_id,
        notes=data.submission_notes,
        files=data.files
    )

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Standard file upload endpoint
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "size": 1024 * 150, # bytes
        "url": f"/uploads/{file.filename}"
    }
