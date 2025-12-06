from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class LogSchema(BaseModel):
    id: Optional[int]
    timestamp: Optional[datetime]
    level: Optional[str]
    message: Optional[str]
    endpoint: Optional[str]
    response_time: Optional[float]
    ip: Optional[str]

    class Config:
        orm_mode = True
