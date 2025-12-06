from typing import Generator
import os
from dotenv import load_dotenv
from app.core.database import SessionLocal

load_dotenv()

def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class Settings:
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    RCA_PROMPT: str = os.getenv("RCA_PROMPT", "")

settings = Settings()
