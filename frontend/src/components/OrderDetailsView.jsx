import React, { useState } from 'react';
import { Phone, Navigation, X, IndianRupee, Package, Clock } from 'lucide-react';
import SwipeButton from './SwipeButton';

const OrderDetailsView = ({ order, onCancel, onUpdateStatus, isShiftStarted }) => {
  const [otp, setOtp] = useState('');
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-gray-900/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-300">
       <div className="w-full sm:max-w-xl bg-white rounded-t-[3rem] sm:rounded-[3rem] p-10 shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom duration-500 max-h-[90vh] overflow-y-auto no-scrollbar">
          
          <div className="flex justify-between items-start mb-8">
             <button onClick={onCancel} className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:bg-orange-50 hover:text-orange-500 transition-all shadow-sm"><X size={24} /></button>
             <div className="text-right">
                <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest italic">Order Details</span>
                <h3 className="text-2xl font-black italic font-serif tracking-tight">#{order._id.slice(-6).toUpperCase()}</h3>
             </div>
          </div>

          <div className="space-y-8">
             {/* Customer Segment */}
             <div className="flex items-center justify-between bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                <div className="flex items-center gap-5">
                   <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-orange-500 font-black text-xl">
                      {order.user?.name?.charAt(0) || 'C'}
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Premium Customer</p>
                      <p className="text-lg font-black italic font-serif">{order.user?.name || 'Anonymous'}</p>
                   </div>
                </div>
                <a href={`tel:${order.user?.phone}`} className="p-4 bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"><Phone size={24} fill="white" /></a>
             </div>

             {/* Address & Navigation */}
             <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Delivery Address</h4>
                   <button 
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.shippingAddress?.address)}`, '_blank')}
                      className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
                   >
                      <Navigation size={12} fill="currentColor" /> Open in Maps
                   </button>
                </div>
                <div className="p-6 bg-blue-50/30 rounded-[2rem] border border-blue-100/50">
                   <p className="text-sm font-bold text-gray-800 leading-relaxed">{order.shippingAddress?.address || 'Premium Customer Location'}</p>
                </div>
             </div>

             {/* Items List */}
             <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cargo Payload</h4>
                   <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-3 py-1 rounded-full">{order.orderItems?.length || 0} ITEMS</span>
                </div>
                <div className="divide-y divide-gray-100 bg-white border border-gray-100 rounded-[2rem] overflow-hidden">
                   {order.orderItems?.map((item, idx) => (
                      <div key={idx} className="p-6 flex justify-between items-center">
                         <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center font-black text-xs">{item.quantity}x</div>
                            <span className="text-sm font-bold text-gray-800">{item.name}</span>
                         </div>
                         <span className="text-xs font-black text-gray-400 italic">₹{item.price}</span>
                      </div>
                   ))}
                </div>
             </div>

             {/* Financial Summary */}
             <div className="card-rider !p-8 bg-gray-900 text-white space-y-6">
                <div className="flex justify-between items-center opacity-60">
                   <span className="text-[10px] font-black uppercase tracking-widest">Payment Method</span>
                   <span className="text-[10px] font-black uppercase tracking-widest">{order.paymentMethod || 'Prepaid'}</span>
                </div>
                <div className="flex justify-between items-end">
                   <div className="space-y-1">
                      <p className="text-[12px] font-black uppercase tracking-[0.3em] text-orange-400">To be Collected</p>
                      <h2 className="text-4xl font-black italic font-serif">₹{order.totalPrice}</h2>
                   </div>
                   <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><IndianRupee size={24} /></div>
                </div>
             </div>

             {/* Actions */}
             {isShiftStarted && (
                <div className="space-y-4 pt-4">
                   {order.status === 'ready_for_pickup' && (
                      <SwipeButton label="Swipe to Confirm Pickup" onSwipe={() => onUpdateStatus('out_for_delivery')} color="bg-orange-600" />
                   )}
                   {order.status === 'out_for_delivery' && (
                      <div className="space-y-6">
                         <div className="bg-gray-50 p-6 rounded-[2rem] border-2 border-dashed border-gray-200">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mb-4 text-orange-500">Enter 4-Digit Handover Pin</label>
                            <input 
                               type="number" 
                               max="9999"
                               value={otp}
                               onChange={(e) => setOtp(e.target.value.slice(0, 4))}
                               placeholder="----"
                               className="w-full bg-white border-2 border-gray-100 rounded-2xl py-5 text-center text-4xl font-black tracking-[0.5em] text-gray-800 outline-none focus:border-orange-500 transition-all font-serif"
                            />
                         </div>
                         <SwipeButton 
                            label="Swipe to Deliver" 
                            onSwipe={() => onUpdateStatus('delivered', otp)} 
                            color={otp.length === 4 ? "bg-green-600" : "bg-gray-300 opacity-50 cursor-not-allowed"} 
                         />
                         <button onClick={() => onUpdateStatus('cancelled')} className="w-full py-4 text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 rounded-2xl hover:bg-red-500 hover:text-white transition-all">Order Not Delivered</button>
                      </div>
                   )}
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default OrderDetailsView;
