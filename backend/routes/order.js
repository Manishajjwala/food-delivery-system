const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const User = require('../models/User'); // Added User model import
const { protect } = require('../middleware/authMiddleware');
const { isValidTransition, emitOrderUpdate } = require('../utils/orderHandler');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice, estimatedDeliveryTime, preparationTime } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  } else {
    try {
      // Find an available delivery boy
      const availableRider = await User.findOne({ 
        role: 'delivery', 
        'deliveryStaff.isAvailable': true 
      });

      const order = new Order({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
        estimatedDeliveryTime,
        preparationTime,
        // Assign found rider if any
        deliveryBoy: availableRider ? availableRider._id : null,
        status: availableRider ? 'preparing' : 'pending',
        deliveryOTP: Math.floor(1000 + Math.random() * 9000).toString()
      });

      const createdOrder = await order.save();
      
      // Send Order Confirmation Email (Background)
      const { sendOrderConfirmation } = require('../utils/emailService');
      sendOrderConfirmation(createdOrder, req.user);
      
      // If a rider was assigned, update their status
      if (availableRider) {
        availableRider.deliveryStaff.isAvailable = false;
        availableRider.deliveryStaff.currentOrderId = createdOrder._id;
        await availableRider.save();
      }

      // Notify admin panel of new order
      const io = req.app.get('io');
      if (io) {
        io.emit('ORDER_CREATED', { orderId: createdOrder._id, status: createdOrder.status });
        io.emit('adminDataUpdated');
      }
      
      res.status(201).json(createdOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ message: 'Server error creating order' });
    }
  }
});

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Order not found (Invalid ID format)' });
    }
    
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      // Check if order belongs to user
      if (order.user._id.toString() !== req.user._id.toString()) {
        res.status(401).json({ message: 'Not authorized to view this order' });
        return;
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching order details' });
  }
});

// @route   GET /api/orders/track/:id
// @desc    Get order status for public tracking (Non-sensitive)
// @access  Public
router.get('/track/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Tracking link invalid' });
    }
    
    // We only select non-sensitive fields
    const order = await Order.findById(req.params.id)
      .select('status totalPrice createdAt estimatedDeliveryTime shippingAddress.type currentLocation deliveryBoy');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error tracking order' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      const oldStatus = order.status;
      if (!isValidTransition(oldStatus, status)) {
        return res.status(400).json({ message: `Invalid status transition from ${oldStatus} to ${status}` });
      }

      order.status = status;
      const updatedOrder = await order.save();

      // IF ORDER IS DELIVERED: Award Points & Update Rider Stats
      if (status === 'delivered' && oldStatus !== 'delivered') {
        const customer = await User.findById(order.user);
        if (customer) {
          const pointsEarned = Math.round(order.totalPrice * 0.05);
          customer.loyaltyPoints = (customer.loyaltyPoints || 0) + pointsEarned;
          await customer.save();
        }

        if (order.deliveryBoy) {
          const rider = await User.findById(order.deliveryBoy);
          if (rider) {
            rider.deliveryStaff.totalDeliveries = (rider.deliveryStaff.totalDeliveries || 0) + 1;
            rider.deliveryStaff.isAvailable = true;
            rider.deliveryStaff.currentOrderId = null;
            await rider.save();
          }
        }
      }
      
      // Standardized Socket Notification
      emitOrderUpdate(req.app.get('io'), updatedOrder);

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Server error updating status' });
  }
});

// @route   PUT /api/orders/:id/review
// @desc    Add review to order
// @access  Private
router.put('/:id/review', protect, async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (order.user.toString() !== req.user._id.toString()) {
        res.status(401).json({ message: 'Not authorized to review this order' });
        return;
      }

      if (order.status !== 'delivered') {
        res.status(400).json({ message: 'Only delivered orders can be reviewed' });
        return;
      }

      order.review = {
        rating: Number(rating),
        comment,
        reviewedAt: Date.now(),
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error adding review' });
  }
});

module.exports = router;
