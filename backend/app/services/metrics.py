from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from collections import Counter, defaultdict
from statistics import mean, pstdev
from app.models.log import Log
from app.models.anomaly import Anomaly
from app.models.metric import Metric

# Normalize severity keys
SEVERITY_KEYS = ["low", "medium", "high", "critical"]


# ==========================================================
# 4.0 — Daily Aggregated Metrics (KPI Card)
# ==========================================================
def aggregate_metrics(db: Session, days: int = 7):
    since = datetime.utcnow() - timedelta(days=days)

    logs = db.query(Log).filter(Log.timestamp >= since).all()
    total = len(logs)

    if total == 0:
        return {
            "total_logs": 0,
            "error_count": 0,
            "avg_response_time": 0,
            "error_rate": 0,
            "severity": {k: 0 for k in SEVERITY_KEYS},
        }

    # classify errors
    errors = [
        l for l in logs
        if l.level and l.level.upper() in ["ERROR", "CRITICAL"]
    ]

    resp_times = [l.response_time for l in logs if l.response_time is not None]
    avg_resp = mean(resp_times) if resp_times else 0.0

    error_rate = round(len(errors) / total, 4)

    # anomaly severity aggregation
    anomalies = db.query(Anomaly).filter(Anomaly.timestamp >= since).all()
    severity_count = {k: 0 for k in SEVERITY_KEYS}

    for a in anomalies:
        sev = str(a.severity).lower()
        if sev in severity_count:
            severity_count[sev] += 1

    metric = Metric(
        total_logs=total,
        error_count=len(errors),
        avg_response_time=avg_resp,
        low=severity_count["low"],
        medium=severity_count["medium"],
        high=severity_count["high"],
        critical=severity_count["critical"],
    )

    db.add(metric)
    db.commit()

    return {
        "total_logs": total,
        "error_count": len(errors),
        "avg_response_time": avg_resp,
        "error_rate": error_rate,
        "severity": severity_count
    }


# ==========================================================
# 4.1 — Top Error Endpoints
# ==========================================================
def get_top_errors(db: Session, hours: int = 48, limit: int = 10):
    since = datetime.utcnow() - timedelta(hours=hours)

    rows = db.query(Log).filter(Log.timestamp >= since).all()

    errors = [
        r for r in rows
        if r.endpoint and r.level and r.level.upper() in ["ERROR", "CRITICAL"]
    ]

    if not errors:
        return []

    counter = Counter([e.endpoint for e in errors])
    total_errors = len(errors)

    result = [
        {
            "endpoint": ep,
            "error_count": count,
            "error_percent": round(count / total_errors, 4)
        }
        for ep, count in counter.most_common(limit)
    ]

    return result


# ==========================================================
# 4.2 — Most Frequent Anomaly Types
# ==========================================================
def top_anomaly_endpoints(db: Session, days: int = 7):
    since = datetime.utcnow() - timedelta(days=days)
    anomalies = db.query(Anomaly).filter(Anomaly.timestamp >= since).all()

    if not anomalies:
        return []

    counter = Counter(a.type.lower() for a in anomalies if a.type)
    total = len(anomalies)

    return [
        {"type": t, "count": c, "percent": round(c / total, 4)}
        for t, c in counter.most_common(5)
    ]


# ==========================================================
# 4.3 — Downtime Indicators
# ==========================================================
def downtime_indicators(db: Session, days: int = 7):
    since = datetime.utcnow() - timedelta(days=days)
    logs = db.query(Log).filter(Log.timestamp >= since).all()

    endpoints = defaultdict(lambda: {"critical": 0, "error": 0, "ok": 0})

    for l in logs:
        if not l.endpoint:
            continue
        lvl = l.level.upper() if l.level else "INFO"
        if lvl == "CRITICAL":
            endpoints[l.endpoint]["critical"] += 1
        elif lvl == "ERROR":
            endpoints[l.endpoint]["error"] += 1
        else:
            endpoints[l.endpoint]["ok"] += 1

    result = []
    for ep, c in endpoints.items():
        total_hits = c["critical"] + c["error"] + c["ok"]
        failures = c["critical"] + c["error"]

        if total_hits < 5:
            continue

        if failures >= 3 and c["ok"] == 0:
            result.append({
                "endpoint": ep,
                "issues": failures,
                "total_hits": total_hits,
                "severity": "critical" if c["critical"] >= 2 else "high",
                "downtime_score": round(failures / total_hits, 3),
                "message": "Possible downtime — consistent failure pattern detected"
            })

    return result


# ==========================================================
# 4.4 — Slowest Endpoints (avg + p95)
# ==========================================================
def slowest_endpoints(db: Session, days: int = 7):
    since = datetime.utcnow() - timedelta(days=days)

    logs = db.query(Log).filter(
        Log.timestamp >= since,
        Log.response_time != None
    ).all()

    groups = defaultdict(list)
    for l in logs:
        if l.endpoint:
            groups[l.endpoint].append(l.response_time)

    result = []
    for ep, vals in groups.items():
        if not vals:
            continue

        vals_sorted = sorted(vals)
        p95 = vals_sorted[int(0.95 * len(vals_sorted))]

        result.append({
            "endpoint": ep,
            "avg": round(mean(vals), 4),
            "p95": round(p95, 4),
            "count": len(vals)
        })

    return sorted(result, key=lambda x: x["avg"], reverse=True)[:5]


# ==========================================================
# 4.5 — Error Trend Summary
# ==========================================================
def error_trend_summary(db: Session, days: int = 7):
    since = datetime.utcnow() - timedelta(days=days)
    logs = db.query(Log).filter(Log.timestamp >= since).all()

    total = len(logs)
    if total == 0:
        return {
            "total_logs": 0,
            "error_count": 0,
            "error_rate": 0,
            "avg_response_time": 0,
            "stdev_response_time": 0
        }

    errors = [
        l for l in logs
        if l.level and l.level.upper() in ["ERROR", "CRITICAL"]
    ]

    resp = [l.response_time for l in logs if l.response_time is not None]

    return {
        "total_logs": total,
        "error_count": len(errors),
        "error_rate": round(len(errors) / total, 4),
        "avg_response_time": round(mean(resp), 4) if resp else 0,
        "stdev_response_time": round(pstdev(resp), 4) if len(resp) > 1 else 0
    }
