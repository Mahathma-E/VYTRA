@echo off
title SmartStock - Setup Verification

echo SmartStock Setup Verification
echo ==========================

echo.
echo Checking for required files...
echo.

REM Check for main scripts
if exist "smartstock-menu.bat" (
    echo [OK] Main menu system found
) else (
    echo [MISSING] smartstock-menu.bat
)

if exist "get-started.bat" (
    echo [OK] Get started script found
) else (
    echo [MISSING] get-started.bat
)

if exist "start-and-open.bat" (
    echo [OK] Start and open script found
) else (
    echo [MISSING] start-and-open.bat
)

echo.
echo Checking for management scripts...
echo.

if exist "check-status.bat" (
    echo [OK] Status check script found
) else (
    echo [MISSING] check-status.bat
)

if exist "stop-all.bat" (
    echo [OK] Stop all script found
) else (
    echo [MISSING] stop-all.bat
)

if exist "cleanup.bat" (
    echo [OK] Cleanup script found
) else (
    echo [MISSING] cleanup.bat
)

echo.
echo Checking for MongoDB scripts...
echo.

if exist "check-and-start-mongodb.bat" (
    echo [OK] MongoDB check script found
) else (
    echo [MISSING] check-and-start-mongodb.bat
)

if exist "install-mongodb.bat" (
    echo [OK] MongoDB install helper found
) else (
    echo [MISSING] install-mongodb.bat
)

echo.
echo Checking for Docker scripts...
echo.

if exist "start-with-docker.bat" (
    echo [OK] Docker start script found
) else (
    echo [MISSING] start-with-docker.bat
)

if exist "stop-docker.bat" (
    echo [OK] Docker stop script found
) else (
    echo [MISSING] stop-docker.bat
)

echo.
echo Checking for configuration files...
echo.

if exist "backend\.env" (
    echo [OK] Backend .env file found
) else (
    echo [WARNING] backend\.env not found (will be created on first run)
)

if exist "frontend\.env" (
    echo [OK] Frontend .env file found
) else (
    echo [WARNING] frontend\.env not found (will be created on first run)
)

if exist "docker-compose.yml" (
    echo [OK] Docker Compose file found
) else (
    echo [MISSING] docker-compose.yml
)

if exist "backend\Dockerfile" (
    echo [OK] Backend Dockerfile found
) else (
    echo [MISSING] backend\Dockerfile
)

if exist "frontend\Dockerfile" (
    echo [OK] Frontend Dockerfile found
) else (
    echo [MISSING] frontend\Dockerfile
)

echo.
echo Checking for documentation...
echo.

if exist "SMARTSTOCK_README.md" (
    echo [OK] Main README found
) else (
    echo [MISSING] SMARTSTOCK_README.md
)

if exist "SOLUTION_SUMMARY.md" (
    echo [OK] Solution summary found
) else (
    echo [MISSING] SOLUTION_SUMMARY.md
)

if exist "COMPLETE_SOLUTION.md" (
    echo [OK] Complete solution documentation found
) else (
    echo [MISSING] COMPLETE_SOLUTION.md
)

echo.
echo Setup verification complete!
echo.
echo If any files are missing, please re-download the project.
echo If only .env files are missing, they will be created automatically.
echo.
pause