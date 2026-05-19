from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.user import UserResponse, UserUpdateRequest
from app.models.user import User

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse,
    summary="내 정보 조회",
    description="현재 로그인한 본인 정보 반환."
)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserResponse,
    summary="내 정보 수정",
    description="닉네임, 학번, 전공, 전화번호 수정 가능. 닉네임 중복 불가."
)
def update_me(
    body: UserUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if body.username:
        dup = db.query(User).filter(User.username == body.username, User.id != current_user.id).first()
        if dup:
            raise HTTPException(status_code=400, detail="이미 사용 중인 닉네임입니다")
        current_user.username = body.username
    if body.student_id is not None:
        current_user.student_id = body.student_id
    if body.major is not None:
        current_user.major = body.major
    if body.phone is not None:
        current_user.phone = body.phone

    db.commit()
    db.refresh(current_user)
    return current_user


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT,
    summary="회원 탈퇴",
    description="본인 계정 삭제. 연관된 refresh token도 cascade로 함께 삭제됨."
)
def delete_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db.delete(current_user)
    db.commit()


@router.get("/{user_id}", response_model=UserResponse,
    summary="회원 조회",
    description="승인된 회원만 다른 회원 정보 조회 가능."
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다")
    return user