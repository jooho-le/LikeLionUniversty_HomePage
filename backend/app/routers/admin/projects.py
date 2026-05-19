from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import secrets

from app.database import get_db
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from app.models.project import Project
from app.core.config import ADMIN_USERNAME, ADMIN_PASSWORD
from fastapi.security import HTTPBasic, HTTPBasicCredentials

router = APIRouter(prefix="/admin/projects", tags=["admin - projects"])
basic_security = HTTPBasic()


def verify_admin(credentials: HTTPBasicCredentials = Depends(basic_security)):
    ok_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
    ok_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    if not (ok_username and ok_password):
        raise HTTPException(status_code=401, detail="관리자 인증 실패")


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED,
    summary="프로젝트 등록",
    description="admin 전용. 동아리 프로젝트 등록. tech_stack은 콤마 구분 문자열로 입력(예: FastAPI, React)."
)
def create_project(
    body: ProjectCreate,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    project = Project(**body.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.patch("/{project_id}", response_model=ProjectResponse,
    summary="프로젝트 수정",
    description="admin 전용. 원하는 필드만 수정 가능."
)
def update_project(
    project_id: int,
    body: ProjectUpdate,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="프로젝트를 찾을 수 없습니다")

    for field, value in body.model_dump(exclude_none=True).items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT,
    summary="프로젝트 삭제",
    description="admin 전용. 프로젝트 완전 삭제. 연관된 project_member도 함께 삭제됨."
)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="프로젝트를 찾을 수 없습니다")
    db.delete(project)
    db.commit()