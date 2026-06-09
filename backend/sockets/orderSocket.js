const socketIO = require('socket.io');

const initOrderSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] New connection: ${socket.id}`);

    // Join a room for a specific order ID (Customer + Rider + Admin can join)
    socket.on('joinOrder', (orderId) => {
      socket.join(orderId);
      console.log(`[Socket] Client ${socket.id} joined order room: ${orderId}`);
    });

    // Handle real-time location pulses from Riders
    socket.on('updateLocation', (data) => {
      const { orderId, location } = data;
      // Broadcast to everyone in the order room (Customer tracking view)
      socket.to(orderId).emit('RIDER_LOCATION_UPDATE', location);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Disconnected: ${socket.id}`);
    });
  });

  // Attach constants for common events to avoid typos
  io.EVENTS = {
    ORDER_CREATED: 'ORDER_CREATED',
    ORDER_STATUS_UPDATED: 'ORDER_STATUS_UPDATED',
    RIDER_ASSIGNED: 'RIDER_ASSIGNED',
    RIDER_LOCATION_UPDATE: 'RIDER_LOCATION_UPDATE',
    ADMIN_DATA_UPDATED: 'adminDataUpdated'
  };

  return io;
};

module.exports = initOrderSocket;
