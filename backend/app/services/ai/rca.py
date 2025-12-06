import os
import requests
from sqlalchemy.orm import Session
from app.models.log import Log
from app.models.anomaly import Anomaly
from app.models.metric import Metric
from datetime import datetime, timedelta

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "mistralai/mistral-7b-instruct")


def _metric_to_dict(m: Metric):
    return {
        "timestamp": str(m.timestamp),
        "total_logs": m.total_logs,
        "error_count": m.error_count,
        "avg_response_time": m.avg_response_time,
        "low": m.low,
        "medium": m.medium,
        "high": m.high,
        "critical": m.critical,
    }


def _format_context(db: Session):
    if testing:
        logs = db.query(Log).order_by(Log.timestamp.asc()).all()
    else:
        logs = db.query(Log).filter(Log.timestamp >= since).all()

    anomalies = db.query(Anomaly).order_by(Anomaly.timestamp.desc()).limit(50).all()
    metric = db.query(Metric).order_by(Metric.timestamp.desc()).first()

    ctx_logs = "\n".join(
        f"[{l.timestamp}] {l.level} {l.endpoint} - {l.message}"
        for l in logs
    )

    ctx_anomalies = "\n".join(
        f"[{a.timestamp}] {a.type} ({a.severity}) - {a.message}"
        for a in anomalies
    )

    ctx_metric = _metric_to_dict(metric) if metric else {}

    return f"""
### LOGS
{ctx_logs}

### ANOMALIES
{ctx_anomalies}

### METRICS
{ctx_metric}
"""


def call_openrouter(prompt: str):
    url = "https://openrouter.ai/api/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    data = {
        "model": OPENROUTER_MODEL,
        "messages": [
            {"role": "system", "content": "You are an expert SRE and observability engineer."},
            {"role": "user", "content": prompt}
        ],
    }

    resp = requests.post(url, json=data, headers=headers)

    try:
        result = resp.json()
    except:
        return {"error": "Invalid JSON response", "raw": resp.text}

    if "error" in result:
        return {"error": "OpenRouter returned an error", "raw": result}

    try:
        return result["choices"][0]["message"]["content"]
    except Exception:
        return {"error": "Missing 'choices' key", "raw": result}


def run_root_cause_analysis(db: Session):
    context = _format_context(db)

    # DO NOT USE f-string because JSON braces break formatting
    prompt = """
You are an advanced SRE / Observability Engineer.
Analyze the system health based on logs, anomalies, and metrics.

### TASKS
1. Identify the most likely root cause.
2. Explain why it happened.
3. Describe which endpoints/users are affected.
4. Provide recommended remediation steps.
5. Include a confidence score (0–1).
6. Keep the response under 250 words.

### DATA
{context}

Return a JSON-like structure EXACTLY like this:

{{
  "root_cause": "...",
  "impact": "...",
  "affected_endpoints": ["..."],
  "recommendations": ["..."],
  "confidence": 0.8
}}
""".format(context=context)

    # first attempt
    result = call_openrouter(prompt)

    if isinstance(result, dict) and "error" in result:
        return result

    # retry if blank
    if not result or str(result).strip() == "":
        retry_prompt = prompt + "\nSTRICT MODE: Provide meaningful analysis even if data is limited."
        result_retry = call_openrouter(retry_prompt)

        if not result_retry or str(result_retry).strip() == "":
            return {
                "error": "LLM returned empty output twice",
                "note": "Try using claude-3.5-haiku or reduce context size."
            }

        return {"analysis": result_retry}

    return {"analysis": result}


