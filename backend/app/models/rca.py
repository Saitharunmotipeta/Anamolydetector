from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.core.database import Base

class RCAResult(Base):
    __tablename__ = "rca_results"

    id = Column(Integer, primary_key=True)

    root_cause = Column(String)
    impact = Column(String)

    affected_endpoints = Column(String)      # JSON string
    recommended_actions = Column(String)     # JSON string

    risk_level = Column(String)
    confidence = Column(Float)
    context_used = Column(String)


    created_at = Column(DateTime, default=datetime.utcnow)
