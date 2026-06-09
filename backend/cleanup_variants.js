const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hungry_db';

const cleanupItems = [
  'Royal Maharaja Thali',
  'Aloo Paratha (2pc)',
  'Gujarati Thepla',
  'Khamman Dhokla', // also check for 'Khaman Dhokla'
  'Classic Veg Burger',
  'Veg Club Sandwich',
  'Crispy French Fries',
  'Paneer Wrap',
  'Soft Croissant',
  'Veg Nachos Large',
  'Veg Mexican Tacos (3pc)',
  'Veg Sushi Platter',
  'Veg Dimsums',
  'Veg Momos (8pc)',
  'Pav Bhaji Special',
  'Delhi Ki Chaat',
  'Masala Dosa',
  'Chole Bhature (2pc)',
  'Mumbai Vada Pav',
  'Punjabi Samosa (2pc)',
  'Pani Puri (8pc)',
  'Kutchi Dabeli',
  'Indori Poha',
  'Veg Sizzler'
];

mongoose.connect(MONGO_URI).then(async () => {
  const result = await FoodItem.updateMany(
    { 
      $or: [
        { name: { $in: cleanupItems } },
        { name: { $regex: /Dabeli|Samosa|Vadapav|Chole Bhature|Dosa|Pav Bhaji|Nachos|Tacos|Sizzler|Croissant|Sushi|Dimsums|Wrap|Fries|Momos|Sandwich|Burger|Thepla|Paratha|Thali/i } }
      ]
    },
    { $set: { variants: [] } }
  );
  console.log('Cleanup result:', result);
  process.exit();
}).catch(console.error);
