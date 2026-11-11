@echo off
title RapidFire Backend
cd /d "%~dp0backend"
echo Starting FastAPI Backend on http://localhost:8000 ...
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
