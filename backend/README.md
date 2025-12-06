Log Analyzer — Fullstack Project

This repo contains backend (FastAPI) and frontend (React) for an Anomaly Detection + Log Analyzer.

Start with backend:
1. cd backend
2. create .env with DATABASE_URL (postgresql://postgres:postgres@localhost:5432/loganalyzer)
3. pip install -r requirements.txt
4. uvicorn app.main:app --reload

Use docker-compose to spin DB + backend.

TRUNCATE TABLE logs RESTART IDENTITY CASCADE;
TRUNCATE TABLE anomalies RESTART IDENTITY CASCADE;
TRUNCATE TABLE metrics RESTART IDENTITY CASCADE;