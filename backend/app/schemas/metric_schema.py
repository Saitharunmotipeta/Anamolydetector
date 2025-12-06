from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MetricSchema(BaseModel):
    id: Optional[int]
    timestamp: Optional[datetime]
    error_count: Optional[int]
    avg_response_time: Optional[float]
    total_logs: Optional[int]

    class Config:
        orm_mode = True
