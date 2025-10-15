@echo off
title SmartStock

echo Starting SmartStock Menu System...
echo =============================

if exist "smartstock-menu.bat" (
    echo Launching SmartStock Menu...
    call smartstock-menu.bat
) else (
    echo ERROR: smartstock-menu.bat not found!
    echo Please ensure you're running this from the correct directory.
    echo.
    pause
)