# SmartStock - Real-Time Inventory Intelligence

## Overview

SmartStock is a cutting-edge inventory management system designed for scalable retail operations. It provides real-time analytics, predictive insights, and intelligent replenishment recommendations to help retail managers maintain optimal inventory levels across multiple locations.

## Key Features

### 1. Real-Time Dashboard
- Live inventory tracking across all locations
- Interactive visualizations (charts, graphs, heatmaps)
- KPI monitoring (inventory turnover, stockout rates, fill rates)
- Customizable filters by location, category, and time period

### 2. Advanced Analytics
- Sales trend analysis
- Inventory movement tracking
- ABC analysis for product categorization
- Location-based inventory heatmaps
- Demand forecasting with confidence indicators

### 3. Intelligent Replenishment
- Automated low-stock alerts
- Predictive replenishment recommendations
- Supplier performance tracking
- Order optimization suggestions

### 4. Multi-Location Management
- Centralized control of multiple warehouses/stores
- Transfer coordination between locations
- Location-specific reporting

### 5. Role-Based Access Control
- Admin: Full system access
- Manager: Operational controls
- Employee: Basic inventory functions

## Use Case: Inventory Optimization and Stock Replenishment

### Scenario
A modern retail chain manager aims to harness the power of real-time analytics to maintain optimal inventory across multiple locations. The objective is to eliminate inefficiencies such as overstocking and stockouts, using predictive insights to balance supply and demand efficiently.

### Problem Statement
The manager requires a highly interactive and dynamic dashboard that visualizes inventory levels, highlights restocking priorities, and forecasts replenishment needs. The system should enable proactive, data-backed decisions to enhance the overall inventory strategy.

### Solution Features
- Leverage historical and real-time data to analyze stock flow, forecast demand, and track supplier timelines
- Create a responsive dashboard that flags critical inventory status and shows trends in product movement
- Implement advanced visual tools like heatmaps, line graphs, and animated bar charts for actionable clarity
- Ensure filters are available for store location, product type, or time period to refine insights
- Enable drill-down capabilities to view SKU-level and category-specific performance metrics

## Technical Architecture

### Frontend
- React with Vite
- Material-UI for components
- Chart.js for data visualization
- React Router for navigation

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Socket.IO for real-time updates
- JWT for authentication

### Key Components

#### Authentication
- User registration and login
- Role-based access control
- JWT token management

#### Dashboard
- Real-time KPI monitoring
- Interactive charts and graphs
- Customizable filters
- Responsive design

#### Inventory Management
- Product catalog
- Stock level tracking
- Location management
- Transfer coordination

#### Analytics
- Sales trend analysis
- Inventory movement tracking
- Demand forecasting
- Performance metrics

#### Alerts & Notifications
- Low stock alerts
- Reorder notifications
- Supplier performance alerts

## Getting Started

### Quick Start (Recommended)
1. Double-click `smartstock-menu.bat` for the easiest experience
2. Select "Get Started" from the menu
3. Follow any installation prompts
4. The application will start automatically and open in your browser

### Prerequisites
- Node.js (v14 or higher)
- MongoDB or Docker
- npm or yarn

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

### Configuration

1. Create a `.env` file in the backend directory:
   ```
   PORT=8004
   MONGO_URI=mongodb://localhost:27017/inventory
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   ```

2. Create a `.env` file in the frontend directory:
   ```
   VITE_API_BASE_URL=http://localhost:8004
   ```

### Running the Application

#### Option 1: Menu System (Easiest)
1. Double-click `smartstock-menu.bat`
2. Choose from the available options:
   - Get Started (complete setup)
   - Start Application and Open Browser
   - Check Service Status
   - Stop All Services
   - And more...

#### Option 2: Manual Start (Step by Step)
1. Start MongoDB:
   ```bash
   mongod --dbpath C:\data\db
   ```
2. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
3. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

#### Option 3: Automated Start (Windows)
1. Run the installation helper if MongoDB is not installed:
   ```bash
   install-mongodb.bat
   ```
2. Run the start script:
   ```bash
   start-with-mongodb.bat
   ```
3. To stop all services, run:
   ```bash
   stop-all.bat
   ```

#### Option 4: Docker Start (Cross-platform)
1. Install Docker Desktop from https://www.docker.com/products/docker-desktop
2. Run the Docker start script:
   ```bash
   start-with-docker.bat
   ```
3. To stop Docker services, run:
   ```bash
   stop-docker.bat
   ```

## Additional Documentation

For more detailed information about startup options and scripts, please refer to:
- `SCRIPTS_GUIDE.md` - Detailed guide for all scripts
- `STARTUP_OPTIONS.md` - All startup options explained
- `SMARTSTOCK_STARTUP.md` - Comprehensive startup guide
- `SCRIPTS_LIST.txt` - Quick reference of all scripts
- `MONGODB_INTEGRATION_SUMMARY.md` - Summary of MongoDB integration
- `SOLUTION_SUMMARY.md` - Summary of the solution
- `COMPLETE_SOLUTION.md` - Complete technical solution documentation

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Inventory
- `GET /api/inventory` - Get inventory items
- `POST /api/inventory` - Add inventory item
- `PUT /api/inventory/:id` - Update inventory item
- `DELETE /api/inventory/:id` - Delete inventory item

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard metrics
- `GET /api/analytics/sales` - Get sales data
- `GET /api/analytics/inventory` - Get inventory data

## Development

### Project Structure
```
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
```

### Adding New Features

1. Create new components in the appropriate directory
2. Add routes in App.jsx
3. Implement backend endpoints as needed
4. Update context providers if required

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on the GitHub repository.