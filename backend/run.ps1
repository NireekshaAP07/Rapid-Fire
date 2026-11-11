Set-Location -Path $PSScriptRoot
Write-Host "Starting RapidFire FastAPI Backend on http://localhost:8000 ..." -ForegroundColor Cyan
& ".\venv\Scripts\python.exe" -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
