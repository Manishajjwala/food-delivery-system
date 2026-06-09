const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true, lowercase: true },
  password: { type: String },
  phone: { type: String, unique: true, sparse: true },
  otp: { type: String },
  otpExpires: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  role: { type: String, enum: ['user', 'admin', 'delivery'], default: 'user' },
  isActive: { type: Boolean, default: true },
  isOnline: { type: Boolean, default: false },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number },
    updatedAt: { type: Date }
  },
  addresses: [{ id: String, type: { type: String }, details: String }],
  payments: [{ id: String, type: { type: String }, details: String }],
  deliveryStaff: {
     isAvailable: { type: Boolean, default: true },
     totalDeliveries: { type: Number, default: 0 },
     currentOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
     vehicleNumber: { type: String, default: '-' },
     vehicleType: { type: String, enum: ['bike', 'scooter', 'cycle', 'walking'], default: 'bike' },
     walletBalance: { type: Number, default: 0 },
     incentives: { type: Number, default: 0 },
  },
  loyaltyPoints: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.password || !this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to check password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
