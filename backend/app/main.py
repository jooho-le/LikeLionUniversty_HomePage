from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.models import *
from app.routers import auth, users, board, apply, members, projects, sessions
from app.routers.admin import users as admin_users
from app.routers.admin import board as admin_board
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
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(board.router)
app.include_router(apply.router)
app.include_router(members.router)
app.include_router(projects.router)
app.include_router(sessions.router)
app.include_router(admin_users.router)
app.include_router(admin_board.router)
app.include_router(admin_apply.router)
app.include_router(admin_members.router)
app.include_router(admin_projects.router)
app.include_router(admin_sessions.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}