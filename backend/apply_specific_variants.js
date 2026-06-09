const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hungry_db';

const targetKeywords = [
  'Chaat', 'Poha', 'Pasta', 'Ramen', 'Fried Rice', 'Noodles', 
  'Dhokla', 'Khichdi', 'Dal Makhani', 'Paneer Butter Masala', 'Biryani'
];

mongoose.connect(MONGO_URI).then(async () => {
  console.log('Connected to MongoDB');

  for (const keyword of targetKeywords) {
    const items = await FoodItem.find({ name: { $regex: new RegExp(keyword, 'i') } });
    console.log(`Found ${items.length} items for keyword: ${keyword}`);

    for (const item of items) {
      // Check if it already has variants (to avoid overwriting if we don't want to)
      // But user said "rkho" (keep/put), so we ensure they have them.
      const basePrice = item.price;
      const halfPrice = Math.round(basePrice * 0.6);
      
      item.variants = [
        { name: 'Half', price: halfPrice },
        { name: 'Full', price: basePrice }
      ];
      
      await item.save();
      console.log(`Applied variants to: ${item.name} (${item.category})`);
    }
  }

  console.log('Specific migration complete.');
  process.exit();
}).catch(console.error);
