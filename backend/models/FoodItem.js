const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: 'A delicious vegetarian dish.',
  },
}, { timestamps: true });

module.exports = mongoose.model('FoodItem', foodItemSchema);
