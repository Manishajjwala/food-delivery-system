const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Order = require('./models/Order');
const Menu = require('./models/Menu');

dotenv.config();

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB.');

    const users = await User.countDocuments();
    const orders = await Order.countDocuments();
    // Assuming Menu model is used for dishes
    // Let me check if Menu exists or maybe Dish model
    console.log('Users:', users);
    console.log('Orders:', orders);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

checkData();
