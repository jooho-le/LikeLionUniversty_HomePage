from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.database import Base


class Application(Base):
    __tablename__ = "application"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    motivation = Column(Text, nullable=True)
    status = Column(String, default="pending")  # pending | approved | rejected
    applied_at = Column(DateTime, default=datetime.utcnow)