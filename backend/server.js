const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars at the VERY top
dotenv.config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/order');
const menuRoutes = require('./routes/menu');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
// More explicit CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Verbose request logger for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/contact', require('./routes/contact'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
