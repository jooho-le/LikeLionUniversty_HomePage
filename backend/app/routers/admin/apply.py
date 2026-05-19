from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import secrets

from app.database import get_db
from app.schemas.apply import ApplyResponse
from app.models.application import Application
from app.core.config import ADMIN_USERNAME, ADMIN_PASSWORD
from fastapi.security import HTTPBasic, HTTPBasicCredentials

router = APIRouter(prefix="/admin/apply", tags=["admin - apply"])
basic_security = HTTPBasic()


def verify_admin(credentials: HTTPBasicCredentials = Depends(basic_security)):
    ok_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
    ok_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    if not (ok_username and ok_password):
        raise HTTPException(status_code=401, detail="관리자 인증 실패")


@router.get("", response_model=list[ApplyResponse],
    summary="전체 지원 목록 조회",
    description="admin 전용. 모든 지원 내역 최신순 조회. status별 필터링은 프론트에서 처리."
)
def get_all_applies(
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    return db.query(Application).order_by(Application.applied_at.desc()).all()


@router.delete("/{apply_id}", status_code=status.HTTP_204_NO_CONTENT,
    summary="지원 내역 삭제",
    description="admin 전용. 특정 지원 내역 완전 삭제."
)
def delete_apply(
    apply_id: int,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    apply = db.query(Application).filter(Application.id == apply_id).first()
    if not apply:
        raise HTTPException(status_code=404, detail="지원 내역을 찾을 수 없습니다")
    db.delete(apply)
    db.commit()