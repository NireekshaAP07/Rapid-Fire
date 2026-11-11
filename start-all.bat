@echo off
title RapidFire Launcher
echo ====================================================
echo Starting RapidFire AI Platform
echo ====================================================
echo.
echo [1/2] Starting Backend (FastAPI on Port 8000)...
start "RapidFire Backend" cmd /k "cd /d %~dp0backend && .\venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo [2/2] Starting Frontend (Vite on Port 5173)...
start "RapidFire Frontend" cmd /k "cd /d %~dp0 && npm.cmd run dev -- --host 0.0.0.0 --port 5173"

echo.
echo Both servers are launching in separate windows!
echo - Frontend: http://localhost:5173
echo - Backend Docs: http://localhost:8000/docs
echo ====================================================
pause
