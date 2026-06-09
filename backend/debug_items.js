const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hungry_db';

mongoose.connect(MONGO_URI).then(async () => {
  const items = await FoodItem.find();
  console.log(`Total items: ${items.length}`);
  items.slice(0, 10).forEach(i => console.log(`- ${i.name} [${i.category}] variants:${JSON.stringify(i.variants)}`));
  process.exit();
}).catch(console.error);
