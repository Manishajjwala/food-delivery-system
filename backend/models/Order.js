const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      variant: { type: String }, // e.g. "Half", "Full"
    },
  ],
  shippingAddress: {
    address: { type: String, required: true },
    type: { type: String, required: true }, // Home, Work, etc.
    lat: { type: Number },
    lng: { type: Number },
  },
  paymentMethod: { type: String, required: true },
  paymentResult: {
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String },
  },
  totalPrice: { type: Number, required: true },
  estimatedDeliveryTime: { type: Number, default: 30 }, // in minutes
  preparationTime: { type: Number, default: 15 }, // in minutes
  deliveryBoy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'preparing', 'packed', 'ready_for_pickup', 'picked_up', 'out_for_delivery', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number },
    updatedAt: { type: Date, default: Date.now }
  },
  isAcceptedByRider: { type: Boolean, default: false },
  rejectedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  deliveryOTP: { type: String, length: 4 },
  review: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    reviewedAt: { type: Date }
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
