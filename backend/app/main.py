from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.database import engine, Base
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-username.github.io",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.1.100:5173",
    ],
    allow_origin_regex=r"http://192\.168\.\d+\.\d+:(5173|3000)",
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
