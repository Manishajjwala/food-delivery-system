const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { isValidTransition, emitOrderUpdate } = require('../utils/orderHandler');
const { getDynamicETA } = require('../utils/googleMaps');

// Helper to create token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/delivery/login
// @desc    Role-based login for delivery boys
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body; // 'email' acts as a general identity field from frontend
  try {
    // If it's a 10-digit number, search by phone, otherwise by email
    const isPhone = /^\d{10}$/.test(email);
    const user = await User.findOne(isPhone ? { phone: email } : { email: email.toLowerCase() });
 
    if (!user) {
      return res.status(401).json({ message: 'User not registered with this ID' });
    }
 
    if (user.role !== 'delivery' && user.role !== 'delivery_staff') {
      return res.status(401).json({ message: 'This is a Customer account. Please use the main Login page or Register as a Partner.' });
    }

    const isMatch = await user.matchPassword(password);
    if (isMatch) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Logistics server error' });
  }
});

// @route   GET /api/delivery/orders
// @desc    Get assigned and available orders
// @access  Delivery
router.get('/orders', protect, async (req, res) => {
  try {
    // Current Assigned Order
    const assignedOrder = await Order.findOne({ 
      deliveryBoy: req.user._id, 
      status: { $nin: ['delivered', 'cancelled'] } 
    }).populate('user', 'name phone');

    // Available "unassigned" orders that this rider hasn't rejected
    const availableOrders = await Order.find({
      status: { $in: ['accepted', 'preparing', 'ready_for_pickup'] },
      deliveryBoy: null,
      rejectedBy: { $ne: req.user._id }
    }).populate('user', 'name phone');

    res.json({
      assigned: assignedOrder,
      available: availableOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Error syncing order queue' });
  }
});

// @route   PUT /api/delivery/order/accept/:id
// @desc    Accept an order
// @access  Delivery
router.put('/order/accept/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order untraceable' });
    if (order.deliveryBoy) return res.status(400).json({ message: 'Order already accepted by another pilot' });

    order.deliveryBoy = req.user._id;
    order.isAcceptedByRider = true;
    order.status = 'preparing'; 
    await order.save();

    // Update rider status
    await User.findByIdAndUpdate(req.user._id, {
      'deliveryStaff.currentOrderId': order._id,
      'deliveryStaff.isAvailable': false
    });

    // Notify User and Admin
    const io = req.app.get('io');
    if (io) {
      emitOrderUpdate(io, order, 'RIDER_ASSIGNED');
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Action transmission fail' });
  }
});

// @route   PUT /api/delivery/order/status/:id
// @desc    Update order status
// @access  Delivery
router.put('/order/status/:id', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order untraceable' });
    if (order.deliveryBoy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized for this cargo' });
    }

    const oldStatus = order.status;
    if (!isValidTransition(oldStatus, status)) {
      return res.status(400).json({ message: `Invalid status transition from ${oldStatus} to ${status}` });
    }

    order.status = status;
    
    // Logic for delivery completion with OTP verification
    if (status === 'delivered') {
      const { otp } = req.body;
      if (!otp || otp.toString() !== order.deliveryOTP.toString()) {
        return res.status(400).json({ message: 'Invalid Handover Pin (OTP)' });
      }
      
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      order.isPaid = true; 
      
      const rider = await User.findById(req.user._id);
      if (rider) {
        rider.deliveryStaff.isAvailable = true;
        rider.deliveryStaff.totalDeliveries += 1;
        rider.deliveryStaff.walletBalance += 40; 
        rider.deliveryStaff.incentives += 15;   
        rider.deliveryStaff.currentOrderId = null;
        await rider.save();
      }
    }

    const updatedOrder = await order.save();
    
    // Notify User and Admin
    emitOrderUpdate(req.app.get('io'), updatedOrder);

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Protocol sync error' });
  }
});

// @route   POST /api/delivery/location/update
// @desc    Real-time location pulse
// @access  Delivery
router.post('/location/update', protect, async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const user = await User.findById(req.user._id);
    
    user.isOnline = true;
    user.currentLocation = { lat, lng, updatedAt: Date.now() };
    await user.save();

    // If active order, update it and broadcast via Socket.io
    if (user.deliveryStaff.currentOrderId) {
      const order = await Order.findById(user.deliveryStaff.currentOrderId);
      if (order) {
        order.currentLocation = { lat, lng, updatedAt: Date.now() };
        
        // Calculate dynamic ETA if order has shipping coordinates
        if (order.shippingAddress?.lat && order.shippingAddress?.lng) {
          const newEta = await getDynamicETA({ lat, lng }, order.shippingAddress);
          order.estimatedDeliveryTime = newEta;
        }
        
        await order.save();

        const io = req.app.get('io');
        if (io) {
          // Broadcast to the order room (User/Admin)
          io.to(order._id.toString()).emit('RIDER_LOCATION_UPDATE', { 
            lat, 
            lng, 
            orderId: order._id,
            eta: order.estimatedDeliveryTime,
            updatedAt: new Date()
          });
        }
      }
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Telemetry drift error' });
  }
});

// @route   GET /api/delivery/earnings
// @desc    Get detailed earnings and history
// @access  Delivery
// @route   GET /api/delivery/profile
// @desc    Get rider profile and stats
// @access  Delivery
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      vehicle: {
        type: user.deliveryStaff.vehicleType,
        number: user.deliveryStaff.vehicleNumber
      },
      stats: {
        totalDeliveries: user.deliveryStaff.totalDeliveries,
        walletBalance: user.deliveryStaff.walletBalance,
        rating: 4.8 // Simulated for now
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Identity retrieval failed' });
  }
});

router.get('/earnings', protect, async (req, res) => {
  try {
    const orders = await Order.find({ deliveryBoy: req.user._id, status: 'delivered' }).sort({ deliveredAt: -1 });
    
    const rider = await User.findById(req.user._id);
    
    // Weekly calculation
    const dailyStats = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);
        const dayOrders = orders.filter(o => {
            const od = new Date(o.deliveredAt);
            od.setHours(0, 0, 0, 0);
            return od.getTime() === d.getTime();
        });
        const count = dayOrders.length;
        const rev = dayOrders.reduce((sum, o) => sum + 40 + 15, 0); // Base + Incentive
        dailyStats.push({ 
            date: d.toISOString().split('T')[0],
            day: d.toLocaleDateString('en-US', { weekday: 'short' }), 
            count, 
            earnings: rev 
        });
    }

    res.json({
      totalPayout: rider.deliveryStaff.walletBalance,
      totalIncentives: rider.deliveryStaff.incentives,
      totalDeliveries: rider.deliveryStaff.totalDeliveries,
      dailyStats: dailyStats.reverse(),
      history: orders.slice(0, 10).map(o => ({
          id: o._id,
          amount: 40 + 15,
          date: o.deliveredAt,
          status: 'success'
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Financial audit failed' });
  }
});

module.exports = router;
