from pydantic import BaseModel
from datetime import datetime


class BoardCreate(BaseModel):
    title: str
    content: str


class BoardUpdate(BaseModel):
    title: str | None = None
    content: str | None = None


class BoardResponse(BaseModel):
    id: int
    author_id: int
    title: str
    content: str
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None

    model_config = {"from_attributes": True}