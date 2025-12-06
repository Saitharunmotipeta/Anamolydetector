from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from collections import Counter
from app.models.log import Log
from app.services.db_service import save_anomalies


# -------------------------------------------------------------------
# MODULE 3.1 — FAILED LOGIN SPIKE (Brute-force detection)
# -------------------------------------------------------------------
def detect_login_spike(db: Session, *, window_minutes=10, testing=False):
    now = datetime.utcnow()
    logs = db.query(Log).all() if testing else \
        db.query(Log).filter(Log.timestamp >= now - timedelta(minutes=window_minutes)).all()

    failed = [
        l for l in logs
        if l.endpoint == "/api/login"
        and l.level
        and l.level.upper() in ["ERROR", "CRITICAL"]
    ]

    if not failed:
        return []

    count = len(failed)
    severity = "medium" if count < 5 else "critical"

    anomaly = {
        "timestamp": now,
        "type": "login_bruteforce",
        "severity": severity,
        "endpoint": "/api/login",
        "failed_attempts": count,
        "message": "Suspicious number of failed login attempts detected"
    }

    save_anomalies(db, [anomaly])
    return [anomaly]


# -------------------------------------------------------------------
# MODULE 3.2 — SUSPICIOUS IP FLOOD (High request volume)
# -------------------------------------------------------------------
def detect_suspicious_ip(db: Session, *, threshold=30, window_minutes=10, testing=False):
    now = datetime.utcnow()
    logs = db.query(Log).all() if testing else \
        db.query(Log).filter(Log.timestamp >= now - timedelta(minutes=window_minutes)).all()

    ip_counts = Counter([l.ip for l in logs if l.ip])
    anomalies = []

    for ip, count in ip_counts.items():
        if count >= threshold:
            anomalies.append({
                "timestamp": now,
                "type": "ip_flood",
                "severity": "high" if count < 60 else "critical",
                "ip": ip,
                "hit_count": count,
                "message": f"IP {ip} is generating unusually high traffic"
            })

    if anomalies:
        save_anomalies(db, anomalies)

    return anomalies


# -------------------------------------------------------------------
# MODULE 3.3 — ROOT CAUSE REPEATED ERRORS
# -------------------------------------------------------------------
def detect_root_cause_repeats(db: Session, *, testing=False):
    now = datetime.utcnow()

    logs = db.query(Log).all() if testing else \
        db.query(Log).filter(Log.timestamp >= now - timedelta(hours=1)).all()

    messages = [l.message for l in logs if l.message]
    counts = Counter(messages)
    anomalies = []

    for msg, count in counts.items():
        if count >= 5:
            anomalies.append({
                "timestamp": now,
                "type": "repeated_root_cause",
                "message": msg,
                "occurrences": count,
                "severity": "medium" if count < 10 else "high"
            })

    if anomalies:
        save_anomalies(db, anomalies)

    return anomalies


# -------------------------------------------------------------------
# MODULE 3.4 — SEQUENCE ANOMALY (Suspicious event order)
# -------------------------------------------------------------------
def detect_sequence_anomaly(db: Session, *, testing=False):
    now = datetime.utcnow()

    logs = db.query(Log).all() if testing else \
        db.query(Log).filter(Log.timestamp >= now - timedelta(minutes=30)).all()

    logs = sorted(logs, key=lambda l: l.timestamp)

    anomalies = []
    last_event = None

    for log in logs:

        if last_event == "login" and log.endpoint == "/api/delete-account":
            anomalies.append({
                "timestamp": now,
                "type": "sequence_anomaly",
                "severity": "high",
                "message": "Delete account triggered immediately after login. Suspicious sequence.",
                "log_id": log.id,
            })
            break

        if log.endpoint == "/api/login":
            last_event = "login"

    if anomalies:
        save_anomalies(db, anomalies)

    return anomalies


# -------------------------------------------------------------------
# COMBINED SECURITY PIPELINE
# -------------------------------------------------------------------
def run_all_security_checks(db: Session, testing=False):
    return {
        "login_bruteforce": detect_login_spike(db, testing=testing),
        "suspicious_ip": detect_suspicious_ip(db, testing=testing),
        "root_cause_repeats": detect_root_cause_repeats(db, testing=testing),
        "sequence_anomaly": detect_sequence_anomaly(db, testing=testing),
    }
