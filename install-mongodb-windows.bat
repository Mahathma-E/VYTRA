@echo off
echo ========================================
echo MongoDB Installation for Windows
echo ========================================
echo.

echo This script will help you install MongoDB on Windows.
echo.

echo Option 1: Install MongoDB Community Server
echo 1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
echo 2. Run the installer and follow the setup wizard
echo 3. Make sure to install MongoDB as a Windows Service
echo 4. Add MongoDB to your PATH during installation
echo.

echo Option 2: Use Docker (Recommended - Easier)
echo 1. Install Docker Desktop from: https://www.docker.com/products/docker-desktop
echo 2. Run: docker run -d -p 27017:27017 --name mongodb mongo:latest
echo 3. MongoDB will be available at localhost:27017
echo.

echo Option 3: Use MongoDB Atlas (Cloud - No installation needed)
echo 1. Go to: https://www.mongodb.com/atlas
echo 2. Create a free account and cluster
echo 3. Get your connection string
echo 4. Update the MONGO_URI in backend/.env file
echo.

echo Current Status:
echo - Backend Server: Running on http://localhost:8003
echo - Frontend Server: Running on http://localhost:5173
echo - MongoDB: Not connected (running in demo mode)
echo.

echo The application will work without MongoDB, but some features may be limited.
echo You can still test Excel import and analytics features.
echo.

pause
