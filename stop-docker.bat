@echo off
echo Stopping SmartStock Docker Services
echo ================================

REM Stop all Docker Compose services
echo Stopping Docker services...
docker-compose down

echo All Docker services have been stopped.
pause