from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.config import get_db
from app.services.parser import parse_log_file
from app.services.db_service import save_parsed_logs

router = APIRouter(prefix="/logs", tags=["Logs"])

@router.post("/upload")
async def upload_logs(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # basic validation
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

    content = await file.read()
    text = content.decode("utf-8", errors="ignore")
    parsed = parse_log_file(text)
    saved = save_parsed_logs(db, parsed)
    return {"status": "ok", "saved": len(saved)}

@router.get("/parsed")
def get_parsed_logs(limit: int = 100, db: Session = Depends(get_db)):
    from app.services.db_service import get_parsed_logs
    return get_parsed_logs(db, limit=limit)
