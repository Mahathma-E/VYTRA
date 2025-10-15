# SmartStock Quick Start Guide

## The Easiest Way to Start SmartStock

### Option 1: Menu System (Recommended)
1. Double-click `smartstock-menu.bat`
2. Select "Start Application and Open Browser"
3. Wait for the message "SmartStock is now running!"
4. Your browser will open automatically to http://localhost:5173

### Option 2: One-Click Startup
1. Double-click `get-started.bat`
2. Follow any installation prompts
3. Wait for services to start
4. Your browser will open automatically

## When You're Finished
1. Close your browser
2. From the menu, select "Stop All Services"
3. Or double-click `stop-all.bat`

## Troubleshooting Quick Reference

### If Services Won't Start
- Run `check-status.bat` to see what's running
- Run `check-and-start-mongodb.bat` to ensure MongoDB is running

### If Services Won't Stop
- Run `stop-all.bat`
- If that doesn't work, run `cleanup.bat`

### If MongoDB Isn't Installed
- Run `install-mongodb.bat` for installation instructions

## URLs for Accessing Services

- **Application**: http://localhost:5173
- **Backend API**: http://localhost:8004
- **Backend Health Check**: http://localhost:8004/health
- **MongoDB**: mongodb://localhost:27017

## Need More Help?

1. Double-click `smartstock-menu.bat` and select "View Documentation"
2. Read `SOLUTION_SUMMARY.md` for a technical overview
3. Read `SCRIPTS_GUIDE.md` for detailed script information

## Remember

- All scripts can be double-clicked to run
- The menu system (`smartstock-menu.bat`) is your central hub
- Everything stops cleanly with `stop-all.bat`
- Docker option available for consistent environments