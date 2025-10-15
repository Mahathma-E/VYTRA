@echo off
echo Starting SmartStock Development Environment with MongoDB
echo ======================================================

REM Check if MongoDB is installed
mongod --version >nul 2>&1
if %errorlevel% == 0 (
    echo MongoDB is already installed
) else (
    echo MongoDB is not installed. Please install MongoDB Community Server from:
    echo https://www.mongodb.com/try/download/community
    echo.
    echo After installation, create a data directory:
    echo mkdir C:\data\db
    echo.
    echo Then start MongoDB with:
    echo mongod --dbpath C:\data\db
    echo.
    echo Press any key to continue anyway...
    pause >nul
)

REM Start MongoDB in the background (if installed)
echo Starting MongoDB...
start "MongoDB" cmd /c "mongod --dbpath C:\data\db || echo MongoDB failed to start. Make sure it's installed and the data directory exists."

REM Wait a few seconds for MongoDB to start
timeout /t 5 /nobreak >nul

REM Start backend
echo Starting Backend...
start "Backend" cmd /c "cd backend && npm run dev"

REM Start frontend
echo Starting Frontend...
start "Frontend" cmd /c "cd frontend && npm run dev"

echo.
echo SmartStock Development Environment is starting up...
echo Frontend will be available at: http://localhost:5173
echo Backend will be available at: http://localhost:8004
echo MongoDB should be running on port 27017
echo.
echo To stop all services, close all the command windows that were opened.
echo.

REM Keep this window open
cmd /k