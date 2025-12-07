Log Analyzer — Fullstack Project

This repo contains backend (FastAPI) and frontend (React) for an Anomaly Detection + Log Analyzer.

Log Analyzer – Execution & Usage Guide

Clone the repository

          -git clone <your-repo-url>
          -cd log-analyzer

Install all dependencies

          -pip install -r requirements.txt

Create .env file inside backend folder

          -DATABASE_URL=postgresql://postgres:password@localhost:5432/loganalyzer
          -OPENROUTER_API_KEY=your_openrouter_api_key

Generate realistic dataset (2000+ logs)

          -cd data/raw
          -python generate_logs.py

Start the FastAPI server

          -uvicorn app.main:app --reload

Server runs at

          -http://127.0.0.1:8000

Open Swagger UI at

          -http://127.0.0.1:8000/docs

TRUNCATE TABLE logs RESTART IDENTITY CASCADE;

TRUNCATE TABLE anomalies RESTART IDENTITY CASCADE;

TRUNCATE TABLE metrics RESTART IDENTITY CASCADE;
