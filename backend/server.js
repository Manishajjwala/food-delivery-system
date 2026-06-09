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
const server = require('http').createServer(app);
const initOrderSocket = require('./sockets/orderSocket');

// Initialize Socket.IO
const io = initOrderSocket(server);
app.set('io', io);

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
app.use('/api/admin', require('./routes/admin'));
app.use('/api/delivery', require('./routes/delivery'));

// EMERGENCY ADMIN RECOVERY (DIRECT)
app.get('/api/master', async (req, res) => {
  try {
    const User = require('./models/User');
    const email = 'admin@hungry.com';
    const password = 'adminpassword';
    let admin = await User.findOne({ email });
    
    if (!admin) {
      admin = await User.create({ name: 'Admin Master', email, password, role: 'admin' });
    } else {
      admin.password = password;
      admin.role = 'admin';
      await admin.save();
    }
    res.json({ 
      message: 'ADMIN_RECOVERED_SUCCESSFULLY', 
      email: email,
      role: admin.role,
      id: admin._id 
    });
  } catch (err) {
    res.status(500).json({ status: 'RECOVERY_ERROR', error: err.message });
  }
});



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
