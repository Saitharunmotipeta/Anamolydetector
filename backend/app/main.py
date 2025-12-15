from dotenv import load_dotenv
import os

load_dotenv()  # force load .env BEFORE anything else

from fastapi import FastAPI
from app.routers import logs, anomalies, metrics
from app.core.database import engine, Base

app = FastAPI(title="Log Analyzer API")

# include routers
app.include_router(logs.router)
app.include_router(anomalies.router)
app.include_router(metrics.router)

@app.get("/")
def root():
    return {"message": "Log Analyzer Backend is running 🚀"}

# create DB tables
Base.metadata.create_all(bind=engine)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

