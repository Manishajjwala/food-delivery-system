const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const { adminProtect } = require('../middleware/authMiddleware');

// @route   GET /api/admin/stats
// @desc    Get platform-wide stats
// @access  Admin
router.get('/stats', adminProtect, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalRiders = await User.countDocuments({ role: 'delivery' });
    const totalOrders = await Order.countDocuments();
    const revenueData = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueData[0]?.total || 0;
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(0) : 0;

    // Today's Stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayStats = await Order.aggregate([
      { $match: { createdAt: { $gte: today, $lt: tomorrow } } },
      { $group: { _id: null, revenue: { $sum: '$totalPrice' }, count: { $sum: 1 } } }
    ]);

    // Yesterday's Stats
    const yesterdayStart = new Date(today);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const yesterdayEnd = new Date(today);
    
    const yesterdayStats = await Order.aggregate([
      { $match: { createdAt: { $gte: yesterdayStart, $lt: yesterdayEnd } } },
      { $group: { _id: null, revenue: { $sum: '$totalPrice' }, count: { $sum: 1 } } }
    ]);

    const todayRevenue = todayStats[0]?.revenue || 0;
    const todayOrders = todayStats[0]?.count || 0;
    const yesterdayRevenue = yesterdayStats[0]?.revenue || 0;
    const yesterdayOrders = yesterdayStats[0]?.count || 0;

    // Calculating growth percentages
    const revenueGrowth = yesterdayRevenue > 0 ? (((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100) : (todayRevenue > 0 ? 100 : 0);
    const ordersGrowth = yesterdayOrders > 0 ? (((todayOrders - yesterdayOrders) / yesterdayOrders) * 100) : (todayOrders > 0 ? 100 : 0);

    res.json({ 
      totalUsers, 
      totalRiders,
      totalOrders, 
      totalRevenue, 
      avgOrderValue, 
      todayRevenue, 
      todayOrders,
      revenueGrowth: Number(revenueGrowth).toFixed(1),
      ordersGrowth: Number(ordersGrowth).toFixed(1)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});


// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', adminProtect, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
// @access  Admin
router.delete('/users/:id', adminProtect, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders
// @access  Admin
router.get('/orders', adminProtect, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status
// @access  Admin
router.put('/orders/:id/status', adminProtect, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    order.status = status;
    await order.save();
    
    // Notify all parties (Riders scanning for 'accepted' orders)
    const io = req.app.get('io');
    if (io) {
      const { emitOrderUpdate } = require('../utils/orderHandler');
      emitOrderUpdate(io, order);
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status' });
  }
});

// @route   GET /api/admin/payments
// @desc    Get all payment summaries
// @access  Admin
router.get('/payments', adminProtect, async (req, res) => {
  try {
    const orders = await Order.find({ isPaid: true })
      .populate('user', 'name email')
      .select('user paymentMethod totalPrice paidAt paymentResult')
      .sort({ paidAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments' });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Admin
router.put('/users/:id/role', adminProtect, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = role;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role' });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Toggle user active status
// @access  Admin
router.put('/users/:id/status', adminProtect, async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = isActive;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating account status' });
  }
});

// @route   GET /api/admin/stats/daily-sales
// @desc    Get revenue for last 7 days
// @access  Admin
router.get('/stats/daily-sales', adminProtect, async (req, res) => {
  try {
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const sales = await Order.aggregate([
      { $match: { createdAt: { $gte: last7Days } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales trends' });
  }
});

// @route   GET /api/admin/stats/top-dishes
// @desc    Get top 5 selling items
// @access  Admin
router.get('/stats/top-dishes', adminProtect, async (req, res) => {
  try {
    const topDishes = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.name",
          totalSold: { $sum: "$orderItems.quantity" },
          revenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);
    res.json(topDishes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top dishes' });
  }
});

// @route   PUT /api/admin/orders/:id/assign
// @desc    Assign delivery boy to order
// @access  Admin
router.put('/orders/:id/assign', adminProtect, async (req, res) => {
  try {
    const { deliveryBoyId } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    order.deliveryBoy = deliveryBoyId;
    order.isAcceptedByRider = true;
    order.status = 'preparing'; 
    await order.save();
    
    // Notify all parties
    const io = req.app.get('io');
    if (io) {
      const { emitOrderUpdate } = require('../utils/orderHandler');
      emitOrderUpdate(io, order, 'RIDER_ASSIGNED');
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error assigning delivery personnel' });
  }
});

module.exports = router;
