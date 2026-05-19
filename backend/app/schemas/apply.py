from pydantic import BaseModel, EmailStr
from datetime import datetime


class ApplyCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    motivation: str | None = None


class ApplyResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str | None
    motivation: str | None
    status: str
    applied_at: datetime

    model_config = {"from_attributes": True}