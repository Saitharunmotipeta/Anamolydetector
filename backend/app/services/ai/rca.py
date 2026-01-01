import os
import json
import requests
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from collections import Counter
from sqlalchemy import desc

from app.models.log import Log
from app.models.anomaly import Anomaly
from app.models.metric import Metric

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "mistralai/mistral-7b-instruct")

MAX_LOGS = 200
MAX_ANOMALIES = 20
MAX_ENDPOINTS = 10


def _safe(v, default=None):
    return v if v is not None else default


# ==============================
# DATA COLLECTORS (TOP ONLY)
# ==============================
def _get_top_logs(db: Session, lookback_minutes=180, limit=MAX_LOGS):
    since = datetime.utcnow() - timedelta(minutes=lookback_minutes)

    logs = (
        db.query(Log)
        .filter(Log.timestamp >= since)
        .order_by(desc(Log.timestamp))
        .all()
    )

    errors = [
        l for l in logs
        if l.level and l.level.upper() in ("ERROR", "CRITICAL")
    ]

    non_errors = [l for l in logs if l not in errors]

    selected = (errors + non_errors)[:limit]

    return [
        {
            "timestamp": str(l.timestamp),
            "endpoint": _safe(l.endpoint),
            "level": _safe(l.level),
            "message": _safe(l.message),
            "response_time": _safe(l.response_time),
            "ip": _safe(l.ip),
        }
        for l in selected
    ]


def _get_top_anomalies(db: Session, limit=MAX_ANOMALIES):
    anomalies = (
        db.query(Anomaly)
        .order_by(desc(Anomaly.severity), desc(Anomaly.timestamp))
        .limit(limit)
        .all()
    )

    return [
        {
            "timestamp": str(a.timestamp),
            "type": a.type,
            "severity": a.severity,
            "message": a.message,
            "score": a.score,
        }
        for a in anomalies
    ]


def _get_top_error_endpoints(db: Session, hours=24, limit=MAX_ENDPOINTS):
    since = datetime.utcnow() - timedelta(hours=hours)

    logs = (
        db.query(Log)
        .filter(Log.timestamp >= since)
        .filter(Log.level.in_(["ERROR", "CRITICAL"]))
        .filter(Log.endpoint.isnot(None))
        .all()
    )

    counter = Counter([l.endpoint for l in logs])

    return [
        {"endpoint": ep, "error_count": count}
        for ep, count in counter.most_common(limit)
    ]


def _get_latest_metrics(db: Session):
    m = db.query(Metric).order_by(desc(Metric.timestamp)).first()

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
            "critical": m.critical,
        },
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
        "temperature": 0.1,
        "max_tokens": 800
    }

    resp = requests.post(url, json=payload, headers=headers)

    try:
        data = resp.json()
    except:
        return {"error": "invalid_json", "raw": resp.text}

    if "error" in data:
        return {"error": "api_error", "raw": data}

    return data.get("choices", [{}])[0].get("message", {}).get("content")


# ==============================
# RCA MAIN
# ==============================
def run_root_cause_analysis(db: Session, testing: bool = False):

    logs = _get_top_logs(db)
    anomalies = _get_top_anomalies(db)
    endpoints = _get_top_error_endpoints(db)
    metrics = _get_latest_metrics(db)

    context = {
        "top_logs": logs,
        "top_anomalies": anomalies,
        "top_error_endpoints": endpoints,
        "latest_metrics": metrics,
    }

    # ----------- Compact + cheaper token prompt -----------
    user_prompt = f"""
You are a world-class Site Reliability Engineer.

Analyze ONLY the following:

{json.dumps(context)}

Return STRICT JSON ONLY. NO TEXT. NO MARKDOWN.
ALWAYS follow this format:

{{
 "root_cause": "...",
 "impact": "...",
 "affected_endpoints": ["..."],
 "recommended_actions": ["..."],
 "risk_level": "low|medium|high|critical",
 "confidence": 0.0
}}
"""

    result = call_openrouter([
        {"role": "system", "content": "Return JSON only. Never add commentary."},
        {"role": "user", "content": user_prompt},
    ])

    # ======================
    # HARD JSON PARSE
    # ======================
    try:
        parsed = json.loads(result)
    except Exception:
        return {
            "status": "failed_parse",
            "raw": result,
            "context_used": context
        }

    # ======================
    # VALIDATE REQUIRED FIELDS
    # ======================
    required = [
        "root_cause",
        "impact",
        "affected_endpoints",
        "recommended_actions",
        "risk_level",
        "confidence",
    ]

    if not all(k in parsed for k in required):
        return {
            "status": "invalid_shape",
            "rca": parsed,
            "context_used": context
        }

    return {
        "status": "ok",
        "rca": parsed,
        "context_used": context,
    }
