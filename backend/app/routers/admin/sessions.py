from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session
from datetime import datetime
from pathlib import Path
from uuid import uuid4

from app.database import get_db
from app.dependencies import verify_admin
from app.schemas.session import SessionCreate, SessionUpdate, SessionResponse, CategoryType
from app.models.session import Session as SessionModel

router = APIRouter(prefix="/admin/sessions", tags=["admin - sessions"])

UPLOAD_DIR = Path(__file__).resolve().parents[3] / "uploads" / "session-materials"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
ALLOWED_MATERIAL_EXTENSIONS = {
    ".pdf",
    ".ppt",
    ".pptx",
    ".doc",
    ".docx",
    ".hwp",
    ".hwpx",
    ".txt",
    ".md",
    ".zip",
    ".png",
    ".jpg",
    ".jpeg",
}


@router.post("", response_model=SessionResponse, status_code=status.HTTP_201_CREATED,
    summary="세션 등록",
    description="admin 전용. 동아리 세션(스터디/발표) 등록. session_date는 ISO 8601 형식으로 입력(예: 2025-03-01T14:00:00). category는 backend, frontend, design 중 하나를 입력."
)
def create_session(
    body: SessionCreate,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    session = SessionModel(**body.model_dump())
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.post("/upload", response_model=SessionResponse, status_code=status.HTTP_201_CREATED,
    summary="파일 첨부 세션 등록",
    description="admin 전용. 세션 내용 등록 시 자료 파일을 함께 업로드 가능."
)
async def create_session_with_file(
    title: str = Form(...),
    category: CategoryType = Form(...),
    description: str | None = Form(None),
    presenter: str | None = Form(None),
    session_date: str | None = Form(None),
    material_file: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    parsed_session_date = None
    if session_date:
        try:
            parsed_session_date = datetime.fromisoformat(session_date)
        except ValueError:
            raise HTTPException(status_code=400, detail="session_date는 ISO 8601 형식이어야 합니다")

    material_url = None
    if material_file and material_file.filename:
        extension = Path(material_file.filename).suffix.lower()
        if extension not in ALLOWED_MATERIAL_EXTENSIONS:
            raise HTTPException(status_code=400, detail="지원하지 않는 파일 형식입니다")

        filename = f"{uuid4().hex}{extension}"
        destination = UPLOAD_DIR / filename
        content = await material_file.read()
        destination.write_bytes(content)
        material_url = f"/uploads/session-materials/{filename}"

    session = SessionModel(
        title=title,
        category=category,
        description=description,
        presenter=presenter,
        session_date=parsed_session_date,
        material_url=material_url,
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.patch("/{session_id}", response_model=SessionResponse,
    summary="세션 수정",
    description="admin 전용. 원하는 필드만 수정 가능. category 수정 시 backend, frontend, design 중 하나를 입력."
)
def update_session(
    session_id: int,
    body: SessionUpdate,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="세션을 찾을 수 없습니다")

    for field, value in body.model_dump(exclude_none=True).items():
        setattr(session, field, value)

    db.commit()
    db.refresh(session)
    return session


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT,
    summary="세션 삭제",
    description="admin 전용. 세션 완전 삭제."
)
def delete_session(
    session_id: int,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin),
):
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="세션을 찾을 수 없습니다")
    db.delete(session)
    db.commit()
