from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str
    status: str
    student_id: str | None
    major: str | None
    phone: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdateRequest(BaseModel):
    username: str | None = None
    student_id: str | None = None
    major: str | None = None
    phone: str | None = None


class AdminUserUpdateRequest(BaseModel):
    role: str | None = None
    status: str | None = None
    username: str | None = None
    student_id: str | None = None
    major: str | None = None
    phone: str | None = None