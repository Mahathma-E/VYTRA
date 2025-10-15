import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

// Route files
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import userRoutes from './routes/userRoutes.js';
import excelRoutes from './routes/excelRoutes.js';
import currencyRoutes from './routes/currencyRoutes.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 8003;

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Connect to MongoDB
connectDB();

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for inventory updates
  socket.on('inventoryUpdate', (data) => {
    // Broadcast to all connected clients
    io.emit('inventoryUpdated', data);
  });

  // Listen for new alerts
  socket.on('newAlert', (data) => {
    // Broadcast to all connected clients
    io.emit('alertReceived', data);
  });

  // Listen for dashboard updates
  socket.on('dashboardUpdate', (data) => {
    // Broadcast to all connected clients
    io.emit('dashboardUpdated', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/excel', excelRoutes);
app.use('/api/currency', currencyRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Advanced Inventory Intelligence System API' });
});

// Health check route
app.get('/health', async (req, res) => {
  try {
    res.status(200).json({ 
      status: 'OK', 
      database: 'MongoDB',
      storage: 'Active',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'Service Unavailable', 
      database: 'Error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port http://localhost:${PORT}`);
  console.log(`🏥 Health check endpoint: http://localhost:${PORT}/health`);
  console.log(`📊 API endpoints available at: http://localhost:${PORT}/api/`);
  console.log(`\n✅ Server ready and connected to MongoDB`);
});