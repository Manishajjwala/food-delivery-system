const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  restaurantName: { type: String, required: true },
  restaurantAddress: { type: String, required: true },
  city: { type: String, required: true },
  ownerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  fssai: { type: String, required: true },
  gstin: { type: String },
  bankAccount: { type: String, required: true },
  ifsc: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
