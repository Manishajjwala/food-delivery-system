const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const fixRoles = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hungry_db');
        console.log('Connected to Database.');

        const result = await User.updateMany(
            { role: 'delivery_staff' },
            { $set: { role: 'delivery' } }
        );

        console.log(`Updated ${result.modifiedCount} users from "delivery_staff" to "delivery".`);
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err.message);
        process.exit(1);
    }
};

fixRoles();
