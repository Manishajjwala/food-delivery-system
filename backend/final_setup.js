const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const User = require('./models/User');

async function setup() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hungry_db';
    console.log(`Connecting to: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('Connected to Database...');

    // Clear old test accounts
    await User.deleteMany({ email: { $in: ['admin@hungry.com', 'rider@hungry.com', 'user@hungry.com', 'testrider@hungry.com'] } });
    console.log('Cleared existing test accounts');

    // 1. Create Admin
    await User.create({ 
        name: 'System Admin', 
        email: 'admin@hungry.com', 
        password: 'admin123', 
        role: 'admin' 
    });
    console.log('Admin account created!');
    
    // 2. Create Rider (delivery_staff)
    await User.create({ 
        name: 'Test Rider', 
        email: 'rider@hungry.com', 
        password: 'rider123', 
        role: 'delivery', 
        deliveryStaff: { isAvailable: true } 
    });
    console.log('Rider account created!');

    // 3. Create Customer
    await User.create({ 
        name: 'Test Customer', 
        email: 'user@hungry.com', 
        password: 'user123', 
        role: 'user' 
    });
    console.log('Customer account created!');

    console.log('-----------------------------------');
    console.log('SUCCESS: All 3 roles created!');
    console.log('Admin: admin@hungry.com / admin123');
    console.log('Rider: rider@hungry.com / rider123');
    console.log('User: user@hungry.com / user123');
    console.log('-----------------------------------');
    process.exit(0);
  } catch (err) {
    console.error('Setup Failed:', err.message);
    process.exit(1);
  }
}
setup();
