@echo off
title SmartStock - Service Status

echo SmartStock Service Status
echo ======================

echo Checking MongoDB...
netstat -an | findstr :27017 >nul
if %errorlevel% == 0 (
    echo [RUNNING] MongoDB is running on port 27017
) else (
    echo [STOPPED] MongoDB is not running
)

echo Checking Backend Server...
netstat -an | findstr :8004 >nul
if %errorlevel% == 0 (
    echo [RUNNING] Backend Server is running on port 8004
) else (
    echo [STOPPED] Backend Server is not running
)

echo Checking Frontend Server...
netstat -an | findstr :5173 >nul
if %errorlevel% == 0 (
    echo [RUNNING] Frontend Server is running on port 5173
) else (
    echo [STOPPED] Frontend Server is not running
)

echo.
echo Application URLs:
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:8004
echo MongoDB: mongodb://localhost:27017

echo.
echo To start all services, run:
echo - get-started.bat (recommended)
echo - start-with-mongodb.bat
echo - start-with-docker.bat (if using Docker)

pause