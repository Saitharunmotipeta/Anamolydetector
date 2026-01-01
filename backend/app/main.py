from dotenv import load_dotenv
import os

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import logs, anomalies, metrics
from app.core.database import engine, Base

app = FastAPI(title="Log Analyzer API")

# ✅ CORS MUST COME FIRST
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ THEN include routers
app.include_router(logs.router)
app.include_router(anomalies.router)
app.include_router(metrics.router)

@app.get("/")
def root():
    return {"message": "Log Analyzer Backend is running 🚀"}

# create DB tables
Base.metadata.create_all(bind=engine)
from dotenv import load_dotenv
import os

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import logs, anomalies, metrics
from app.core.database import engine, Base

app = FastAPI(title="Log Analyzer API")

# ✅ CORS MUST COME FIRST
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ THEN include routers
app.include_router(logs.router)
app.include_router(anomalies.router)
app.include_router(metrics.router)

@app.get("/")
def root():
    return {"message": "Log Analyzer Backend is running 🚀"}

# create DB tables
Base.metadata.create_all(bind=engine)
