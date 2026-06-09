const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB');

    const admin = await User.findOne({ email: 'admin@hungry.com' });
    if (admin) {
      console.log('Admin found:', admin.email);
      console.log('Admin role:', admin.role);
      // We can't check the password easily without bcrypt, but we can verify it exists
      console.log('Password exists:', !!admin.password);
    } else {
      console.log('Admin NOT found');
    }
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkAdmin();
