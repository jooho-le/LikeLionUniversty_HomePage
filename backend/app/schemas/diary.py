from pydantic import BaseModel
from datetime import datetime
from typing import Literal

CategoryType = Literal["backend", "frontend", "design"]


class DiaryCreate(BaseModel):
    title: str
    content: str
    category: CategoryType


class DiaryUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    category: CategoryType | None = None


class DiaryResponse(BaseModel):
    id: int
    author_id: int
    title: str
    content: str
    category: CategoryType
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None

    model_config = {"from_attributes": True}
