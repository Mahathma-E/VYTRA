@echo off
echo MongoDB Installation Helper for SmartStock
echo ========================================

echo This script will help you install MongoDB for the SmartStock application.
echo.

echo Step 1: Download MongoDB Community Server
echo ----------------------------------------
echo Please download MongoDB Community Server from:
echo https://www.mongodb.com/try/download/community
echo.
echo Select:
echo - Version: Latest Stable Release
echo - OS: Windows x64
echo - Package: msi
echo.
echo After downloading, run the installer with default settings.
echo.

echo Step 2: Create MongoDB Data Directory
echo ------------------------------------
echo After installation, create a data directory for MongoDB:
echo mkdir C:\data\db
echo.

echo Step 3: Configure MongoDB as a Windows Service (Optional)
echo --------------------------------------------------------
echo To run MongoDB as a Windows service:
echo 1. Open Command Prompt as Administrator
echo 2. Navigate to MongoDB bin directory (usually C:\Program Files\MongoDB\Server\[version]\bin)
echo 3. Run: mongod --config "C:\Program Files\MongoDB\Server\[version]\bin\mongod.cfg" --install
echo 4. Run: net start MongoDB
echo.

echo Press any key to continue...
pause >nul