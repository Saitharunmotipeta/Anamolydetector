from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.config import get_db
from app.services.ai.rca import run_root_cause_analysis

router = APIRouter(prefix="/rca", tags=["AI Root Cause"])

@router.get("/")
def generate_rca(db: Session = Depends(get_db)):
    result = run_root_cause_analysis(db)
    return {"status": "ok", "analysis": result}
