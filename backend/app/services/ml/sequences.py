# app/services/ml/sequences.py

from typing import Dict, Any, List
from sqlalchemy.orm import Session
from collections import defaultdict
from datetime import datetime, timedelta
from app.models.log import Log


# -----------------------------------------------------------
# 5.1 — Build Transition Matrix
# -----------------------------------------------------------
def build_transition_matrix(
    db: Session,
    *,
    window_hours: int = 24,
    testing: bool = False
) -> Dict[str, Dict[str, int]]:
    """
    Build a transition count matrix of endpoint sequences.
    Group by IP (session-like behavior).
    If testing=True → pull all logs.
    """

    since = datetime.utcnow() - timedelta(hours=window_hours)

    rows = (
        db.query(Log).order_by(Log.timestamp.asc()).all()
        if testing else
        db.query(Log)
            .filter(Log.timestamp >= since)
            .order_by(Log.timestamp.asc())
            .all()
    )

    # Group logs by IP (acts like a "session")
    groups = defaultdict(list)
    for r in rows:
        if r.endpoint:
            key = r.ip or "global"
            groups[key].append((r.timestamp, r.endpoint))

    # Build transition counts
    transitions = defaultdict(lambda: defaultdict(int))

    for key, events in groups.items():
        events.sort(key=lambda x: x[0])
        last = None

        for ts, endpoint in events:
            if last is not None:
                transitions[last][endpoint] += 1
            last = endpoint

    return transitions


# -----------------------------------------------------------
# 5.2 — Transition Probabilities from Counts
# -----------------------------------------------------------
def compute_transition_probabilities(
    transitions: Dict[str, Dict[str, int]]
) -> Dict[str, Dict[str, float]]:
    """
    Convert raw transition counts into probabilities.
    Example:
        A → B : 5 times
        A → C : 5 times
        => prob(A→B) = 0.5
    """

    probs = {}

    for src, dests in transitions.items():
        total = sum(dests.values())
        if total == 0:
            probs[src] = {}
            continue
        probs[src] = {
            dst: count / total
            for dst, count in dests.items()
        }

    return probs


# -----------------------------------------------------------
# 5.3 — Sequence Anomaly Detection (Markov-chain style)
# -----------------------------------------------------------
def detect_sequence_anomalies(
    db: Session,
    *,
    window_hours: int = 24,
    threshold: float = 0.05,
    testing: bool = False
) -> List[Dict[str, Any]]:
    """
    Detect anomalous transitions using Markov probabilities.
    Uses SAME log window as transition matrix.
    """

    # 1. Build probability map
    transition_counts = build_transition_matrix(
        db, window_hours=window_hours, testing=testing
    )
    probs = compute_transition_probabilities(transition_counts)

    # 2. Use SAME logs as transition window (Fix!)
    since = datetime.utcnow() - timedelta(hours=window_hours)

    recent_logs = (
        db.query(Log).order_by(Log.timestamp.asc()).all()
        if testing else
        db.query(Log)
            .filter(Log.timestamp >= since)
            .order_by(Log.timestamp.asc())
            .all()
    )

    anomalies = []
    last = None

    for r in recent_logs:
        if not r.endpoint:
            continue

        if last is not None:
            p = probs.get(last, {}).get(r.endpoint, 0.0)

            if p < threshold:
                anomalies.append({
                    "timestamp": r.timestamp,
                    "from": last,
                    "to": r.endpoint,
                    "probability": round(p, 6),
                    "log_id": r.id,
                    "message": f"Rare transition detected: {last} → {r.endpoint}"
                })

        last = r.endpoint

    return anomalies
