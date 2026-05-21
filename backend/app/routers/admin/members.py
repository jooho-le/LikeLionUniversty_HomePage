from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import verify_admin
from app.schemas.member import MemberCreate, MemberUpdate, MemberResponse
from app.models.member import Member

router = APIRouter(prefix="/admin/members", tags=["admin - members"])


@router.post("", response_model=MemberResponse, status_code=status.HTTP_201_CREATED,
    summary="멤버 등록",
    description="admin 전용. 동아리 멤버 프로필 등록. user_id는 선택사항(가입 유저와 연결할 때만 입력)."
)
def create_member(
    body: MemberCreate,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    member = Member(**body.model_dump())
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


@router.patch("/{member_id}", response_model=MemberResponse,
    summary="멤버 정보 수정",
    description="admin 전용. 이름, 역할, GitHub URL, 프로필 이미지, 가입 연도 수정 가능."
)
def update_member(
    member_id: int,
    body: MemberUpdate,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    member = db.query(Member).filter(Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="멤버를 찾을 수 없습니다")

    for field, value in body.model_dump(exclude_none=True).items():
        setattr(member, field, value)

    db.commit()
    db.refresh(member)
    return member


@router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT,
    summary="멤버 삭제",
    description="admin 전용. 동아리 멤버 프로필 완전 삭제."
)
def delete_member(
    member_id: int,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    member = db.query(Member).filter(Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="멤버를 찾을 수 없습니다")
    db.delete(member)
    db.commit()
