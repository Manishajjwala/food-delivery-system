import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, LayoutDashboard, Bike, Gift, Wallet, 
  Wifi, Battery, ShieldAlert, Navigation2, Zap, 
  PhoneCall, Package, CheckCircle, Flame, Signal, ChevronRight
} from 'lucide-react';
import { io } from 'socket.io-client';
import SwipeButton from '../components/SwipeButton';
import OTPModal from '../components/OTPModal';
import RiderMap from '../components/RiderMap';

const API_BASE = 'food-delivery-system-xb0m.onrender.com/api/delivery';

const RiderHome = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [assignedOrder, setAssignedOrder] = useState(null);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [socket, setSocket] = useState(null);
  const [riderLocation, setRiderLocation] = useState(null);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const alertAudio = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'));

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${API_BASE}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAssignedOrder(data.assigned);
        setAvailableOrders(data.available);
        
        if (data.available.length > 0 && isOnline) {
          alertAudio.current.play().catch(() => {});
        }
      }
    } catch (err) { console.error("Sync error", err); }
    finally { setLoading(false); }
  }, [isOnline]);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) { navigate('/rider/login'); return; }

    fetchOrders();
    const newSocket = io('food-delivery-system-xb0m.onrender.com');
    setSocket(newSocket);
    newSocket.emit('joinOrder', 'rider_hub');
    
    // Listen for new orders or status updates to refresh the available list
    newSocket.on('ORDER_CREATED', () => fetchOrders());
    newSocket.on('ORDER_STATUS_UPDATED', () => fetchOrders());
    newSocket.on('RIDER_ASSIGNED', () => fetchOrders());
    
    return () => newSocket.disconnect();
  }, [fetchOrders, navigate]);

  useEffect(() => {
    if (!isOnline) return;
    let lastPulse = 0;
    const PULSE_INTERVAL = 5000; // 5 seconds throttle

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const now = Date.now();
        const location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setRiderLocation(location);

        // Throttle Socket.io emissions
        if (socket && assignedOrder && now - lastPulse > PULSE_INTERVAL) {
          socket.emit('updateLocation', { 
            orderId: assignedOrder._id, 
            location 
          });
          lastPulse = now;
        }
      },
      (err) => console.warn('[Logistics] Telemetry Error:', err),
      { enableHighAccuracy: true, maximumAge: 10000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [isOnline, socket, assignedOrder]);

  const updateStatus = async (status) => {
    if (status === 'delivered') { setShowOTPModal(true); return; }
    try {
      const res = await fetch(`${API_BASE}/order/status/${assignedOrder._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('userToken')}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchOrders();
    } catch (err) { console.error('Status fail'); }
  };

  const toggleOnline = () => {
    setIsOnline(!isOnline);
    if (navigator.vibrate) navigator.vibrate(100);
  };

  if (loading) return (
     <div className="min-h-screen bg-[#fdfcf0] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-warmOrange border-t-transparent rounded-full animate-spin"></div>
     </div>
  );

  return (
    <div className="min-h-screen bg-[#fdfcf0] text-gray-900 font-sans overflow-x-hidden pb-24 selection:bg-warmOrange/10">
      
      {/* Premium Header HUD */}
      <div className="p-6 flex items-center justify-between border-b border-warmOrange/10 bg-white/95 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
         <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full animate-pulse shadow-lg ${isOnline ? 'bg-green-500 shadow-green-500/20' : 'bg-red-500 shadow-red-500/20'}`}></div>
            <div>
               <h1 className="text-xl font-black uppercase tracking-tighter text-gray-900">Partner Hub</h1>
               <p className="text-[10px] font-black text-warmOrange uppercase tracking-widest mt-0.5">
                  {isOnline ? 'On Duty' : 'Off Duty'}
               </p>
            </div>
         </div>
         
         <div className="flex items-center gap-4">
            <button 
              onClick={toggleOnline}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${isOnline ? 'bg-green-50 border-green-500 text-green-500' : 'bg-red-50 border-red-500 text-red-500'}`}
            >
              {isOnline ? 'Online' : 'Offline'}
            </button>
         </div>
      </div>

      <div className="p-6 space-y-8 max-w-lg mx-auto">
         
         {/* Live Mission Area */}
         {isOnline && (
           <div className="h-[400px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-warmOrange/5 relative group border-4 border-white">
              <RiderMap 
                riderLocation={riderLocation}
                destination={assignedOrder ? { lat: 23.1298, lng: 72.5448 } : null}
              />
              {!assignedOrder && (
                <div className="absolute inset-0 bg-[#fdfcf0]/60 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center overflow-hidden">
                   {/* Radar Sweep Effect */}
                   <div className="relative w-64 h-64 mb-10">
                      <div className="absolute inset-0 border-2 border-warmOrange/10 rounded-full"></div>
                      <div className="absolute inset-8 border border-warmOrange/10 rounded-full"></div>
                      <div className="absolute inset-16 border border-warmOrange/10 rounded-full"></div>
                      
                      {/* Rotating Sweep */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-warmOrange/20 to-transparent animate-spin-slow origin-center"></div>
                      
                      {/* Pulse Center */}
                      <div className="absolute inset-[112px] bg-warmOrange rounded-full shadow-[0_0_30px_#ff6b35] flex items-center justify-center text-white z-10 animate-pulse">
                         <Zap size={24} />
                      </div>

                      {/* Simulated Pings */}
                      <div className="absolute top-10 right-12 w-2 h-2 bg-warmOrange rounded-full animate-ping"></div>
                      <div className="absolute bottom-12 left-10 w-2 h-2 bg-warmOrange/40 rounded-full animate-ping delay-700"></div>
                   </div>

                   <h3 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Finding Orders</h3>
                   <div className="inline-flex items-center gap-2 bg-warmOrange/10 px-4 py-1.5 rounded-full mt-4 border border-warmOrange/10">
                      <div className="w-2 h-2 bg-warmOrange rounded-full animate-pulse"></div>
                      <p className="text-gray-900 text-[10px] font-black uppercase tracking-widest leading-none">
                         Scanning for nearby orders...
                      </p>
                   </div>
                   <p className="text-gray-600 text-[10px] font-bold mt-4 uppercase tracking-[0.2em] max-w-[200px]">
                      Stay in high-demand areas for faster assignments.
                   </p>
                </div>
              )}
           </div>
         )}

         {/* Assigned Mission Card */}
         {assignedOrder && (
            <div className="bg-white rounded-[2.5rem] p-8 border border-warmOrange/5 relative overflow-hidden group shadow-2xl shadow-warmOrange/5 animate-in slide-in-from-bottom duration-500">
               <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                  <Flame size={80} className="text-warmOrange" />
               </div>
               
               <div className="flex justify-between items-start relative z-10 mb-8 pb-8 border-b border-gray-100">
                  <div className="space-y-4">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-warmOrange">Current Mission</p>
                        <h2 className="text-3xl font-black text-gray-900 mt-1">#{assignedOrder._id.slice(-6).toUpperCase()}</h2>
                     </div>
                     <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-xl w-fit">
                        <Package size={16} className="text-warmOrange" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">
                           {assignedOrder.orderItems.length} Items - {assignedOrder.status.replace(/_/g, ' ')}
                        </span>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-3xl font-black text-warmOrange">₹{assignedOrder.totalPrice}</p>
                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mt-1 flex items-center justify-end gap-1"><Wallet size={10} /> Payout</p>
                  </div>
               </div>

               <div className="space-y-6 mb-10">
                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 bg-warmOrange/10 rounded-xl flex items-center justify-center text-warmOrange">
                        <Navigation2 size={20} />
                     </div>
                     <div className="flex-grow">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Pick-up Location</p>
                        <p className="text-sm font-bold text-gray-800 mt-0.5 leading-relaxed">
                           {assignedOrder.shippingAddress.address}
                        </p>
                     </div>
                     <a href={`tel:${assignedOrder.user.phone}`} className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-500 active:scale-90 transition-all border border-green-100">
                        <PhoneCall size={18} />
                     </a>
                  </div>
               </div>

               {assignedOrder.status === 'packed' || assignedOrder.status === 'ready_for_pickup' ? (
                  <SwipeButton 
                    text="Swipe to Pick Up" 
                    onConfirm={() => updateStatus('out_for_delivery')} 
                  />
               ) : (
                  <SwipeButton 
                    text="Swipe to Deliver" 
                    onConfirm={() => updateStatus('delivered')} 
                    color="bg-green-500"
                  />
               )}
            </div>
         )}

         {/* Available Missions Pool */}
         {!assignedOrder && availableOrders.length > 0 && (
            <div className="space-y-4">
               <div className="flex items-center justify-between px-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 italic">Available Orders ({availableOrders.length})</p>
               </div>
               <div className="grid gap-4">
                  {availableOrders.map(order => (
                     <div key={order._id} className="bg-white p-6 rounded-3xl border border-warmOrange/5 flex items-center justify-between group active:scale-[0.98] transition-all shadow-xl shadow-warmOrange/5">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-warmOrange group-hover:bg-warmOrange group-hover:text-white transition-colors border border-gray-100">
                              <LayoutDashboard size={20} />
                           </div>
                           <div>
                              <p className="text-xs font-black text-gray-900">#{order._id.slice(-6).toUpperCase()}</p>
                              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-0.5">3.2km away</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <p className="text-lg font-black text-gray-900">₹{order.totalPrice}</p>
                           <button 
                             onClick={async () => {
                                try {
                                  const res = await fetch(`${API_BASE}/order/accept/${order._id}`, {
                                    method: 'PUT',
                                    headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
                                  });
                                  if (res.ok) fetchOrders();
                                } catch (e) {}
                             }}
                             className="w-10 h-10 bg-warmOrange/10 text-warmOrange rounded-xl flex items-center justify-center hover:bg-warmOrange hover:text-white transition-all shadow-lg border border-warmOrange/10"
                           >
                              <ChevronRight size={20} />
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}

      </div>

      {/* Global Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-4 z-40">
         <div className="max-w-md mx-auto grid grid-cols-4 gap-2">
            <button 
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center py-2 rounded-2xl transition-all ${activeTab === 'home' ? 'text-warmOrange bg-warmOrange/5' : 'text-gray-400 hover:text-gray-600'}`}
            >
               <LayoutDashboard size={20} />
               <span className="text-[8px] font-black uppercase tracking-widest mt-1">Status</span>
            </button>
            <button 
              onClick={() => navigate('/rider/earnings')}
              className={`flex flex-col items-center py-2 rounded-2xl transition-all ${activeTab === 'earnings' ? 'text-warmOrange bg-warmOrange/5' : 'text-gray-500 hover:text-gray-700'}`}
            >
               <Wallet size={20} />
               <span className="text-[8px] font-black uppercase tracking-widest mt-1">Earnings</span>
            </button>
            <button 
              onClick={() => {
                if (window.confirm("IN_DANGER: Initiate Emergency SOS Protocol?")) {
                  window.location.href = "tel:112";
                }
              }}
              className={`flex flex-col items-center py-2 rounded-2xl transition-all text-red-500 hover:bg-red-50 active:scale-95`}
            >
               <ShieldAlert size={20} />
               <span className="text-[8px] font-black uppercase tracking-widest mt-1">SOS</span>
            </button>
            <button 
              onClick={() => navigate('/rider/profile')}
              className={`flex flex-col items-center py-2 rounded-2xl transition-all ${activeTab === 'settings' ? 'text-warmOrange bg-warmOrange/5' : 'text-gray-500 hover:text-gray-700'}`}
            >
               <Zap size={20} />
               <span className="text-[8px] font-black uppercase tracking-widest mt-1">Profile</span>
            </button>
         </div>
      </div>

      {/* Handover Pin Authorization Modal */}
      {showOTPModal && (
        <OTPModal 
          orderId={assignedOrder._id}
          onCancel={() => setShowOTPModal(false)}
          onConfirm={() => { setShowOTPModal(false); fetchOrders(); }}
        />
      )}

    </div>
  );
};

export default RiderHome;
