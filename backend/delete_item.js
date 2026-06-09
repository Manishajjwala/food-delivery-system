const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hungry_db';

mongoose.connect(MONGO_URI).then(async () => {
  const result = await FoodItem.deleteOne({ name: 'yrdtredtrgyr' });
  console.log('Delete result:', result);
  process.exit();
}).catch(console.error);
