from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.apply import ApplyCreate, ApplyResponse
from app.models.application import Application
from app.models.user import User

router = APIRouter(prefix="/apply", tags=["apply"])


@router.post("", response_model=ApplyResponse, status_code=status.HTTP_201_CREATED,
    summary="동아리 지원",
    description="누구나 지원 가능. 지원 후 status는 pending 상태. 로그인 불필요."
)
def create_apply(body: ApplyCreate, db: Session = Depends(get_db)):
    apply = Application(
        name=body.name,
        email=body.email,
        phone=body.phone,
        motivation=body.motivation,
        status="pending",
    )
    db.add(apply)
    db.commit()
    db.refresh(apply)
    return apply


@router.get("/{apply_id}", response_model=ApplyResponse,
    summary="지원 내역 상세 조회",
    description="승인된 회원만 조회 가능. 지원 ID로 특정 지원 내역 조회."
)
def get_apply(
    apply_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    apply = db.query(Application).filter(Application.id == apply_id).first()
    if not apply:
        raise HTTPException(status_code=404, detail="지원 내역을 찾을 수 없습니다")
    return apply