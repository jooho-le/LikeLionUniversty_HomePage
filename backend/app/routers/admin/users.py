from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import verify_admin
from app.schemas.user import UserResponse, AdminUserUpdateRequest
from app.models.user import User

router = APIRouter(prefix="/admin/users", tags=["admin - users"])


@router.get("", response_model=list[UserResponse],
    summary="전체 회원 목록 조회",
    description="admin 전용. 가입 대기, 승인, 거절 상태의 모든 회원을 최신순으로 조회."
)
def admin_get_users(
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    return db.query(User).order_by(User.created_at.desc()).all()


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT,
    summary="회원 강제 삭제",
    description="admin 전용. 특정 회원 계정 및 연관 데이터 삭제."
)
def admin_delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다")
    db.delete(user)
    db.commit()


@router.patch("/{user_id}", response_model=UserResponse,
    summary="회원 정보 수정",
    description="admin 전용. role(member/staff), status(pending/approved/rejected) 및 기타 정보 수정 가능."
)
def admin_update_user(
    user_id: int,
    body: AdminUserUpdateRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다")

    if body.role is not None:
        if body.role not in ("member", "staff"):
            raise HTTPException(status_code=400, detail="role은 member 또는 staff여야 합니다")
        user.role = body.role
    if body.status is not None:
        if body.status not in ("pending", "approved", "rejected"):
            raise HTTPException(status_code=400, detail="status는 pending / approved / rejected여야 합니다")
        user.status = body.status
    if body.username is not None:
        user.username = body.username
    if body.student_id is not None:
        user.student_id = body.student_id
    if body.major is not None:
        user.major = body.major
    if body.phone is not None:
        user.phone = body.phone

    db.commit()
    db.refresh(user)
    return user


@router.patch("/{user_id}/approve", response_model=UserResponse,
    summary="회원 가입 승인",
    description="admin 전용. pending 상태 회원을 approved로 변경. 이후 해당 회원 로그인 가능."
)
def admin_approve_user(
    user_id: int,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다")
    if user.status == "approved":
        raise HTTPException(status_code=400, detail="이미 승인된 사용자입니다")

    user.status = "approved"
    db.commit()
    db.refresh(user)
    return user
