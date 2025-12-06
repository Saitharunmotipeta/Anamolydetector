from sklearn.ensemble import IsolationForest
import numpy as np
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Dict
from collections import Counter
from app.models.log import Log
from app.services.db_service import save_anomalies


# ------------------------------------------------------
# MODULE 1 — STATISTICAL ANOMALY DETECTION (IsolationForest + Z-Score)
# ------------------------------------------------------
def _prepare_features(db: Session):
    rows = db.query(Log).filter(Log.response_time != None).all()
    if not rows:
        return None, []
    X = np.array([[float(r.response_time)] for r in rows])
    return X, rows


def z_score(values):
    mean = np.mean(values)
    std = np.std(values) or 1
    return [(v - mean) / std for v in values]


def classify_severity(score: float):
    if score >= 1.0:
        return "critical"
    if score >= 0.7:
        return "high"
    if score >= 0.3:
        return "medium"
    return "low"


def detect_anomaly_type(log: Log):
    if log.response_time and log.response_time > 1.0:
        return "latency_spike"
    if log.level and log.level.upper() in ["ERROR", "CRITICAL"]:
        return "error_spike"
    return "unusual_pattern"


def run_detection(db: Session) -> List[Dict]:
    X, rows = _prepare_features(db)
    if X is None or X.size == 0:
        return []

    # Isolation Forest
    model = IsolationForest(n_estimators=120, contamination=0.03, random_state=42)
    model.fit(X)
    iso_scores = model.decision_function(X)
    iso_preds = model.predict(X)

    # Z-score
    values = [float(x[0]) for x in X]
    z_scores = z_score(values)

    anomalies = []

    for idx, log in enumerate(rows):
        iso_anomaly = iso_preds[idx] == -1
        z_anomaly = abs(z_scores[idx]) > 3

        if iso_anomaly or z_anomaly:
            score = float(abs(z_scores[idx]) + max(0, -iso_scores[idx]))

            anomalies.append({
                "timestamp": datetime.utcnow(),
                "type": detect_anomaly_type(log),
                "score": round(score, 4),
                "severity": classify_severity(score),
                "message": log.message,
                "log_id": log.id
            })

    if anomalies:
        save_anomalies(db, anomalies)

    return anomalies


# ------------------------------------------------------
# MODULE 2 — ERROR SPIKE + API FAILURE DETECTION
# ------------------------------------------------------
def run_error_spike_detection(db: Session, window_minutes: int = 5, testing: bool = False):
    now = datetime.utcnow()

    # For real detection use sliding window
    if testing:
        logs = db.query(Log).all()
    else:
        window_start = now - timedelta(minutes=window_minutes)
        logs = db.query(Log).filter(Log.timestamp >= window_start).all()

    if not logs:
        return []

    # Filter error logs
    error_logs = [l for l in logs if l.level and l.level.upper() in ["ERROR", "CRITICAL"]]
    endpoint_errors = Counter([l.endpoint for l in error_logs if l.endpoint])
    endpoint_totals = Counter([l.endpoint for l in logs if l.endpoint])

    anomalies = []

    for endpoint, err_count in endpoint_errors.items():
        total_count = endpoint_totals.get(endpoint, 1)
        failure_rate = err_count / total_count

        # Spike detection
        if failure_rate > 0.3:
            anomalies.append({
                "timestamp": now,
                "type": "error_spike",
                "severity": "high" if failure_rate > 0.5 else "medium",
                "endpoint": endpoint,
                "error_count": err_count,
                "total_count": total_count,
                "failure_rate": round(failure_rate, 3)
            })

        # Downtime detection (Critical)
        critical_failures = [
            l for l in error_logs
            if l.endpoint == endpoint and (l.level.upper() == "CRITICAL" or str(l.level).startswith("5"))
        ]

        if len(critical_failures) >= 3:
            anomalies.append({
                "timestamp": now,
                "type": "api_failure",
                "severity": "critical",
                "endpoint": endpoint,
                "message": "Multiple server failures detected (possible downtime)"
            })

    if anomalies:
        save_anomalies(db, anomalies)

    return anomalies
