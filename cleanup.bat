@echo off
title SmartStock - Cleanup

echo SmartStock Cleanup Utility
echo ======================

echo.
echo This script will stop any running SmartStock processes.
echo.

echo Stopping MongoDB processes...
taskkill /f /im mongod.exe /t 2>nul
if %errorlevel% == 0 (
    echo MongoDB processes stopped
) else (
    echo No MongoDB processes found
)

echo Stopping Node.js processes...
taskkill /f /im node.exe /t 2>nul
if %errorlevel% == 0 (
    echo Node.js processes stopped
) else (
    echo No Node.js processes found
)

echo.
echo Cleaning up temporary files...
del /q backend\*.log 2>nul
del /q frontend\*.log 2>nul
echo Temporary files cleaned up

echo.
echo Cleanup complete!
echo.
echo If you're still having issues:
echo 1. Restart your computer
echo 2. Run get-started.bat again
echo.
pause