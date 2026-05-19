from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.project import ProjectResponse, ProjectListResponse
from app.models.project import Project

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=list[ProjectListResponse],
    summary="프로젝트 목록 조회",
    description="누구나 조회 가능. id, title, thumbnail, tech_stack만 반환."
)
def get_projects(db: Session = Depends(get_db)):
    return db.query(Project).order_by(Project.created_at.desc()).all()


@router.get("/{project_id}", response_model=ProjectResponse,
    summary="프로젝트 상세 조회",
    description="누구나 조회 가능. 로그인 불필요."
)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="프로젝트를 찾을 수 없습니다")
    return project