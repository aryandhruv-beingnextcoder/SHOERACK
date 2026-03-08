const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const cron = require('node-cron');
const connectDB = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const photoRoutes = require('./routes/photos');
const adminRoutes = require('./routes/admin');
const brandRoutes = require('./routes/brands');
const categoryRoutes = require('./routes/categories');
const reviewRoutes = require('./routes/reviews');
const SyncManager = require('./utils/syncManager');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Initialize sync manager
const syncManager = new SyncManager(io);

// Make io and syncManager available to routes
app.set('io', io);
app.set('syncManager', syncManager);

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://192.168.1.116:3000', 'http://192.168.1.125:3000'],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'SHOERACK API is running!' });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const healthCheck = require('./healthCheck');
    const result = await healthCheck();
    res.json(result);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);

// Connect to MongoDB
connectDB();

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('👋 User disconnected:', socket.id);
  });
});

// Database sync scheduler - runs every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  try {
    console.log('🔄 Running database sync...');
    io.emit('sync_status', { status: 'syncing', timestamp: new Date() });
    
    // Emit updated data to all connected clients
    const Product = require('./models/Product');
    const Order = require('./models/Order');
    
    const products = await Product.find().populate('brand category');
    const orders = await Order.find().populate('user', 'name email');
    
    io.emit('data_updated', {
      products: products.length,
      orders: orders.length,
      timestamp: new Date()
    });
    
    console.log('✅ Database sync completed');
  } catch (error) {
    console.error('❌ Sync error:', error);
    io.emit('sync_error', { error: error.message, timestamp: new Date() });
  }
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend should connect to: http://localhost:${PORT}/api`);
  console.log(`🔌 Socket.IO ready for real-time updates`);
});