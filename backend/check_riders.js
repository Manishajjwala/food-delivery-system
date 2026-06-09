const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const User = require('./models/User');

const check = async () => {
    try {
        console.log('Connecting...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hungry_db');
        const riders = await User.find({ role: { $in: ['delivery', 'delivery_staff'] } });
        console.log(`-- TABLE: RIDERS IN DATABASE (${riders.length}) --`);
        riders.forEach(r => console.log(`| ${r.name.padEnd(15)} | ${r.email.padEnd(20)} | ${r.role.padEnd(15)} |`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
check();
