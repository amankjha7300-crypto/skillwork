@echo off
title SkillWork Platform Launcher
echo ===================================================
echo Starting SkillWork Automated Allocation Platform...
echo ===================================================
echo.

cd /d "%~dp0"
set "PATH=C:\Users\Aman Kumar\.nodejs\node-v20.18.0-win-x64;%PATH%"
set "NEXT_TELEMETRY_DISABLED=1"

echo [1/2] Starting FastAPI Backend on port 8000...
start "SkillWork Backend API" cmd /k "cd /d ""%~dp0backend"" && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Next.js Frontend on port 3000...
start "SkillWork Frontend" cmd /k "cd /d ""%~dp0frontend"" && set PATH=C:\Users\Aman Kumar\.nodejs\node-v20.18.0-win-x64;%PATH% && set NEXT_TELEMETRY_DISABLED=1 && npm run dev"

timeout /t 5 /nobreak >nul

echo Opening browser at http://localhost:3000 ...
start http://localhost:3000

echo.
echo ===================================================
echo SkillWork is running!
echo - Web App: http://localhost:3000
echo - API Docs: http://localhost:8000/docs
echo ===================================================
pause
