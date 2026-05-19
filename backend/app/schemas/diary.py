from pydantic import BaseModel
from datetime import datetime


class DiaryCreate(BaseModel):
    title: str
    content: str


class DiaryUpdate(BaseModel):
    title: str | None = None
    content: str | None = None


class DiaryResponse(BaseModel):
    id: int
    author_id: int
    title: str
    content: str
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None

    model_config = {"from_attributes": True}
