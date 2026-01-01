from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.config import get_db
from app.services.parser import parse_log_file
from app.services.db_service import save_parsed_logs

# 🔥 IMPORT PIPELINE
from app.services.model import run_detection
from app.services.metrics import aggregate_metrics
from app.services.ml.forecast import predict_error_trend

router = APIRouter(prefix="/logs", tags=["Logs"])


def run_pipeline(db: Session):
    """
    Heavy processing runs AFTER response
    """
    run_detection(db)
    aggregate_metrics(db)
    predict_error_trend(db, testing=False)


@router.post("/upload")
async def upload_logs(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty file")

    parsed = parse_log_file(content.decode("utf-8", errors="ignore"))
    if not parsed:
        raise HTTPException(
            status_code=400,
            detail="File parsed but no valid log lines found"
        )

    save_parsed_logs(db, parsed)

    # ✅ RUN PIPELINE AS BACKGROUND TASK
    background_tasks.add_task(run_pipeline, db)

    return {
        "status": "uploaded",
        "saved": len(parsed),
        "message": "Logs uploaded. Analysis in progress.",
        "uploaded_at": datetime.utcnow().isoformat()
    }
