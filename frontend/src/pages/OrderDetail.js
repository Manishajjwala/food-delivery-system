import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Package, Clock, CheckCircle, ChevronLeft, Truck, Utensils, AlertTriangle, Star, MessageSquare } from 'lucide-react';
import DeliveryMap from '../components/DeliveryMap';
import ReviewModal from '../components/ReviewModal';
import OrderChat from '../components/OrderChat';
import { io } from 'socket.io-client';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Placed');
  const [liveEta, setLiveEta] = useState(1500); // 25 minutes in seconds
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [riderLocation, setRiderLocation] = useState(null);
  const navigate = useNavigate();

  // Helper to format MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 1. Centralized Countdown Logic
  useEffect(() => {
    if (['Delivered', 'Cancelled'].includes(status) || liveEta <= 120) return;

    const timer = setInterval(() => {
      setLiveEta(prev => Math.max(120, prev - 1)); // Strictly 1:1 real-time speed
    }, 1000); 

    return () => clearInterval(timer);
  }, [status]); // Only restart if status changes (no liveEta dependency)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Order not found');
        }

        const data = await response.json();
        
        const formattedOrder = {
          id: data._id,
          date: new Date(data.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          items: data.orderItems.map(i => ({ name: i.name, quantity: i.quantity, variant: i.variant })),
          total: data.totalPrice,
          status: data.status,
          address: data.shippingAddress.address,
          estimatedTime: data.estimatedDeliveryTime || 30,
          createdAt: new Date(data.createdAt),
          review: data.review,
          otp: data.deliveryOTP,
        };

        setOrder(formattedOrder);
        setStatus(data.status);
        
        // Auto-show review modal if delivered and not yet reviewed
        if (data.status === 'delivered' && !data.review) {
          setShowReviewModal(true);
        }
        
        // Calculate dynamic ETA based on time passed and status
        const minutesPassed = Math.floor((Date.now() - new Date(data.createdAt)) / 60000);
        let calculatedEta = Math.max(5, (data.estimatedDeliveryTime || 30) - minutesPassed);
        
        if (data.status === 'Delivered') setLiveEta(0);
        else if (data.status === 'Out for Delivery') setLiveEta(Math.min(calculatedEta, 15) * 60); 
        else setLiveEta(calculatedEta * 60);
        
    setLoading(false);
  } catch (err) {
    console.error('Error fetching order:', err);
    setLoading(false);
  }
};

fetchOrderDetails();

// 2. Real-time Polling for Status Updates (Every 5s)
const pollInterval = setInterval(() => {
  if (status !== 'Delivered' && status !== 'Cancelled') {
    fetchOrderDetails();
  }
}, 5000);

return () => clearInterval(pollInterval);
}, [orderId, status]);

  // 3. Socket.io Real-time Updates (Status & GPS)
  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    socket.on('connect', () => {
      socket.emit('joinOrder', orderId);
      console.log('[Socket] Connected to order room:', orderId);
    });

    socket.on('RIDER_LOCATION_UPDATE', (data) => {
      setRiderLocation({ lat: data.lat, lng: data.lng });
      if (data.eta) setLiveEta(data.eta * 60); // Convert to seconds for the UI counter
    });
    
    socket.on('ORDER_STATUS_UPDATED', (data) => {
      console.log('[Socket] Status updated:', data.status);
      setStatus(data.status);
      
      // Update ETA based on new status
      if (data.status === 'delivered') setLiveEta(0);
      else if (data.status === 'out_for_delivery') setLiveEta(prev => Math.min(prev, 600)); 
    });

    return () => socket.disconnect();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-warmOrange"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif">Order Not Found</h2>
        <Link to="/dashboard" className="text-warmOrange font-bold flex items-center">
          <ChevronLeft size={20} /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const steps = [
    { label: 'Placed', icon: <CheckCircle size={20} />, active: true },
    { label: 'Accepted', icon: <CheckCircle size={20} />, active: ['accepted', 'preparing', 'packed', 'ready_for_pickup', 'picked_up', 'out_for_delivery', 'delivered'].includes(status) },
    { label: 'Preparing', icon: <Utensils size={20} />, active: ['preparing', 'packed', 'ready_for_pickup', 'picked_up', 'out_for_delivery', 'delivered'].includes(status) },
    { label: 'Packed', icon: <Package size={20} />, active: ['packed', 'ready_for_pickup', 'picked_up', 'out_for_delivery', 'delivered'].includes(status) },
    { label: 'Picked Up', icon: <Truck size={20} />, active: ['picked_up', 'out_for_delivery', 'delivered'].includes(status) },
    { label: 'On Way', icon: <Truck size={20} />, active: ['out_for_delivery', 'delivered'].includes(status) },
    { label: 'Delivered', icon: <Star size={20} />, active: status === 'delivered' }
  ];

  return (
    <div className="bg-cream min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center text-gray-500 hover:text-warmOrange font-bold mb-6 transition-colors">
          <ChevronLeft size={20} className="mr-1" /> Back to Dashboard
        </Link>

        {/* Real-time Status Card */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-peach-50 overflow-hidden mb-8">
           {/* Map Header Section */}
            <div className="relative h-[280px] sm:h-[350px] w-full bg-gray-100 overflow-hidden">
               <DeliveryMap 
                 orderStatus={status} 
                 liveEta={liveEta} 
                 riderLocation={riderLocation}
               />
              
              {/* Overlay Status Bar */}
              <div className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between">
                 <div className="bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/40">
                    <div className="w-10 h-10 bg-warmOrange/10 rounded-xl flex items-center justify-center text-warmOrange">
                       <Clock size={24} className="animate-pulse" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Estimated Delivery</p>
                      <p className="text-xl font-black text-gray-900">{formatTime(liveEta)}</p>
                    </div>
                 </div>

                 <div className="bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/40">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                       <Package size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Order ID</p>
                      <p className="text-xl font-black text-gray-900">#{order.id.slice(-6)}</p>
                    </div>
                 </div>
              </div>
               {/* Delivery OTP Card (Only when out for delivery) */}
               {(status === 'out_for_delivery' || status.toLowerCase() === 'out for delivery') && order.otp && (
                 <div className="absolute bottom-6 left-6 right-6 z-20 animate-in slide-in-from-bottom duration-500">
                    <div className="bg-gray-900 text-white p-5 rounded-2xl shadow-2xl border border-white/10 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-warmOrange rounded-xl flex items-center justify-center text-white shrink-0">
                             <CheckCircle size={28} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Handover Pin (OTP)</p>
                             <p className="text-gray-400 text-[10px] font-medium leading-tight mt-0.5">Share with rider to verify delivery</p>
                          </div>
                       </div>
                       <div className="bg-white/10 px-6 py-2 rounded-xl border border-white/20">
                          <span className="text-3xl font-black tracking-[0.2em]">{order.otp}</span>
                       </div>
                    </div>
                 </div>
               )}
            </div>

           <div className="p-8">
            {/* Tracking Timeline */}
            {status !== 'Cancelled' ? (
              <div className="mb-8">
                <div className="flex justify-between items-start relative">
                  {/* Connector Line */}
                  <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 -z-0">
                    <div 
                      className="h-full bg-warmOrange transition-all duration-[2000ms] ease-out" 
                      style={{ width: `${(steps.filter(s => s.active).length - 1) * 33.3}%` }}
                    ></div>
                  </div>

                  {steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center relative z-10 w-20">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-700 ${step.active ? 'bg-warmOrange text-white shadow-lg scale-110' : 'bg-white text-gray-300 border-2 border-gray-100'}`}>
                        {step.icon}
                      </div>
                      <p className={`mt-3 text-[10px] font-black uppercase tracking-tight text-center ${step.active ? 'text-warmOrange' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-8 bg-red-50 p-6 rounded-3xl flex items-center space-x-4 border border-red-100">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm font-bold text-xl">
                    <AlertTriangle size={24} />
                 </div>
                 <div>
                   <h3 className="text-red-500 font-bold text-lg">Order Cancelled</h3>
                   <p className="text-red-400 text-sm">This order has been cancelled and will not be delivered.</p>
                 </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Order Items */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 font-serif border-b border-gray-50 pb-2">Order Summary</h3>
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm font-bold text-gray-700 bg-white p-3 rounded-2xl border border-peach-50 shadow-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-900">{item.name}</span>
                        {item.variant && (
                          <span className="text-[10px] font-black text-warmOrange/60 uppercase tracking-widest mt-1">
                            Size: {item.variant}
                          </span>
                        )}
                      </div>
                      <span className="bg-peach-100 text-warmOrange px-2.5 py-1 rounded-lg text-[10px] font-black">x{item.quantity}</span>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-peach-50 flex justify-between items-center mt-4">
                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-black text-warmOrange">₹{String(order.total).replace(/[₹$,]/g, '')}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 font-serif border-b border-gray-50 pb-2">Delivery Details</h3>
                <div className="bg-peach-50/50 p-6 rounded-3xl border border-peach-100 mb-8">
                  <div className="flex items-start space-x-3 mb-6">
                    <div className="bg-white p-2 rounded-xl text-warmOrange shadow-sm">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Delivery Address</p>
                      <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                        {order.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-white p-2 rounded-xl text-warmOrange shadow-sm">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Order Date</p>
                      <p className="text-gray-600 text-xs mt-1 leading-relaxed">{order.date}</p>
                    </div>
                  </div>
                </div>

                {/* Patient Review Display */}
                {order.review && (
                  <div className="bg-white p-6 rounded-[2rem] border-2 border-warmOrange/10 shadow-xl animate-in slide-in-from-right duration-500 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                        <Star size={80} className="text-warmOrange fill-warmOrange" />
                     </div>
                     <div className="relative z-10">
                        <p className="text-[10px] font-black text-warmOrange uppercase tracking-[0.2em] mb-4">Your Feedback</p>
                        <div className="flex gap-1 mb-4">
                           {[1,2,3,4,5].map(s => (
                             <Star key={s} size={18} className={s <= order.review.rating ? 'text-warmOrange fill-warmOrange' : 'text-gray-200'} />
                           ))}
                        </div>
                        {order.review.comment && (
                           <div className="flex gap-3">
                              <MessageSquare size={16} className="text-gray-300 shrink-0 mt-1" />
                              <p className="text-gray-700 font-bold italic text-sm leading-relaxed">"{order.review.comment}"</p>
                           </div>
                        )}
                     </div>
                  </div>
                )}
              </div>
            </div>

            {/* Simulation Admin Panel (For Demo) */}
            <div className="mt-12 pt-8 border-t border-peach-100">
              <div className="bg-orange-50/50 p-8 rounded-[2rem] border border-orange-100 text-center">
                <h4 className="text-warmOrange font-black text-xs uppercase tracking-widest mb-6">Live Simulation Control</h4>
                <div className="flex flex-wrap justify-center gap-4">
                  {[
                    { label: 'Placed', value: 'pending' },
                    { label: 'Preparing', value: 'processing' },
                    { label: 'Out for Delivery', value: 'out_for_delivery' },
                    { label: 'Delivered', value: 'delivered' }
                  ].map(s => (
                    <button
                      key={s.value}
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem('userToken');
                          const res = await fetch(`http://localhost:5000/api/orders/${order.id}/status`, {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ status: s.value })
                          });
                          if (res.ok) {
                            setStatus(s.value);
                            if (s.value === 'delivered') setLiveEta(0);
                            else if (s.value === 'out_for_delivery') setLiveEta(Math.min(liveEta, 900)); 
                          }
                        } catch (err) {
                          console.error('Update failed:', err);
                        }
                      }}
                      className={`px-6 py-3 rounded-2xl text-xs font-black transition-all ${status === s.value ? 'bg-warmOrange text-white shadow-xl scale-105' : 'bg-white text-gray-500 border-2 border-gray-100 hover:border-warmOrange hover:text-warmOrange'}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* Auto Simulation Trigger */}
                <div className="mt-8">
                  <button
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem('userToken');
                        // 1. Reset to Placed (pending)
                        await fetch(`http://localhost:5000/api/orders/${order.id}/status`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                          body: JSON.stringify({ status: 'pending' })
                        });
                        setStatus('pending');
                        setLiveEta(1500); // 25m

                        // 2. Transition to Preparing (processing) après 3s
                        setTimeout(async () => {
                           await fetch(`http://localhost:5000/api/orders/${order.id}/status`, {
                             method: 'PUT',
                             headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                             body: JSON.stringify({ status: 'processing' })
                           });
                           setStatus('processing');
                        }, 3000);

                        // 3. Transition to Out for Delivery after 6s
                        setTimeout(async () => {
                           await fetch(`http://localhost:5000/api/orders/${order.id}/status`, {
                             method: 'PUT',
                             headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                             body: JSON.stringify({ status: 'out_for_delivery' })
                           });
                           setStatus('out_for_delivery');
                        }, 6000);

                        // 4. Final Transition to Delivered after 9s
                        setTimeout(async () => {
                          await fetch(`http://localhost:5000/api/orders/${order.id}/status`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                            body: JSON.stringify({ status: 'delivered' })
                          });
                          setStatus('delivered');
                          setLiveEta(0); // 0m
                       }, 12000); 

                      } catch (err) {
                        console.error('Simulation failed:', err);
                      }
                    }}
                    className="w-full py-4 rounded-2xl bg-gray-900 text-white font-black text-sm hover:bg-gray-800 transition-all flex items-center justify-center gap-3 shadow-xl transform active:scale-95"
                  >
                    <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping"></div>
                    Start Auto-Delivery Simulation
                  </button>
                </div>
                
                <p className="mt-4 text-[10px] text-gray-400 font-medium italic">Klik any status or use the Auto-Simulate button to see delivery in action!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal 
          orderId={order.id} 
          onCancel={() => setShowReviewModal(false)} 
          onSuccess={() => {
            setShowReviewModal(false);
            // Re-fetch data to show the review on page
            window.location.reload(); 
          }} 
        />
      )}

      {/* Real-time Order Chat */}
      {status !== 'delivered' && status !== 'cancelled' && (
        <OrderChat orderId={order.id} senderRole="customer" />
      )}
    </div>
  );
};

export default OrderDetail;
