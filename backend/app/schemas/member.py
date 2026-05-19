from pydantic import BaseModel


class MemberCreate(BaseModel):
    name: str
    role_label: str | None = None
    github_url: str | None = None
    profile_image: str | None = None
    joined_year: int | None = None
    user_id: int | None = None


class MemberUpdate(BaseModel):
    name: str | None = None
    role_label: str | None = None
    github_url: str | None = None
    profile_image: str | None = None
    joined_year: int | None = None


class MemberResponse(BaseModel):
    id: int
    user_id: int | None
    name: str
    role_label: str | None
    github_url: str | None
    profile_image: str | None
    joined_year: int | None

    model_config = {"from_attributes": True}