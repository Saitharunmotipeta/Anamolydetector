from sqlalchemy.orm import Session
from typing import List, Dict
<<<<<<< HEAD
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
=======
from datetime import datetime

from app.models.log import Log
from app.models.anomaly import Anomaly
from app.models.metric import Metric


# -----------------------------
# CANONICAL DEFINITIONS
# -----------------------------
CANONICAL_LEVELS = {
    "INFO",
    "WARN",
    "ERROR",
    "DEBUG",
    "CRITICAL"
}


def normalize_level(raw_level: str | None, testing: bool = False) -> str:
    """
    Normalize log level to canonical values.
    Protects DB constraints and ML pipelines.
    """
    if not raw_level:
        return "INFO"

    level = raw_level.strip().upper()

    if level in CANONICAL_LEVELS:
        return level

    if testing:
        if "ERROR" in level or "EXCEPTION" in level or "TRACEBACK" in level:
            return "ERROR"
        if "WARN" in level:
            return "WARN"
        if "DEBUG" in level:
            return "DEBUG"
        return "INFO"

    return "INFO"


# -----------------------------
# LOG PERSISTENCE
# -----------------------------
def save_parsed_logs(
    db: Session,
    parsed: List[Dict],
    testing: bool = False
) -> List[int]:
    saved_ids = []

    for p in parsed:
        log = Log(
            timestamp=p.get("timestamp") or datetime.utcnow(),
            level=normalize_level(p.get("level"), testing=testing),
>>>>>>> f58c6c11b8e6116f90a1fbd213462af7722cd660
            message=p.get("message"),
            endpoint=p.get("endpoint"),
            response_time=p.get("response_time"),
            ip=p.get("ip")
        )
        db.add(log)
<<<<<<< HEAD
    db.commit()
    # Return latest N ids — simple approach
    rows = db.query(Log).order_by(Log.id.desc()).limit(len(parsed)).all()
    return [r.id for r in rows[::-1]]

def get_parsed_logs(db: Session, limit: int = 100):
    rows = db.query(Log).order_by(Log.timestamp.desc()).limit(limit).all()
    return [{"id": r.id, "timestamp": r.timestamp.isoformat(), "level": r.level, "endpoint": r.endpoint, "message": r.message, "response_time": r.response_time, "ip": r.ip} for r in rows]

=======

    db.commit()

    rows = (
        db.query(Log)
        .order_by(Log.id.desc())
        .limit(len(parsed))
        .all()
    )

    return [r.id for r in rows[::-1]]


def get_parsed_logs(db: Session, limit: int = 100):
    rows = (
        db.query(Log)
        .order_by(Log.timestamp.desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "id": r.id,
            "timestamp": r.timestamp.isoformat(),
            "level": r.level,
            "endpoint": r.endpoint,
            "message": r.message,
            "response_time": r.response_time,
            "ip": r.ip,
        }
        for r in rows
    ]


# -----------------------------
# ANOMALIES
# -----------------------------
>>>>>>> f58c6c11b8e6116f90a1fbd213462af7722cd660
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
<<<<<<< HEAD
    db.commit()

def get_anomalies(db: Session):
    rows = db.query(Anomaly).order_by(Anomaly.timestamp.desc()).limit(500).all()
    return [{"id": r.id, "timestamp": r.timestamp.isoformat(), "type": r.type, "score": r.score, "severity": r.severity, "message": r.message, "log_id": r.log_id} for r in rows]
=======

    db.commit()


def get_anomalies(db: Session):
    rows = (
        db.query(Anomaly)
        .order_by(Anomaly.timestamp.desc())
        .limit(500)
        .all()
    )

    return [
        {
            "id": r.id,
            "timestamp": r.timestamp.isoformat(),
            "type": r.type,
            "score": r.score,
            "severity": r.severity,
            "message": r.message,
            "log_id": r.log_id,
        }
        for r in rows
    ]
>>>>>>> f58c6c11b8e6116f90a1fbd213462af7722cd660
