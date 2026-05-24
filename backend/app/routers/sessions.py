from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.schemas.session import SessionResponse, CategoryType
from app.models.session import Session as SessionModel

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.get("", response_model=list[SessionResponse],
    summary="세션 목록 조회",
    description="누구나 조회 가능. category 쿼리로 backend/frontend/design 필터링 가능."
)
def get_sessions(
    category: Optional[CategoryType] = None,
    db: Session = Depends(get_db),
):
    query = db.query(SessionModel)
    if category:
        query = query.filter(SessionModel.category == category)
    return query.order_by(SessionModel.session_date.desc()).all()


@router.get("/{session_id}", response_model=SessionResponse,
    summary="세션 상세 조회",
    description="누구나 조회 가능. 로그인 불필요."
)
def get_session(session_id: int, db: Session = Depends(get_db)):
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="세션을 찾을 수 없습니다")
    return session
