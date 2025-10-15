# SmartStock Startup Options

This document explains the different ways you can start the SmartStock application with all its services.

## Option 1: Manual Start (Traditional Way)

### Prerequisites:
1. MongoDB installed and running
2. Node.js installed
3. Backend and frontend dependencies installed

### Steps:
1. Start MongoDB:
   ```
   mongod --dbpath C:\data\db
   ```
2. In a new terminal, start the backend:
   ```
   cd backend
   npm run dev
   ```
3. In another terminal, start the frontend:
   ```
   cd frontend
   npm run dev
   ```

## Option 2: Automated Batch Scripts (Windows Only)

### Prerequisites:
1. MongoDB installed (use `install-mongodb.bat` if not installed)
2. Node.js installed
3. Dependencies installed

### Steps:
1. Double-click `start-with-mongodb.bat` to start everything
2. To stop all services, close all command windows or run `stop-all.bat`

### Available Batch Scripts:
- `install-mongodb.bat` - Helper to install MongoDB
- `start-with-mongodb.bat` - Starts MongoDB, backend, and frontend
- `check-and-start-mongodb.bat` - Checks if MongoDB is running and starts it if needed
- `stop-all.bat` - Stops all services
- `start-dev.js` - Node.js script to start backend and frontend (requires Node.js)

## Option 3: Docker (Cross-platform)

### Prerequisites:
1. Docker Desktop installed
2. Docker Compose installed (included with Docker Desktop)

### Steps:
1. Double-click `start-with-docker.bat` to start everything in containers
2. To stop services, run `stop-docker.bat`

### Benefits of Docker:
- No need to install MongoDB locally
- Consistent environment across different machines
- Isolated services
- Easy to scale

## Option 4: Using concurrently (Node.js package)

### Prerequisites:
1. MongoDB installed and running
2. Node.js installed
3. Dependencies installed
4. `concurrently` package installed globally:
   ```
   npm install -g concurrently
   ```

### Steps:
1. Run the following command from the root directory:
   ```
   concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
   ```

## Troubleshooting

### MongoDB Issues:
1. If MongoDB won't start, ensure `C:\data\db` directory exists and is writable
2. If port 27017 is in use, you may need to kill the process using it:
   ```
   taskkill /f /im mongod.exe
   ```

### Port Conflicts:
1. If port 8004 is in use, change the PORT in `backend/.env`
2. If port 5173 is in use, Vite will automatically use the next available port

### Database Connection Issues:
1. Ensure MongoDB is running before starting the backend
2. Check that the MONGO_URI in `backend/.env` is correct
3. If using Docker, the URI should be `mongodb://mongodb:27017/inventory`

## Recommended Approach

For development, we recommend using the Docker approach as it:
1. Ensures a consistent environment
2. Automatically handles service dependencies
3. Isolates services
4. Works the same way on all operating systems

If you prefer not to use Docker, use the batch scripts for Windows or the manual approach for other operating systems.