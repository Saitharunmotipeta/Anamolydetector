from sqlalchemy.orm import Session
from typing import List, Dict
from app.models.log import Log
from app.models.anomaly import Anomaly
from app.models.metric import Metric
from datetime import datetime

def save_parsed_logs(db: Session, parsed: List[Dict]) -> List[int]:
    saved_ids = []
    for p in parsed:
        log = Log(
            timestamp=p.get("timestamp") or datetime.utcnow(),
            level=p.get("level"),
            message=p.get("message"),
            endpoint=p.get("endpoint"),
            response_time=p.get("response_time"),
            ip=p.get("ip")
        )
        db.add(log)
    db.commit()
    # Return latest N ids — simple approach
    rows = db.query(Log).order_by(Log.id.desc()).limit(len(parsed)).all()
    return [r.id for r in rows[::-1]]

def get_parsed_logs(db: Session, limit: int = 100):
    rows = db.query(Log).order_by(Log.timestamp.desc()).limit(limit).all()
    return [{"id": r.id, "timestamp": r.timestamp.isoformat(), "level": r.level, "endpoint": r.endpoint, "message": r.message, "response_time": r.response_time, "ip": r.ip} for r in rows]

def save_anomalies(db: Session, anomalies: List[Dict]):
    for a in anomalies:
        an = Anomaly(
            timestamp=a.get("timestamp") or datetime.utcnow(),
            type=a.get("type"),
            score=a.get("score"),
            severity=a.get("severity"),
            message=a.get("message"),
            log_id=a.get("log_id")
        )
        db.add(an)
    db.commit()

def get_anomalies(db: Session):
    rows = db.query(Anomaly).order_by(Anomaly.timestamp.desc()).limit(500).all()
    return [{"id": r.id, "timestamp": r.timestamp.isoformat(), "type": r.type, "score": r.score, "severity": r.severity, "message": r.message, "log_id": r.log_id} for r in rows]
