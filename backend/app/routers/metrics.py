from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.config import get_db
from app.services.metrics import (
    aggregate_metrics,
    get_top_errors,
    top_anomaly_endpoints,
    slowest_endpoints,
    downtime_indicators,
    error_trend_summary
)

router = APIRouter(prefix="/metrics", tags=["Metrics"])


@router.get("/daily")
def daily_metrics(db: Session = Depends(get_db)):
    return aggregate_metrics(db)


@router.get("/top-errors")
def top_errors(db: Session = Depends(get_db)):
    from app.services.metrics import get_top_errors
    return get_top_errors(db)



@router.get("/top-anomalies")
def get_top_anomalies(db: Session = Depends(get_db)):
    return top_anomaly_endpoints(db)


@router.get("/slowest")
def get_slowest(db: Session = Depends(get_db)):
    return slowest_endpoints(db)


@router.get("/downtime")
def get_downtime(db: Session = Depends(get_db)):
    return downtime_indicators(db)


@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    return error_trend_summary(db)
