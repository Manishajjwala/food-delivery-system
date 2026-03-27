const mongoose = require('mongoose');
const dotenv = require('dotenv');
const FoodItem = require('./models/FoodItem');

dotenv.config();

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const count = await FoodItem.countDocuments();
    console.log(`Total FoodItems in DB: ${count}`);
    process.exit();
  } catch (err) {
    console.error('Check Error:', err);
    process.exit(1);
  }
};

checkDB();
