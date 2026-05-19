from pydantic import BaseModel
from datetime import datetime


class SessionCreate(BaseModel):
    title: str
    description: str | None = None
    presenter: str | None = None
    session_date: datetime | None = None
    material_url: str | None = None


class SessionUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    presenter: str | None = None
    session_date: datetime | None = None
    material_url: str | None = None


class SessionResponse(BaseModel):
    id: int
    title: str
    description: str | None
    presenter: str | None
    session_date: datetime | None
    material_url: str | None
    created_at: datetime

    model_config = {"from_attributes": True}