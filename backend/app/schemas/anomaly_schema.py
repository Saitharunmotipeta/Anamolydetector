from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AnomalySchema(BaseModel):
    id: Optional[int]
    timestamp: Optional[datetime]
    type: Optional[str]
    score: Optional[float]
    severity: Optional[str]
    message: Optional[str]
    log_id: Optional[int]

    class Config:
        orm_mode = True
