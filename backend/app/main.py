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
