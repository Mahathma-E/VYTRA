@echo off
echo Stopping SmartStock Development Environment
echo =======================================

echo Stopping MongoDB...
taskkill /f /im mongod.exe /t 2>nul

echo Stopping Node.js processes...
taskkill /f /im node.exe /t 2>nul

echo All services stopped.
echo.
echo If any services are still running, please close them manually.
pause