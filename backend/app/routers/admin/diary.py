from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
import secrets

from app.database import get_db
from app.models.diary import Diary
from app.core.config import ADMIN_USERNAME, ADMIN_PASSWORD
from fastapi.security import HTTPBasic, HTTPBasicCredentials

router = APIRouter(prefix="/admin/diary", tags=["admin - diary"])
basic_security = HTTPBasic()


def verify_admin(credentials: HTTPBasicCredentials = Depends(basic_security)):
    ok_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
    ok_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    if not (ok_username and ok_password):
        raise HTTPException(status_code=401, detail="관리자 인증 실패")


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT,
    summary="일지 강제 삭제",
    description="admin 전용. 타인 일지도 삭제 가능. 실제 삭제가 아닌 deleted_at 기록(soft delete)."
)
def admin_delete_diary(
    post_id: int,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    diary = db.query(Diary).filter(Diary.id == post_id, Diary.deleted_at == None).first()
    if not diary:
        raise HTTPException(status_code=404, detail="일지를 찾을 수 없습니다")

    diary.deleted_at = datetime.utcnow()
    db.commit()
