# SmartStock Startup Guide

This document provides a comprehensive guide on how to start the SmartStock application with all its services running smoothly.

## Understanding the Services

SmartStock requires three main services to run properly:

1. **MongoDB Database** - Stores all application data
2. **Backend Server** - Handles API requests and business logic
3. **Frontend Server** - Provides the user interface

## Quick Start (Recommended)

The easiest way to get started is to double-click `get-started.bat`. This script will:

1. Check if you have the necessary software installed
2. Install any missing dependencies
3. Start all services automatically
4. Provide you with URLs to access the application

## Manual Installation Options

### Option 1: Traditional Installation

#### Prerequisites:
- Node.js (v14 or higher)
- MongoDB Community Server

#### Steps:
1. Install Node.js from https://nodejs.org/
2. Install MongoDB from https://www.mongodb.com/try/download/community
3. Create MongoDB data directory: `mkdir C:\data\db`
4. Install dependencies:
   ```
   cd backend && npm install
   cd frontend && npm install
   ```
5. Start services:
   ```
   mongod --dbpath C:\data\db
   cd backend && npm run dev
   cd frontend && npm run dev
   ```

### Option 2: Docker Installation (Cross-platform)

#### Prerequisites:
- Docker Desktop

#### Steps:
1. Install Docker Desktop from https://www.docker.com/products/docker-desktop
2. Double-click `start-with-docker.bat`
3. Access the application at http://localhost:5173

## Service Ports

| Service | Port | URL |
|---------|------|-----|
| MongoDB | 27017 | mongodb://localhost:27017 |
| Backend | 8004 | http://localhost:8004 |
| Frontend | 5173 | http://localhost:5173 |

## Batch Scripts Overview

| Script | Purpose |
|--------|---------|
| `get-started.bat` | One-click setup and start |
| `check-status.bat` | Check service status |
| `install-mongodb.bat` | MongoDB installation helper |
| `check-and-start-mongodb.bat` | Ensure MongoDB is running |
| `start-with-mongodb.bat` | Start all services with MongoDB |
| `stop-all.bat` | Stop all services |
| `start-with-docker.bat` | Start with Docker |
| `stop-docker.bat` | Stop Docker containers |

## Troubleshooting Common Issues

### MongoDB Not Starting
1. Ensure `C:\data\db` directory exists
2. Check if another MongoDB instance is already running
3. Run `check-and-start-mongodb.bat`

### Port Conflicts
1. Check if ports 27017, 8004, or 5173 are in use
2. Modify `.env` files to use different ports

### Services Not Communicating
1. Ensure all services are running
2. Check that URLs in `.env` files are correct
3. Verify firewall settings

## Best Practices

1. **For Development**: Use `get-started.bat` for quick setup
2. **For Production**: Use Docker for consistent environments
3. **For Testing**: Use `check-status.bat` to verify services
4. **For Cleanup**: Always use `stop-all.bat` or `stop-docker.bat`

## Accessing the Application

Once all services are running:

1. Open your browser
2. Go to http://localhost:5173
3. Register a new account or log in
4. Explore the SmartStock dashboard

## Stopping Services

To properly stop all services:

1. If using traditional installation: Run `stop-all.bat`
2. If using Docker: Run `stop-docker.bat`
3. Or simply close all command windows

## Need Help?

1. Check `SCRIPTS_GUIDE.md` for detailed script information
2. Check `SMARTSTOCK_README.md` for general project information
3. Check `STARTUP_OPTIONS.md` for all available startup methods
4. Run `check-status.bat` to diagnose service issues