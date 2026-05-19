from sqlalchemy import Column, Integer, String, Text, DateTime, CheckConstraint
from datetime import datetime
from app.database import Base


class Session(Base):
    __tablename__ = "session"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    presenter = Column(String, nullable=True)
    session_date = Column(DateTime, nullable=True)
    material_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    category = Column(String, nullable=False)

    __table_args__ = (
        CheckConstraint("category IN ('backend', 'frontend', 'design')", name="session_category_check"),
    )