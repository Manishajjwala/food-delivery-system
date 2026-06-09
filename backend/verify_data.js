const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hungry_db';

mongoose.connect(MONGO_URI).then(async () => {
  const itemsWithVariants = await FoodItem.find({ 'variants.0': { $exists: true } });
  console.log(`Items with variants: ${itemsWithVariants.length}`);
  itemsWithVariants.forEach(i => console.log(`- ${i.name} (${i.variants.length} variants)`));
  process.exit();
}).catch(console.error);
