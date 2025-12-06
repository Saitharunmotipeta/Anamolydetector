from sqlalchemy import Column, Integer, Float, DateTime
from datetime import datetime
from app.core.database import Base


class Metric(Base):
    __tablename__ = "metrics"

    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    total_logs = Column(Integer)
    error_count = Column(Integer)
    avg_response_time = Column(Float)

    low = Column(Integer)
    medium = Column(Integer)
    high = Column(Integer)
    critical = Column(Integer)

    def as_dict(self):
        return {
            "id": self.id,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "total_logs": self.total_logs,
            "error_count": self.error_count,
            "avg_response_time": self.avg_response_time,
            "severity_counts": {
                "low": self.low,
                "medium": self.medium,
                "high": self.high,
                "critical": self.critical
            }
        }
