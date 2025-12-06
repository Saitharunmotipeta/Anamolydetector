from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.config import get_db

# Module imports
from app.services.model import run_detection, run_error_spike_detection
from app.services.security import run_all_security_checks
from app.services.ml.clustering import run_semantic_clustering
from app.services.ml.sequences import detect_sequence_anomalies
from app.services.ml.forecast import predict_error_trend
from app.services.db_service import get_anomalies
from app.services.ai.rca import run_root_cause_analysis


router = APIRouter(prefix="/anomalies", tags=["Anomalies"])


# ---------------------------
# GET ALL ANOMALIES
# ---------------------------
@router.get("/")
def list_anomalies(db: Session = Depends(get_db)):
    return get_anomalies(db)


# ---------------------------
# MODULE 1 - Statistical Detection
# ---------------------------
@router.post("/run")
def trigger_detection(db: Session = Depends(get_db)):
    res = run_detection(db)
    return {"status": "ok", "detected": len(res), "items": res}


# ---------------------------
# MODULE 2 - Error Spike Detection
# ---------------------------
@router.post("/error-spike")
def trigger_error_spike(testing: bool = False, db: Session = Depends(get_db)):
    res = run_error_spike_detection(db, testing=testing)
    return {"status": "ok", "detected": len(res), "items": res}


# ---------------------------
# MODULE 3 - Security Checks
# ---------------------------
@router.post("/security")
def run_security_detection(testing: bool = False, db: Session = Depends(get_db)):
    res = run_all_security_checks(db, testing=testing)
    total = sum(len(v) for v in res.values())
    return {"status": "ok", "total_detected": total, "details": res}


# ---------------------------
# MODULE 4 - Semantic Clustering (DBSCAN + KMeans fallback)
# ---------------------------
@router.post("/semantic-clusters")
def semantic_clusters(
    testing: bool = False,
    eps: float = 0.6,
    min_samples: int = 4,
    db: Session = Depends(get_db)
):
    res = run_semantic_clustering(db, eps=eps, min_samples=min_samples, testing=testing)
    return {"status": "ok", "data": res}


@router.post("/outliers")
def semantic_outliers(
    testing: bool = False,
    eps: float = 0.6,
    min_samples: int = 4,
    db: Session = Depends(get_db)
):
    res = run_semantic_clustering(db, eps=eps, min_samples=min_samples, testing=testing)
    return {
        "status": "ok",
        "outliers": res.get("outliers", []),
        "meta": res.get("meta", {})
    }


# ---------------------------
# MODULE 5 - Sequence-Based ML Anomaly Detection
# ---------------------------
@router.post("/sequence-ml")
def sequence_ml(
    threshold: float = 0.05,
    window_hours: int = 24,
    testing: bool = False,
    db: Session = Depends(get_db)
):
    res = detect_sequence_anomalies(
        db,
        window_hours=window_hours,
        threshold=threshold,
        testing=testing
    )
    return {"status": "ok", "items": res}


# ---------------------------
# MODULE 5.5 - Time-Series Forecasting (ARIMA)
# ---------------------------
@router.post("/predict")
def predict_errors(
    minutes_back: int = 60,
    predict_minutes: int = 60,
    testing: bool = True,
    db: Session = Depends(get_db)
):
    res = predict_error_trend(
        db,
        minutes_back=minutes_back,
        predict_minutes=predict_minutes,
        testing=testing
    )
    return {"status": "ok", **res}


# ---------------------------
# MODULE 6 - Root Cause Analysis (OpenRouter LLM)
# ---------------------------
@router.post("/rca")
def run_rca(testing: bool = False, db: Session = Depends(get_db)):
    result = run_root_cause_analysis(db)
    return {"status": "ok", "result": result}
