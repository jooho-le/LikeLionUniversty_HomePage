from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import secrets

from app.database import get_db
from app.schemas.session import SessionCreate, SessionUpdate, SessionResponse
from app.models.session import Session as SessionModel
from app.core.config import ADMIN_USERNAME, ADMIN_PASSWORD
from fastapi.security import HTTPBasic, HTTPBasicCredentials

router = APIRouter(prefix="/admin/sessions", tags=["admin - sessions"])
basic_security = HTTPBasic()


def verify_admin(credentials: HTTPBasicCredentials = Depends(basic_security)):
    ok_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
    ok_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    if not (ok_username and ok_password):
        raise HTTPException(status_code=401, detail="관리자 인증 실패")


@router.post("", response_model=SessionResponse, status_code=status.HTTP_201_CREATED,
    summary="세션 등록",
    description="admin 전용. 동아리 세션(스터디/발표) 등록. session_date는 ISO 8601 형식으로 입력(예: 2025-03-01T14:00:00). category는 backend, frontend, design 중 하나를 입력."
)
def create_session(
    body: SessionCreate,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    session = SessionModel(**body.model_dump())
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.patch("/{session_id}", response_model=SessionResponse,
    summary="세션 수정",
    description="admin 전용. 원하는 필드만 수정 가능. category 수정 시 backend, frontend, design 중 하나를 입력."
)
def update_session(
    session_id: int,
    body: SessionUpdate,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="세션을 찾을 수 없습니다")

    for field, value in body.model_dump(exclude_none=True).items():
        setattr(session, field, value)

    db.commit()
    db.refresh(session)
    return session


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT,
    summary="세션 삭제",
    description="admin 전용. 세션 완전 삭제."
)
def delete_session(
    session_id: int,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="세션을 찾을 수 없습니다")
    db.delete(session)
    db.commit()