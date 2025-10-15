@echo off
title SmartStock Development Environment

echo Starting SmartStock Development Environment with MongoDB
echo ======================================================

REM Create data directory if it doesn't exist
if not exist "C:\data\db" (
    echo Creating MongoDB data directory...
    mkdir "C:\data\db"
)

REM Start MongoDB
echo Starting MongoDB...
start "MongoDB" /min cmd /c "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe --dbpath C:\data\db 2>&1 | findstr /v /c:"NETWORK" | findstr /v /c:"CONTROL" | findstr /v /c:"ACCESS" | findstr /v /c:"COMMAND" || echo MongoDB may not be installed. Please run install-mongodb.bat first."

REM Wait for MongoDB to start
echo Waiting for MongoDB to start...
timeout /t 5 /nobreak >nul

REM Start Backend
echo Starting Backend Server...
start "Backend Server" cmd /c "cd backend && npm run dev"

REM Start Frontend
echo Starting Frontend Server...
start "Frontend Server" cmd /c "cd frontend && npm run dev"

echo.
echo SmartStock Development Environment Startup Complete!
echo ==================================================
echo Services started:
echo 1. MongoDB (if installed) - Port: 27017
echo 2. Backend Server - Port: 8004
echo 3. Frontend Server - Port: 5173
echo.
echo Access your application at: http://localhost:5173
echo Backend API available at: http://localhost:8004
echo.
echo To stop all services, close all the command windows that were opened.
echo Press any key to continue...
pause >nul