@echo off
title SmartStock - Main Menu

:menu
cls
echo ======================================================
echo            SmartStock - Main Menu
echo ======================================================
echo.
echo Select an option:
echo.
echo 1. Get Started (Recommended for new users)
echo 2. Start Application and Open Browser
echo 3. Check Service Status
echo 4. Stop All Services
echo 5. Install MongoDB
echo 6. Start with Docker
echo 7. Stop Docker Services
echo 8. Cleanup Stray Processes
echo 9. View Documentation
echo 0. Exit
echo.
echo ======================================================
echo.

choice /c 1234567890 /n /m "Enter your choice: "

if errorlevel 10 goto exit
if errorlevel 9 goto docs
if errorlevel 8 goto cleanup
if errorlevel 7 goto stopdocker
if errorlevel 6 goto startdocker
if errorlevel 5 goto installmongo
if errorlevel 4 goto stopall
if errorlevel 3 goto checkstatus
if errorlevel 2 goto startopen
if errorlevel 1 goto getstarted

:getstarted
cls
echo Starting SmartStock Setup...
call get-started.bat
pause
goto menu

:startopen
cls
echo Starting SmartStock and Opening Browser...
call start-and-open.bat
pause
goto menu

:checkstatus
cls
echo Checking Service Status...
call check-status.bat
pause
goto menu

:stopall
cls
echo Stopping All Services...
call stop-all.bat
pause
goto menu

:installmongo
cls
echo MongoDB Installation Helper...
call install-mongodb.bat
pause
goto menu

:startdocker
cls
echo Starting with Docker...
call start-with-docker.bat
pause
goto menu

:stopdocker
cls
echo Stopping Docker Services...
call stop-docker.bat
pause
goto menu

:cleanup
cls
echo Cleaning Up Processes...
call cleanup.bat
pause
goto menu

:docs
cls
echo Available Documentation:
echo.
echo 1. Main README: SMARTSTOCK_README.md
echo 2. Scripts Guide: SCRIPTS_GUIDE.md
echo 3. Startup Options: STARTUP_OPTIONS.md
echo 4. Solution Summary: SOLUTION_SUMMARY.md
echo 5. MongoDB Integration: MONGODB_INTEGRATION_SUMMARY.md
echo.
echo Double-click any of these files to view them.
echo.
pause
goto menu

:exit
cls
echo Thank you for using SmartStock!
echo.
echo To start the application later, simply run this menu again.
echo.
pause
exit