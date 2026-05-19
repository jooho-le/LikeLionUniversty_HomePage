from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.database import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, RefreshRequest
from app.schemas.user import UserResponse
from app.models.user import User
from app.models.refresh_token import RefreshToken
from app.core.security import (
    hash_password, verify_password,
    create_access_token, create_refresh_token, decode_token,
)
from app.core.config import REFRESH_TOKEN_EXPIRE_DAYS

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED,
    summary="회원가입",
    description="누구나 가입 가능. 가입 후 status는 pending 상태로 admin 승인 대기. 이메일/닉네임 중복 불가."
)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(status_code=400, detail="이미 사용 중인 이메일입니다")
    if db.query(User).filter(User.username == body.username).first():
        raise HTTPException(status_code=400, detail="이미 사용 중인 닉네임입니다")

    user = User(
        username=body.username,
        email=body.email,
        password_hash=hash_password(body.password),
        student_id=body.student_id,
        major=body.major,
        phone=body.phone,
        role="member",
        status="pending",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=TokenResponse,
    summary="로그인",
    description="이메일/비밀번호로 로그인. 승인된 회원만 가능. access token(30분)과 refresh token(7일) 반환."
)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()

    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="이메일 또는 비밀번호가 올바르지 않습니다")
    if user.status == "pending":
        raise HTTPException(status_code=403, detail="가입 승인 대기 중입니다. 운영진에게 문의하세요")
    if user.status == "rejected":
        raise HTTPException(status_code=403, detail="가입이 거절된 계정입니다")

    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    db_token = RefreshToken(
        user_id=user.id,
        token=refresh_token,
        expires_at=datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
    )
    db.add(db_token)
    db.commit()

    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=TokenResponse,
    summary="액세스 토큰 재발급",
    description="access token 만료 시 refresh token으로 새 토큰 쌍 재발급. 기존 refresh token은 삭제되고 새걸로 교체됨(rotation)."
)
def refresh(body: RefreshRequest, db: Session = Depends(get_db)):
    payload = decode_token(body.refresh_token)

    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="유효하지 않은 refresh token입니다")

    db_token = db.query(RefreshToken).filter(RefreshToken.token == body.refresh_token).first()
    if not db_token or db_token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="만료되었거나 존재하지 않는 refresh token입니다")

    user = db.query(User).filter(User.id == int(payload.get("sub"))).first()
    if not user:
        raise HTTPException(status_code=401, detail="사용자를 찾을 수 없습니다")

    db.delete(db_token)

    new_access_token = create_access_token({"sub": str(user.id), "role": user.role})
    new_refresh_token = create_refresh_token({"sub": str(user.id)})

    new_db_token = RefreshToken(
        user_id=user.id,
        token=new_refresh_token,
        expires_at=datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
    )
    db.add(new_db_token)
    db.commit()

    return TokenResponse(access_token=new_access_token, refresh_token=new_refresh_token)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT,
    summary="로그아웃",
    description="refresh token을 DB에서 삭제. 이후 해당 refresh token으로 재발급 불가."
)
def logout(body: RefreshRequest, db: Session = Depends(get_db)):
    db_token = db.query(RefreshToken).filter(RefreshToken.token == body.refresh_token).first()
    if db_token:
        db.delete(db_token)
        db.commit()