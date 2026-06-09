const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config();

const User = require('./models/User');

const fixAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected to:', process.env.MONGODB_URI);

        const email = 'admin@hungry.com';
        const password = 'adminpassword';

        let admin = await User.findOne({ email });

        if (!admin) {
            console.log('Admin user not found. Creating new admin...');
            admin = new User({
                name: 'Admin User',
                email: email,
                password: password,
                role: 'admin'
            });
        } else {
            console.log('Admin user found. Updating password and role...');
            admin.role = 'admin';
            admin.password = password;
        }

        // The pre-save hook in User.js will hash the password
        await admin.save();
        console.log('Admin account successfully secured and updated.');
        console.log('Email:', email);
        console.log('Password:', password);
        
        // Final verification
        const verifiedAdmin = await User.findOne({ email });
        const isMatch = await verifiedAdmin.matchPassword(password);
        console.log('Final verification (bcrypt check):', isMatch ? 'SUCCESS' : 'FAILED');

        process.exit(0);
    } catch (error) {
        console.error('Error fixing admin:', error);
        process.exit(1);
    }
};

fixAdmin();
