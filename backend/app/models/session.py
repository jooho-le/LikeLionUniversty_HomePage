from sqlalchemy import Column, Integer, String, Text, DateTime
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