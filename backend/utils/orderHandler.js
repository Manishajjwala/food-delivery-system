/**
 * Unified Order Lifecycle Utility
 * Enforces strict transitions and handles Socket.io emissions
 */

const ORDER_LIFECYCLE = [
  'pending',
  'accepted',
  'preparing',
  'packed',
  'ready_for_pickup',
  'picked_up',
  'out_for_delivery',
  'delivered'
];

/**
 * Validates if the new status is the next logical step or 'cancelled'
 */
const isValidTransition = (currentStatus, nextStatus) => {
  if (nextStatus === 'cancelled') return true;
  
  const currentIndex = ORDER_LIFECYCLE.indexOf(currentStatus);
  const nextIndex = ORDER_LIFECYCLE.indexOf(nextStatus);
  
  // Allow transitions only if it's the next step
  return nextIndex === currentIndex + 1;
};

/**
 * Standardized Socket Emitter Helper
 */
const emitOrderUpdate = (io, order, eventName) => {
  if (!io) return;
  
  const event = eventName || 'ORDER_STATUS_UPDATED';
  const data = {
    orderId: order._id,
    status: order.status,
    updatedAt: new Date(),
    // Include minimal tracking info for the map
    location: order.currentLocation
  };

  // 1. Notify the specific order room (User App + Rider App)
  io.to(order._id.toString()).emit(event, data);

  // 2. Notify Admin Panel for dashboard updates
  io.emit('adminDataUpdated');
};

module.exports = {
  ORDER_LIFECYCLE,
  isValidTransition,
  emitOrderUpdate
};
