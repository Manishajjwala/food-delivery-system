import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, LayoutDashboard, ChevronRight, Bike, Gift, 
  Wifi, Battery, ShieldAlert, Navigation2, Zap
} from 'lucide-react';
import SwipeButton from '../components/SwipeButton';
import OrderCard from '../components/OrderCard';
import EarningsView from '../components/EarningsView';
import ReferralView from '../components/ReferralView';
import ProfileView from '../components/ProfileView';
import BottomNav from '../components/BottomNav';
import OrderDetailsView from '../components/OrderDetailsView';
import { io } from 'socket.io-client';

const API_BASE = 'http://localhost:5000/api/delivery';

const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [assignedOrder, setAssignedOrder] = useState(null);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [riderProfile, setRiderProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [isShiftStarted, setIsShiftStarted] = useState(false);
  const [socket, setSocket] = useState(null);

  const riderName = localStorage.getItem('userName') || 'Logistics Pilot';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/delivery/login');
  };

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
      } else if (res.status === 401) {
        navigate('/delivery/login');
      }
    } catch (err) { console.error("Sync error", err); }
    finally { setLoading(false); }
  }, [navigate]);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
      });
      if (res.ok) setRiderProfile(await res.json());
    } catch (err) { console.error('Profile fetch failed'); }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchProfile();
    const interval = setInterval(() => {
        fetchOrders();
        fetchProfile();
    }, 30000); 
    
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
    
    newSocket.on('connect', () => console.log("Connectivity active"));
    newSocket.on('newOrder', () => fetchOrders());

    return () => {
        clearInterval(interval);
        newSocket.disconnect();
    };
  }, [fetchOrders]);

  const handleStartShift = () => {
    setIsShiftStarted(true);
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    audio.play().catch(() => {});

    // Live Tracking Initiation
    if (navigator.geolocation) {
       navigator.geolocation.watchPosition(
          (pos) => {
             const location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
             if (socket && assignedOrder) {
                socket.emit('updateLocation', { 
                   orderId: assignedOrder._id, 
                   location 
                });
             }
             // Persist locally for session continuity
             localStorage.setItem('riderLat', pos.coords.latitude);
             localStorage.setItem('riderLng', pos.coords.longitude);
          },
          (err) => console.error("Telemetry failure", err),
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
       );
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
       const res = await fetch(`${API_BASE}/order/accept/${orderId}`, {
          method: 'PUT',
          headers: { 
             'Content-Type': 'application/json',
             Authorization: `Bearer ${localStorage.getItem('userToken')}` 
          }
       });
       if (res.ok) {
          fetchOrders();
          fetchProfile();
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
          audio.play().catch(() => {});
       }
    } catch (err) { console.error('Accept fail', err); }
  };

  const handleUpdateStatus = async (status, otp = null) => {
     if (!assignedOrder) return;
     try {
        const res = await fetch(`${API_BASE}/order/status/${assignedOrder._id}`, {
           method: 'PUT',
           headers: { 
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('userToken')}` 
           },
           body: JSON.stringify({ status, otp })
        });
        const data = await res.json();
        if (res.ok) {
           fetchOrders();
           setSelectedOrder(null);
           if (status === 'delivered') {
              const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
              audio.play().catch(() => {});
           }
        } else {
           alert(data.message || 'Verification failed');
        }
     } catch (err) {
        console.error('Terminal sync error', err);
     }
  };

  if (loading) return (
     <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-10 h-10 border-4 border-warmOrange/20 border-t-warmOrange rounded-full animate-spin"></div>
     </div>
  );

  return (
    <div className={`min-h-screen bg-black flex flex-col font-sans transition-colors duration-700 relative overflow-hidden text-white`}>
      
      {/* 1. ULTRA-PREMIUM SYSTEM HEADER */}
      <div className="sticky top-0 z-[100] w-full px-8 pt-10 pb-6 flex justify-between items-end animate-in fade-in duration-1000">
         <div className="space-y-1">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 signal-online rounded-full animate-signal"></div>
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Terminal Link Active</span>
            </div>
            <h1 className="text-3xl font-black italic font-serif text-glow-orange leading-none tracking-tighter">MISSION CONTROL</h1>
         </div>
         <div className="flex gap-4 items-center mb-1">
            <div className="flex flex-col items-end">
               <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Battery</span>
               <div className="flex items-center gap-1 text-green-400">
                  <span className="text-[10px] font-bold italic">88%</span>
                  <Battery size={14} />
               </div>
            </div>
            <div className="w-[1px] h-6 bg-white/10"></div>
            <div className="flex flex-col items-end">
               <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Signal</span>
               <div className="flex items-center gap-1 text-blue-400">
                  <span className="text-[10px] font-bold italic">LTE</span>
                  <Wifi size={14} />
               </div>
            </div>
         </div>
      </div>

      <main className="flex-1 bg-cream rounded-t-[3.5rem] pb-32 overflow-hidden shadow-[0_-20px_60px_rgba(0,0,0,0.5)] relative z-10 animate-in slide-in-from-bottom duration-1000">
         
         <div className="max-w-md mx-auto p-8 space-y-10">
            {activeTab === 'home' && (
               <div className="space-y-10 animate-in fade-in duration-500">
                  
                  {/* Rider Context Row */}
                  <div className="flex justify-between items-center px-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-warmOrange rounded-xl flex items-center justify-center text-white shadow-lg -rotate-3 transition-transform hover:rotate-0">
                           <LayoutDashboard size={20} />
                        </div>
                        <h2 className="text-xl font-black italic font-serif text-gray-900 leading-none tracking-tight underline decoration-warmOrange/30 decoration-4 underline-offset-4">Hi, {riderName}!</h2>
                     </div>
                     <button className="relative w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center border border-gray-100 group active:scale-95 transition-all">
                        <Bell size={24} className="text-gray-400 group-hover:text-warmOrange group-hover:rotate-12 transition-all" />
                        <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
                     </button>
                  </div>

                  {/* Ongoing Shift Card */}
                  <section className="space-y-4 px-2">
                     <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 italic">Sector: Rohini Sec 3</h3>
                     <div className="bg-white border-2 border-dashed border-gray-100 rounded-[2rem] p-6 space-y-4 shadow-sm hover:border-warmOrange/20 transition-all">
                        <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-xl">
                           <div className="space-y-1">
                              <p className="text-[8px] font-black text-gray-400 uppercase leading-none italic">Active Period</p>
                              <h4 className="text-sm font-black text-gray-800 leading-none italic tracking-tighter">11:00 AM – 03:00 PM</h4>
                           </div>
                           <div className="px-3 py-1 bg-orange-100 text-orange-600 rounded-md text-[8px] font-black uppercase">4 Hours Shift</div>
                        </div>
                     </div>
                  </section>

                  {/* Referral Promo Card */}
                  <section className="px-2">
                     <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-8 text-white relative overflow-hidden group shadow-2xl transition-all hover:scale-[1.02] cursor-pointer">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-warmOrange/20 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                        <div className="relative z-10 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-orange-400">
                                 <Gift size={24} />
                              </div>
                              <div className="space-y-0.5">
                                 <h4 className="text-sm font-black italic font-serif leading-none tracking-tight">Refer your friends &</h4>
                                 <h2 className="text-xl font-black italic font-serif leading-none tracking-tight text-warmOrange">Earn up to ₹75,000!</h2>
                              </div>
                           </div>
                           <ChevronRight size={20} className="text-white/20" />
                        </div>
                     </div>
                  </section>

                  {/* Mission Activity */}
                  <section className="space-y-6">
                     <div className="px-4">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{assignedOrder ? 'Active Mission' : 'Available Missions'}</h3>
                     </div>

                     {assignedOrder ? (
                        <OrderCard order={assignedOrder} onShowMore={() => setSelectedOrder(assignedOrder)} />
                     ) : (
                        <div className="space-y-4 px-2">
                           {availableOrders.length > 0 ? (
                              availableOrders.map(order => (
                                 <div key={order._id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-warmOrange/30 transition-all">
                                    <div className="flex gap-4 items-center">
                                       <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center font-black italic">#{order._id.slice(-4).toUpperCase()}</div>
                                       <div>
                                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{order.orderItems?.length || 0} Items • ₹{order.totalPrice}</p>
                                          <p className="text-sm font-black italic font-serif text-gray-800">{order.shippingAddress?.address?.split(',')[0] || 'Sector Address'}</p>
                                       </div>
                                    </div>
                                    <button 
                                       onClick={() => handleAcceptOrder(order._id)}
                                       className="p-3 bg-warmOrange text-white rounded-xl shadow-lg shadow-warmOrange/20 active:scale-95 transition-all"
                                    >
                                       <ChevronRight size={20} />
                                    </button>
                                 </div>
                              ))
                           ) : (
                              <div className="bg-white/50 border-4 border-dashed border-gray-100 rounded-[3rem] p-16 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden group">
                                 
                                 {/* RADAR SCAN ANIMATION */}
                                 <div className="relative w-32 h-32 flex items-center justify-center">
                                    <div className="absolute inset-0 border-2 border-warmOrange/10 rounded-full"></div>
                                    <div className="absolute inset-4 border-2 border-warmOrange/20 rounded-full"></div>
                                    <div className="absolute inset-8 border-2 border-warmOrange/30 rounded-full"></div>
                                    <div className="absolute top-1/2 left-1/2 w-full h-1 bg-gradient-to-r from-warmOrange/0 to-warmOrange/60 origin-left animate-radar -translate-y-1/2"></div>
                                    <div className="relative z-10 w-16 h-16 bg-warmOrange/5 rounded-2xl flex items-center justify-center text-warmOrange">
                                       <Navigation2 size={32} className="animate-signal" fill="currentColor" />
                                    </div>
                                 </div>

                                 <div className="space-y-1 relative z-10">
                                    <p className="text-[10px] font-black text-warmOrange uppercase tracking-[0.4em] animate-pulse">Scanning Sector...</p>
                                    <p className="text-[8px] font-bold text-gray-300 uppercase italic leading-none">Awaiting Link To Ready Missions</p>
                                 </div>

                              </div>
                           )}
                        </div>
                     )}
                  </section>

                  {/* Contextual Action Button */}
                  <div className="pt-8 px-2 animate-in slide-in-from-bottom duration-1000 delay-500">
                     {!isShiftStarted && (
                        <SwipeButton label="Swipe to Start Bike" onSwipe={handleStartShift} color="bg-green-600 shadow-[0_15px_35px_rgba(22,163,74,0.3)] transition-all" />
                     )}

                     {isShiftStarted && assignedOrder && assignedOrder.status === 'ready_for_pickup' && (
                        <SwipeButton label="Initiate Mission" onSwipe={() => handleUpdateStatus('out_for_delivery')} color="bg-warmOrange shadow-[0_15px_35px_rgba(255,107,53,0.3)]" />
                     )}

                     {isShiftStarted && assignedOrder && assignedOrder.status === 'out_for_delivery' && (
                        <SwipeButton label="Swipe to mark as delivered!" onSwipe={() => handleUpdateStatus('delivered')} color="bg-blue-600 shadow-[0_15px_35px_rgba(37,99,235,0.3)]" />
                     )}
                  </div>

               </div>
            )}

            {activeTab === 'wallet' && <EarningsView />}
            {activeTab === 'referral' && <ReferralView />}
            {activeTab === 'profile' && <ProfileView user={riderProfile} onLogout={handleLogout} />}

            {selectedOrder && (
               <OrderDetailsView 
                  order={selectedOrder} 
                  onCancel={() => setSelectedOrder(null)} 
                  onUpdateStatus={handleUpdateStatus}
                  isShiftStarted={isShiftStarted}
               />
            )}

         </div>
      </main>

      {/* Bottom Interface */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-6 bg-cream/90 backdrop-blur-md">
         <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

    </div>
  );
};

export default DeliveryDashboard;
