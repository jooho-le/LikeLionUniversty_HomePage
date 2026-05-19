from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Member(Base):
    __tablename__ = "member"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=True)
    name = Column(String, nullable=False)
    role_label = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    profile_image = Column(String, nullable=True)
    joined_year = Column(Integer, nullable=True)

    user = relationship("User", back_populates="member_profile")
    project_members = relationship("ProjectMember", back_populates="member")