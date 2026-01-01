<<<<<<< HEAD
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
=======
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, BackgroundTasks
>>>>>>> f58c6c11b8e6116f90a1fbd213462af7722cd660
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.config import get_db
from app.services.parser import parse_log_file
from app.services.db_service import save_parsed_logs

<<<<<<< HEAD
router = APIRouter(prefix="/logs", tags=["Logs"])


@router.post("/upload")
async def upload_logs(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    print("🔥 logs.py loaded")
    print("📄 RECEIVED FILE:", file.filename)

=======
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
>>>>>>> f58c6c11b8e6116f90a1fbd213462af7722cd660
    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

    content = await file.read()
<<<<<<< HEAD

    if not content:
        raise HTTPException(status_code=400, detail="Empty file")

    text = content.decode("utf-8", errors="ignore")

    parsed = parse_log_file(text)

=======
    if not content:
        raise HTTPException(status_code=400, detail="Empty file")

    parsed = parse_log_file(content.decode("utf-8", errors="ignore"))
>>>>>>> f58c6c11b8e6116f90a1fbd213462af7722cd660
    if not parsed:
        raise HTTPException(
            status_code=400,
            detail="File parsed but no valid log lines found"
        )

<<<<<<< HEAD
    saved_ids = save_parsed_logs(db, parsed)

    return {
        "status": "ok",
        "saved": len(saved_ids),
        "uploaded_at": datetime.utcnow().isoformat()
    }


@router.get("/parsed")
def get_parsed(limit: int = 100, db: Session = Depends(get_db)):
    from app.services.db_service import get_parsed_logs
    return get_parsed_logs(db, limit=limit)
=======
    save_parsed_logs(db, parsed)

    # ✅ RUN PIPELINE AS BACKGROUND TASK
    background_tasks.add_task(run_pipeline, db)

    return {
        "status": "uploaded",
        "saved": len(parsed),
        "message": "Logs uploaded. Analysis in progress.",
        "uploaded_at": datetime.utcnow().isoformat()
    }
>>>>>>> f58c6c11b8e6116f90a1fbd213462af7722cd660
