from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional

from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.diary import DiaryCreate, DiaryUpdate, DiaryResponse, CategoryType
from app.models.diary import Diary
from app.models.user import User

router = APIRouter(prefix="/diary", tags=["diary"])


@router.get("", response_model=list[DiaryResponse],
    summary="일지 목록 조회",
    description="삭제되지 않은 일지 목록. category 쿼리로 backend/frontend/design 필터링 가능. 최신순 정렬."
)
def get_diaries(
    category: Optional[CategoryType] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Diary).filter(Diary.deleted_at == None)
    if category:
        query = query.filter(Diary.category == category)
    return query.order_by(Diary.created_at.desc()).all()


@router.get("/{post_id}", response_model=DiaryResponse,
    summary="일지 상세 조회",
    description="특정 일지 상세 조회. 삭제된 일지는 404 반환."
)
def get_diary(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    diary = db.query(Diary).filter(Diary.id == post_id, Diary.deleted_at == None).first()
    if not diary:
        raise HTTPException(status_code=404, detail="일지를 찾을 수 없습니다")
    return diary


@router.post("", response_model=DiaryResponse, status_code=status.HTTP_201_CREATED,
    summary="일지 작성",
    description="승인된 회원만 일지 작성 가능. author_id는 토큰에서 자동 추출. category는 backend, frontend, design 중 하나를 입력."
)
def create_diary(
    body: DiaryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    diary = Diary(
        author_id=current_user.id,
        title=body.title,
        content=body.content,
        category=body.category,
    )
    db.add(diary)
    db.commit()
    db.refresh(diary)
    return diary


@router.patch("/{post_id}", response_model=DiaryResponse,
    summary="일지 수정",
    description="본인 일지만 수정 가능. 원하는 필드만 수정 가능. category 수정 시 backend, frontend, design 중 하나를 입력."
)
def update_diary(
    post_id: int,
    body: DiaryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    diary = db.query(Diary).filter(Diary.id == post_id, Diary.deleted_at == None).first()
    if not diary:
        raise HTTPException(status_code=404, detail="일지를 찾을 수 없습니다")
    if diary.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="본인 일지만 수정할 수 있습니다")

    if body.title is not None:
        diary.title = body.title
    if body.content is not None:
        diary.content = body.content
    if body.category is not None:
        diary.category = body.category

    db.commit()
    db.refresh(diary)
    return diary


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT,
    summary="일지 삭제",
    description="본인 일지만 삭제 가능. 실제 삭제가 아닌 deleted_at 시간 기록(soft delete)."
)
def delete_diary(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    diary = db.query(Diary).filter(Diary.id == post_id, Diary.deleted_at == None).first()
    if not diary:
        raise HTTPException(status_code=404, detail="일지를 찾을 수 없습니다")
    if diary.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="본인 일지만 삭제할 수 있습니다")

    diary.deleted_at = datetime.utcnow()
    db.commit()
