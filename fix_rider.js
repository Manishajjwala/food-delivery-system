const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });
const User = require('./backend/models/User');

async function fixRider() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    // 1. Delete any existing test rider to be sure
    await User.deleteMany({ email: 'testrider@hungry.com' });
    console.log('Cleared existing test accounts');

    // 2. Create fresh rider
    // Note: The User model has a pre-save hook that hashes the password
    const rider = new User({
      name: 'Test Rider',
      email: 'testrider@hungry.com',
      password: 'password123', // This will be hashed by pre-save hook
      role: 'delivery',
      phone: '1234567890',
      deliveryStaff: { isAvailable: true }
    });

    await rider.save();
    console.log('Created FRESH test rider');

    // 3. Verify hashing
    const savedRider = await User.findOne({ email: 'testrider@hungry.com' });
    console.log('Hashed Password in DB:', savedRider.password);
    
    const isMatch = await savedRider.matchPassword('password123');
    console.log('Password match test:', isMatch);

    if (isMatch) {
       console.log('SUCCESS: testrider@hungry.com is ready!');
    } else {
       console.error('FAILURE: Password hashing issue!');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

fixRider();
