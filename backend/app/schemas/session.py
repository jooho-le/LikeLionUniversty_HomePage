from pydantic import BaseModel
from datetime import datetime
from typing import Literal

CategoryType = Literal["backend", "frontend", "design"]


class SessionCreate(BaseModel):
    title: str
    category: CategoryType
    description: str | None = None
    presenter: str | None = None
    session_date: datetime | None = None
    material_url: str | None = None


class SessionUpdate(BaseModel):
    title: str | None = None
    category: CategoryType | None = None
    description: str | None = None
    presenter: str | None = None
    session_date: datetime | None = None
    material_url: str | None = None


class SessionResponse(BaseModel):
    id: int
    title: str
    category: CategoryType
    description: str | None
    presenter: str | None
    session_date: datetime | None
    material_url: str | None
    created_at: datetime

    model_config = {"from_attributes": True}