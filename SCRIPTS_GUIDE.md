# SmartStock Scripts Guide

This guide explains all the batch scripts available in the SmartStock project and how to use them.

## Getting Started Scripts

### `get-started.bat`
**Purpose**: One-click setup and start script
**Usage**: Double-click to run
**What it does**:
1. Checks if Node.js is installed
2. Checks if MongoDB is installed
3. Offers to install MongoDB if not found or use Docker
4. Installs all dependencies
5. Creates MongoDB data directory if needed
6. Starts MongoDB, backend, and frontend services

### `start-and-open.bat`
**Purpose**: Start all services and automatically open the application in browser
**Usage**: Double-click to run
**What it does**:
1. Checks if services are already running
2. Starts MongoDB, backend, and frontend services
3. Waits for services to initialize
4. Automatically opens http://localhost:5173 in your browser

### `check-status.bat`
**Purpose**: Check the status of all services
**Usage**: Double-click to run
**What it does**:
1. Checks if MongoDB is running
2. Checks if Backend Server is running
3. Checks if Frontend Server is running
4. Shows URLs for accessing services

## MongoDB Scripts

### `install-mongodb.bat`
**Purpose**: Helper script to install MongoDB
**Usage**: Double-click to run
**What it does**:
1. Provides instructions for downloading MongoDB
2. Explains how to create data directory
3. Shows how to configure MongoDB as a Windows service

### `check-and-start-mongodb.bat`
**Purpose**: Check if MongoDB is running and start it if needed
**Usage**: Double-click to run
**What it does**:
1. Checks if MongoDB is already running on port 27017
2. If not running, starts MongoDB with default data directory
3. Verifies MongoDB is running after start attempt

### `start-with-mongodb.bat`
**Purpose**: Start all services including MongoDB
**Usage**: Double-click to run
**What it does**:
1. Creates MongoDB data directory if needed
2. Starts MongoDB in background
3. Waits for MongoDB to start
4. Starts Backend Server
5. Starts Frontend Server
6. Keeps command window open for monitoring

### `stop-all.bat`
**Purpose**: Stop all running services
**Usage**: Double-click to run
**What it does**:
1. Stops MongoDB processes
2. Stops Node.js processes
3. Closes all service windows

## Docker Scripts

### `start-with-docker.bat`
**Purpose**: Start all services using Docker
**Usage**: Double-click to run
**What it does**:
1. Checks if Docker is installed
2. Starts MongoDB, Backend, and Frontend containers
3. Uses docker-compose.yml configuration
4. Keeps command window open for monitoring

### `stop-docker.bat`
**Purpose**: Stop all Docker containers
**Usage**: Double-click to run
**What it does**:
1. Stops all containers defined in docker-compose.yml
2. Removes containers and networks

## Development Scripts

### `start-dev.js`
**Purpose**: Node.js script to start backend and frontend
**Usage**: Run from command line: `node start-dev.js`
**What it does**:
1. Starts backend server
2. Starts frontend server
3. Handles process termination gracefully

## How to Use These Scripts

### For Beginners (Recommended)
1. Double-click `get-started.bat` - This will handle everything for you
2. Check status with `check-status.bat`
3. Stop services with `stop-all.bat` when done

### For Quick Access
1. Double-click `start-and-open.bat` - This will start services and open the browser
2. When finished, run `stop-all.bat`

### For Advanced Users
1. Use individual scripts as needed:
   - `check-and-start-mongodb.bat` to ensure MongoDB is running
   - `start-with-mongodb.bat` to start all services
   - `stop-all.bat` to stop all services

### For Docker Users
1. Install Docker Desktop
2. Double-click `start-with-docker.bat`
3. Stop with `stop-docker.bat`

## Troubleshooting

### If scripts don't work:
1. Ensure you have proper permissions (run as Administrator if needed)
2. Check that Node.js is installed
3. Verify MongoDB installation if using non-Docker scripts

### If services won't start:
1. Run `check-status.bat` to see what's running
2. Check if ports are already in use
3. Ensure no other instances are running

### If MongoDB connection fails:
1. Run `check-and-start-mongodb.bat`
2. Verify `C:\data\db` directory exists and is writable
3. Check Windows Firewall settings