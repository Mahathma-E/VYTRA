@echo off
title SmartStock - Get Started

echo Welcome to SmartStock - Real-Time Inventory Intelligence
echo ======================================================

echo.
echo This script will help you get started with SmartStock.
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo Node.js is installed: 
    node --version
) else (
    echo Node.js is not installed. Please install Node.js from https://nodejs.org/
    echo After installation, restart your computer and run this script again.
    pause
    exit /b
)

REM Check if MongoDB is installed
mongod --version >nul 2>&1
if %errorlevel% == 0 (
    echo MongoDB is installed
) else (
    echo MongoDB is not installed
    echo.
    echo Would you like to:
    echo 1. Install MongoDB manually (recommended for beginners)
    echo 2. Use Docker instead (requires Docker Desktop)
    echo.
    echo Press 1 or 2:
    choice /c 12 /n
    if errorlevel 2 (
        echo You selected Docker. Checking if Docker is installed...
        docker --version >nul 2>&1
        if %errorlevel% == 0 (
            echo Docker is installed. Starting with Docker...
            call start-with-docker.bat
            exit /b
        ) else (
            echo Docker is not installed. Please install Docker Desktop from https://www.docker.com/products/docker-desktop
            echo After installation, restart your computer and run this script again.
            pause
            exit /b
        )
    )
    if errorlevel 1 (
        echo You selected manual MongoDB installation.
        echo Running MongoDB installation helper...
        call install-mongodb.bat
    )
)

echo.
echo Installing dependencies...
echo ========================

echo Installing backend dependencies...
cd backend
npm install
cd ..

echo Installing frontend dependencies...
cd frontend
npm install
cd ..

echo.
echo Creating data directory if needed...
if not exist "C:\data\db" (
    echo Creating MongoDB data directory...
    mkdir "C:\data\db"
)

echo.
echo Starting SmartStock...
echo ===================

echo Starting MongoDB...
start "MongoDB" /min cmd /c "mongod --dbpath C:\data\db"

echo Waiting for MongoDB to start...
timeout /t 5 /nobreak >nul

echo Starting Backend...
start "Backend" cmd /c "cd backend && npm run dev"

echo Starting Frontend...
start "Frontend" cmd /c "cd frontend && npm run dev"

echo.
echo SmartStock is starting up!
echo =========================
echo Services:
echo 1. MongoDB - Port: 27017
echo 2. Backend - Port: 8004
echo 3. Frontend - Port: 5173
echo.
echo Access your application at: http://localhost:5173
echo Backend API available at: http://localhost:8004
echo.
echo To stop all services, close all the command windows that were opened.
echo You can also run stop-all.bat to stop all services.
echo.
echo Press any key to continue...
pause >nul