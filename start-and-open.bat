@echo off
title SmartStock - Starting Application

echo SmartStock - Starting Application
echo =============================

REM Check if services are already running
netstat -an | findstr :5173 >nul
if %errorlevel% == 0 (
    echo Frontend is already running. Opening browser...
    start http://localhost:5173
    exit /b
)

REM Start MongoDB
echo Starting MongoDB...
if not exist "C:\data\db" (
    echo Creating MongoDB data directory...
    mkdir "C:\data\db"
)
start "MongoDB" /min cmd /c "mongod --dbpath C:\data\db"

REM Wait for MongoDB to start
echo Waiting for MongoDB to start...
timeout /t 5 /nobreak >nul

REM Start Backend
echo Starting Backend Server...
start "Backend Server" cmd /c "cd backend && npm run dev"

REM Wait for Backend to start
echo Waiting for Backend to start...
timeout /t 5 /nobreak >nul

REM Start Frontend
echo Starting Frontend Server...
start "Frontend Server" cmd /c "cd frontend && npm run dev"

REM Wait for Frontend to start
echo Waiting for Frontend to start...
timeout /t 10 /nobreak >nul

REM Open browser
echo Opening SmartStock in your browser...
start http://localhost:5173

echo.
echo SmartStock is now running!
echo =======================
echo URLs:
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:8004
echo MongoDB: mongodb://localhost:27017
echo.
echo To stop all services, run stop-all.bat
echo Press any key to continue...
pause >nul