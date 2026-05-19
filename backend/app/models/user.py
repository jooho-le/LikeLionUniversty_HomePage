from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="member")     # member | staff
    status = Column(String, default="pending")  # pending | approved | rejected
    student_id = Column(String, nullable=True)
    major = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete")
    posts = relationship("Diary", back_populates="author")
    member_profile = relationship("Member", back_populates="user", uselist=False)