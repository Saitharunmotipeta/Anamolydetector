from sqlalchemy import Column, Integer, String, DateTime, Float
from datetime import datetime
from app.core.database import Base

class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    level = Column(String)
    message = Column(String)
    endpoint = Column(String, nullable=True)
    response_time = Column(Float, nullable=True)
    ip = Column(String, nullable=True)
