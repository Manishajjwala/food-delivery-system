const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });
const User = require('./backend/models/User');
const Order = require('./backend/models/Order');

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    // 1. Create or find a test rider
    let rider = await User.findOne({ email: 'testrider@hungry.com' });
    if (!rider) {
      rider = await User.create({
        name: 'Test Rider',
        email: 'testrider@hungry.com',
        password: 'password123',
        phone: '1234567890',
        role: 'delivery',
        deliveryStaff: { isAvailable: true }
      });
      console.log('Created test rider');
    } else {
      rider.deliveryStaff.isAvailable = true;
      await rider.save();
      console.log('Reset test rider availability');
    }

    // 2. Create a test user
    let user = await User.findOne({ email: 'testuser@hungry.com' });
    if (!user) {
      user = await User.create({
        name: 'Test User',
        email: 'testuser@hungry.com',
        password: 'password123',
        role: 'user'
      });
      console.log('Created test user');
    }

    // 3. Simulate order creation (auto-assignment should happen inside the route, but here we test the logic directly or via a mock call)
    // Since we can't easily trigger the route via curl without a valid JWT, let's test the logic by calling a function or mimicking it.
    
    console.log('Simulating Order Placement...');
    const availableRider = await User.findOne({ 
      role: 'delivery_staff', 
      'deliveryStaff.isAvailable': true 
    });

    const order = new Order({
      user: user._id,
      orderItems: [{ name: 'Test Pizza', quantity: 1, price: 10 }],
      shippingAddress: { address: '123 Test St', type: 'Home' },
      paymentMethod: 'COD',
      totalPrice: 10,
      deliveryBoy: availableRider ? availableRider._id : null,
      status: availableRider ? 'preparing' : 'pending'
    });

    const createdOrder = await order.save();
    console.log('Order created with status:', createdOrder.status);
    console.log('Assigned Rider ID:', createdOrder.deliveryBoy);

    if (availableRider) {
      availableRider.deliveryStaff.isAvailable = false;
      availableRider.deliveryStaff.currentOrderId = createdOrder._id;
      await availableRider.save();
      console.log('Rider availability updated to false');
    }

    // 4. Verify
    const updatedRider = await User.findById(rider._id);
    console.log('Verification - Rider isAvailable:', updatedRider.deliveryStaff.isAvailable);

    // 5. Cleanup
    await Order.deleteOne({ _id: createdOrder._id });
    console.log('Test Order deleted');

    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

test();
