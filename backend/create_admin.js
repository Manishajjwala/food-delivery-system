const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

dotenv.config({ path: path.join(__dirname, '.env') });

const createAdmin = async () => {
  const name = 'Admin User';
  const email = 'admin@hungry.com';
  const password = 'adminpassword'; // User should change this later

  try {
    console.log('Attempting to connect to:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('Admin user already exists. Forcing role and password reset...');
      userExists.role = 'admin';
      userExists.password = password; // triggers bcrypt hashing via pre-save hook
      await userExists.save();
      console.log(`Reset password and updated role for ${email}.`);
    } else {
      const admin = await User.create({
        name,
        email,
        password,
        role: 'admin',
      });
      console.log(`Admin user created: ${admin.email}`);
    }

    process.exit();
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
};

createAdmin();
