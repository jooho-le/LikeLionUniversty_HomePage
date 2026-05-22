from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from sqlalchemy.orm import Session
import secrets

from app.database import get_db
from app.core.security import decode_token
from app.core.config import ADMIN_USERNAME, ADMIN_PASSWORD
from app.models.user import User

security = HTTPBearer()
basic_security = HTTPBasic()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    token = credentials.credentials
    payload = decode_token(token)

    if not payload or payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="유효하지 않은 토큰입니다")

    user_id = payload.get("sub")
    try:
        user_id = int(user_id)
    except (TypeError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="유효하지 않은 토큰입니다")

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="사용자를 찾을 수 없습니다")
    if user.status != "approved":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="승인되지 않은 계정입니다")

    return user


def get_current_staff(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "staff":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="운영진만 접근 가능합니다")
    return current_user


def verify_admin(credentials: HTTPBasicCredentials = Depends(basic_security)):
    ok_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
    ok_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    if not (ok_username and ok_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="관리자 인증 실패")
