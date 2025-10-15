@echo off
title SmartStock Development Environment with Docker

echo Starting SmartStock Development Environment with Docker
echo =====================================================

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% == 0 (
    echo Docker is installed
) else (
    echo Docker is not installed. Please install Docker Desktop from:
    echo https://www.docker.com/products/docker-desktop
    echo.
    echo After installation, restart your computer and run this script again.
    echo.
    pause
    exit /b
)

REM Start all services with Docker Compose
echo Starting all services with Docker Compose...
docker-compose up

echo.
echo SmartStock Development Environment has been stopped.
echo To start again, run this script.
pause