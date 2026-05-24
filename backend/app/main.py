from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.database import engine, Base
from app.core.config import CORS_ORIGINS, CORS_ORIGIN_REGEX
from app.models import *
from app.routers import auth, users, diary, apply, members, projects, sessions
from app.routers.admin import users as admin_users
from app.routers.admin import diary as admin_diary
from app.routers.admin import apply as admin_apply
from app.routers.admin import members as admin_members
from app.routers.admin import projects as admin_projects
from app.routers.admin import sessions as admin_sessions

Base.metadata.create_all(bind=engine)

app = FastAPI(title="JBNU - Likelion Home API", version="1.0.0")

UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_origin_regex=CORS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(diary.router)
app.include_router(apply.router)
app.include_router(members.router)
app.include_router(projects.router)
app.include_router(sessions.router)
app.include_router(admin_users.router)
app.include_router(admin_diary.router)
app.include_router(admin_apply.router)
app.include_router(admin_members.router)
app.include_router(admin_projects.router)
app.include_router(admin_sessions.router)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    errors = []
    for error in exc.errors():
        location = ".".join(str(part) for part in error.get("loc", []) if part != "body")
        message = error.get("msg", "Invalid value")
        errors.append({"field": location or "body", "message": message})

    return JSONResponse(
        status_code=422,
        content={
            "detail": "요청 데이터가 올바르지 않습니다. 입력값을 확인해주세요.",
            "errors": errors,
        },
    )


@app.get("/health")
def health_check():
    return {"status": "ok"}
