from pydantic import BaseModel
from datetime import datetime


class ProjectCreate(BaseModel):
    title: str
    description: str | None = None
    tech_stack: str | None = None
    github_url: str | None = None
    demo_url: str | None = None
    thumbnail: str | None = None


class ProjectUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    tech_stack: str | None = None
    github_url: str | None = None
    demo_url: str | None = None
    thumbnail: str | None = None


class ProjectResponse(BaseModel):
    id: int
    title: str
    description: str | None
    tech_stack: str | None
    github_url: str | None
    demo_url: str | None
    thumbnail: str | None
    created_at: datetime

    model_config = {"from_attributes": True}