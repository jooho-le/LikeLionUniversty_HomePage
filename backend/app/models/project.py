from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Project(Base):
    __tablename__ = "project"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    tech_stack = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    demo_url = Column(String, nullable=True)
    thumbnail = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    project_members = relationship("ProjectMember", back_populates="project")


class ProjectMember(Base):
    __tablename__ = "project_member"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("project.id"), nullable=False)
    member_id = Column(Integer, ForeignKey("member.id"), nullable=False)
    role_in_project = Column(String, nullable=True)

    project = relationship("Project", back_populates="project_members")
    member = relationship("Member", back_populates="project_members")