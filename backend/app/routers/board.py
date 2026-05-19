from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.board import BoardCreate, BoardUpdate, BoardResponse
from app.models.board import Board
from app.models.user import User

router = APIRouter(prefix="/board", tags=["board"])


@router.get("", response_model=list[BoardResponse],
    summary="게시글 목록 조회",
    description="삭제되지 않은 게시글 전체 목록. 최신순 정렬. 승인된 회원만 접근 가능."
)
def get_boards(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Board).filter(Board.deleted_at == None).order_by(Board.created_at.desc()).all()


@router.get("/{post_id}", response_model=BoardResponse,
    summary="게시글 상세 조회",
    description="특정 게시글 상세 조회. 삭제된 게시글은 404 반환."
)
def get_board(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    board = db.query(Board).filter(Board.id == post_id, Board.deleted_at == None).first()
    if not board:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")
    return board


@router.post("", response_model=BoardResponse, status_code=status.HTTP_201_CREATED,
    summary="게시글 작성",
    description="승인된 회원만 게시글 작성 가능. author_id는 토큰에서 자동 추출."
)
def create_board(
    body: BoardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    board = Board(
        author_id=current_user.id,
        title=body.title,
        content=body.content,
    )
    db.add(board)
    db.commit()
    db.refresh(board)
    return board


@router.patch("/{post_id}", response_model=BoardResponse,
    summary="게시글 수정",
    description="본인 게시글만 수정 가능. 제목/내용 중 원하는 필드만 수정 가능."
)
def update_board(
    post_id: int,
    body: BoardUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    board = db.query(Board).filter(Board.id == post_id, Board.deleted_at == None).first()
    if not board:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")
    if board.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="본인 게시글만 수정할 수 있습니다")

    if body.title is not None:
        board.title = body.title
    if body.content is not None:
        board.content = body.content

    db.commit()
    db.refresh(board)
    return board


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT,
    summary="게시글 삭제",
    description="본인 게시글만 삭제 가능. 실제 삭제가 아닌 deleted_at 시간 기록(soft delete)."
)
def delete_board(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    board = db.query(Board).filter(Board.id == post_id, Board.deleted_at == None).first()
    if not board:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")
    if board.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="본인 게시글만 삭제할 수 있습니다")

    board.deleted_at = datetime.utcnow()
    db.commit()