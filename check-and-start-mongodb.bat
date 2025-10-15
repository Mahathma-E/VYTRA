@echo off
echo Checking MongoDB Status
echo =====================

REM Check if MongoDB is already running
netstat -an | findstr :27017 >nul
if %errorlevel% == 0 (
    echo MongoDB is already running on port 27017
    exit /b
)

REM Check if MongoDB is installed
mongod --version >nul 2>&1
if %errorlevel% == 0 (
    echo MongoDB is installed
) else (
    echo MongoDB is not installed
    echo Please run install-mongodb.bat first
    pause
    exit /b
)

REM Create data directory if it doesn't exist
if not exist "C:\data\db" (
    echo Creating MongoDB data directory...
    mkdir "C:\data\db"
)

REM Start MongoDB
echo Starting MongoDB...
start "MongoDB" /min cmd /c "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe --dbpath C:\data\db"

REM Wait for MongoDB to start
echo Waiting for MongoDB to start...
timeout /t 5 /nobreak >nul

REM Verify MongoDB is running
netstat -an | findstr :27017 >nul
if %errorlevel% == 0 (
    echo MongoDB is now running on port 27017
) else (
    echo Failed to start MongoDB
    echo Please check if the data directory is accessible
)

pause