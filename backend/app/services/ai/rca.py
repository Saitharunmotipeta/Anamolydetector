import os
import requests
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from collections import Counter

from app.models.log import Log
from app.models.anomaly import Anomaly
from app.models.metric import Metric

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "mistralai/mistral-7b-instruct")


# ==============================
# HELPERS
# ==============================
def _safe(val, default=None):
    return val if val is not None else default


def _get_top_logs(db: Session, lookback_minutes=60, limit=20):
    since = datetime.utcnow() - timedelta(minutes=lookback_minutes)

    logs = (
        db.query(Log)
        .filter(Log.timestamp >= since)
        .order_by(Log.timestamp.desc())
        .all()
    )

    # Prioritize ERROR + CRITICAL
    critical_logs = [
        l for l in logs
        if l.level and l.level.upper() in ("ERROR", "CRITICAL")
    ]

    # If not enough, fill with WARN/INFO
    if len(critical_logs) < limit:
        critical_logs += logs[:limit - len(critical_logs)]

    result = []

    for l in critical_logs[:limit]:
        result.append({
            "timestamp": str(l.timestamp),
            "endpoint": _safe(l.endpoint),
            "level": _safe(l.level),
            "message": _safe(l.message),
            "response_time": _safe(l.response_time),
            "ip": _safe(l.ip)
        })

    return result


def _get_top_anomalies(db: Session, limit=15):
    anomalies = (
        db.query(Anomaly)
        .order_by(Anomaly.timestamp.desc())
        .limit(limit)
        .all()
    )

    results = []
    for a in anomalies:
        results.append({
            "timestamp": str(a.timestamp),
            "type": a.type,
            "severity": a.severity,
            "message": a.message,
            "score": a.score
        })

    return results


def _get_top_error_endpoints(db: Session, hours=24, limit=10):
    since = datetime.utcnow() - timedelta(hours=hours)

    logs = db.query(Log).filter(Log.timestamp >= since).all()

    errors = [
        l.endpoint for l in logs
        if l.endpoint and l.level and l.level.upper() in ("ERROR", "CRITICAL")
    ]

    counter = Counter(errors)

    return [
        {"endpoint": ep, "error_count": count}
        for ep, count in counter.most_common(limit)
    ]


def _get_latest_metrics(db: Session):
    m = (
        db.query(Metric)
        .order_by(Metric.timestamp.desc())
        .first()
    )

    if not m:
        return {}

    return {
        "timestamp": str(m.timestamp),
        "total_logs": m.total_logs,
        "error_count": m.error_count,
        "avg_response_time": m.avg_response_time,
        "severity": {
            "low": m.low,
            "medium": m.medium,
            "high": m.high,
            "critical": m.critical
        }
    }


# ==============================
# OPENROUTER CALL
# ==============================
def call_openrouter(messages):
    url = "https://openrouter.ai/api/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": OPENROUTER_MODEL,
        "messages": messages,
        "temperature": 0.2
    }

    resp = requests.post(url, json=payload, headers=headers)

    try:
        data = resp.json()
    except:
        return {"error": "invalid_json", "raw": resp.text}

    if "error" in data:
        return {"error": "api_error", "raw": data}

    try:
        return data["choices"][0]["message"]["content"]
    except:
        return {"error": "missing_choices", "raw": data}


# ==============================
# MAIN RCA HANDLER
# ==============================
def run_root_cause_analysis(db: Session, testing: bool = False):

    logs = _get_top_logs(db, lookback_minutes=180, limit=20)
    anomalies = _get_top_anomalies(db, limit=15)
    endpoints = _get_top_error_endpoints(db, hours=24, limit=10)
    metrics = _get_latest_metrics(db)

    context = {
        "top_logs": logs,
        "top_anomalies": anomalies,
        "top_error_endpoints": endpoints,
        "latest_metrics": metrics
    }

    user_prompt = f"""
You are an elite SRE.

Analyze the system based ONLY on:
- top error logs
- top anomalies
- top failing endpoints
- key metrics

Return STRICT JSON ONLY in this shape:

{{
 "root_cause": "...",
 "impact": "...",
 "affected_endpoints": ["..."],
 "recommended_actions": ["...", "..."],
 "risk_level": "low|medium|high|critical",
 "confidence": 0.0 to 1.0
}}

Here is the data:

{context}
"""

    result = call_openrouter([
        {"role": "system", "content": "You are a world-class site reliability engineer."},
        {"role": "user", "content": user_prompt}
    ])

    if isinstance(result, dict) and "error" in result:
        return {"status": "failed", "error": result}

    return {
        "status": "ok",
        "rca": result,
        "context_used": context
    }