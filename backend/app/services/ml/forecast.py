# app/services/ml/forecast.py

from typing import Dict, Any, List
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.log import Log
import numpy as np
from sklearn.linear_model import LinearRegression
from collections import defaultdict


def _errors_per_minute(db: Session, minutes: int = 60, testing: bool = False):
    """
    Extract error counts per minute + compute rolling averages to avoid flat 0 vectors.
    """
    since = datetime.utcnow() - timedelta(minutes=minutes)
    rows = (
        db.query(Log).filter(Log.timestamp >= since).all()
        if not testing else db.query(Log).all()
    )

    counts = defaultdict(int)
    for r in rows:
        if r.level and r.level.upper() in ("ERROR", "CRITICAL"):
            minute = int(r.timestamp.replace(second=0, microsecond=0).timestamp() // 60)
            counts[minute] += 1

    # Fill missing minutes with 0 → required for rolling
    if counts:
        min_ts = min(counts.keys())
        max_ts = max(counts.keys())
        for m in range(min_ts, max_ts + 1):
            counts[m] = counts.get(m, 0)

    items = sorted(counts.items())
    if not items:
        return [], [], []

    # Rolling average to avoid flat zeros
    window = 5
    smoothed = []
    for i in range(len(items)):
        window_slice = items[max(0, i - window + 1): i + 1]
        avg = sum(c for _, c in window_slice) / len(window_slice)
        smoothed.append((items[i][0], avg))

    xs = np.array([m for m, _ in smoothed]).reshape(-1, 1)
    ys = np.array([v for _, v in smoothed])

    return xs, ys, smoothed


def predict_error_trend(db: Session, minutes_back: int = 60, predict_minutes: int = 60, testing: bool = False):
    """
    Predict future error trend using LR + rolling average smoothing.
    """
    xs, ys, items = _errors_per_minute(db, minutes=minutes_back, testing=testing)

    if len(xs) < 3:
        return {"ok": False, "reason": "not_enough_data", "timeline": []}

    model = LinearRegression()
    model.fit(xs, ys)

    last_minute = items[-1][0]
    future = np.array([last_minute + i for i in range(1, predict_minutes + 1)]).reshape(-1, 1)

    preds = model.predict(future)

    # Never collapse to exact 0
    preds = [max(0.05, float(round(p, 3))) for p in preds]

    timeline = []
    for i, p in enumerate(preds, 1):
        ts = datetime.utcfromtimestamp((last_minute + i) * 60)
        timeline.append({
            "timestamp": ts,
            "predicted_error_count": p
        })

    return {
        "ok": True,
        "model": "linear_regression_with_rolling_avg",
        "timeline": timeline
    }
