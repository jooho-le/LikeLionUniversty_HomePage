from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.member import MemberResponse
from app.models.member import Member

router = APIRouter(prefix="/members", tags=["members"])


@router.get("", response_model=list[MemberResponse],
    summary="동아리 멤버 전체 조회",
    description="누구나 조회 가능. 로그인 불필요."
)
def get_members(db: Session = Depends(get_db)):
    return db.query(Member).all()