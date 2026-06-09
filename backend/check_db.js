const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hungry_db').then(async () => {
  const admin = await User.findOne({ email: 'admin@hungry.com' });
  console.log('Admin user directly from DB:');
  console.log(admin);
  if (admin && admin.role !== 'admin') {
    admin.role = 'admin';
    await admin.save();
    console.log('Fixed admin role');
  } else if (!admin) {
    const admin2 = await User.create({
      name: 'Admin User',
      email: 'admin@hungry.com',
      password: 'adminpassword',
      role: 'admin'
    });
    console.log('Created admin:', admin2);
  }
  process.exit();
}).catch(console.error);
