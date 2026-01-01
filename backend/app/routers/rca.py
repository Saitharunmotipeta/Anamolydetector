from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import json

from app.core.config import get_db
from app.services.ai.rca import run_root_cause_analysis
from app.models.rca import RCAResult

router = APIRouter(prefix="/rca", tags=["AI Root Cause"])


# =========================
# 1️⃣ GET LAST RCA
# =========================
@router.get("/latest")
def get_latest_rca(db: Session = Depends(get_db)):
    rca = (
        db.query(RCAResult)
        .order_by(RCAResult.created_at.desc())
        .first()
    )

    if not rca:
        return {"available": False}

    return {
        "available": True,
        "generated_at": rca.created_at.isoformat(),
        "rca": {
            "root_cause": rca.root_cause,
            "impact": rca.impact,
            "affected_endpoints": json.loads(rca.affected_endpoints or "[]"),
            "recommended_actions": json.loads(rca.recommended_actions or "[]"),
            "risk_level": rca.risk_level,
            "confidence": rca.confidence,
        },
        "context_used": json.loads(rca.context_used or "{}")
    }


# =========================
# 2️⃣ GENERATE NEW RCA
# =========================
@router.post("/generate")
def generate_rca(db: Session = Depends(get_db)):
    result = run_root_cause_analysis(db, testing=False)

    if not result:
        raise HTTPException(status_code=500, detail="RCA engine failed")

    # --- HARD FAIL IF AI RETURN INVALID ---
    if result.get("status") not in ("ok", None):
        raise HTTPException(
            status_code=500,
            detail=f"RCA failed: {result.get('status')}"
        )

    rca = result.get("rca")

    if not isinstance(rca, dict):
        raise HTTPException(status_code=500, detail="AI did not return JSON")

    required = [
        "root_cause",
        "impact",
        "affected_endpoints",
        "recommended_actions",
        "risk_level",
        "confidence"
    ]

    if not all(k in rca for k in required):
        raise HTTPException(status_code=500, detail="Malformed RCA JSON")

    record = RCAResult(
        root_cause=rca["root_cause"],
        impact=rca["impact"],
        affected_endpoints=json.dumps(rca["affected_endpoints"]),
        recommended_actions=json.dumps(rca["recommended_actions"]),
        risk_level=rca["risk_level"],
        confidence=float(rca["confidence"]),
        context_used=json.dumps(result.get("context_used", {})),
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "status": "ok",
        "generated_at": record.created_at.isoformat(),
        "rca": rca,
        "context_used": result.get("context_used", {})
    }

