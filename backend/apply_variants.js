const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hungry_db';

const applyVariants = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Categories that typically have Half/Full options
    const targetCategories = ['Chinese', 'Fast Food', 'Street Food', 'South Indian', 'Main Course'];
    
    // Find items that don't have variants yet
    const items = await FoodItem.find({
      $and: [
        {
          $or: [
            { category: { $in: targetCategories } },
            { name: { $regex: /Noodles|Rice|Manchurian|Paneer|Dal|Biryani/i } }
          ]
        },
        {
          $or: [
            { variants: { $size: 0 } },
            { variants: { $exists: false } }
          ]
        }
      ]
    });

    console.log(`Found ${items.length} items to update.`);

    for (const item of items) {
      const basePrice = item.price;
      const halfPrice = Math.round(basePrice * 0.6);
      
      item.variants = [
        { name: 'Half', price: halfPrice },
        { name: 'Full', price: basePrice }
      ];
      
      await item.save();
      console.log(`Updated: ${item.name} (${item.category}) -> Half: ₹${halfPrice}, Full: ₹${basePrice}`);
    }

    console.log('Migration complete.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

applyVariants();
