import React, { useState } from 'react';
import { Package, MapPin, ChevronDown, ChevronUp, Navigation } from 'lucide-react';

const OrderCard = ({ order, onShowMore }) => {
  const [expanded, setExpanded] = useState(false);

  if (!order) return null;

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl space-y-6 relative overflow-hidden animate-in slide-in-from-bottom duration-500">
      
      {/* Small Identification Strip */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black italic font-serif text-gray-900 leading-tight">#{order._id.slice(-4).toUpperCase()}</h3>
            <span className="text-gray-400 font-bold text-xs">{order.user?.name || 'Customer'}</span>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount to be Collected: <span className="text-gray-900 italic font-black">₹{order.totalPrice}</span></p>
        </div>
        <div className="text-right">
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Items: {order.orderItems?.length || 0}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-4 p-5 bg-gray-50/50 rounded-2xl border border-gray-100 relative group">
           <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 shrink-0 shadow-sm">
              <MapPin size={20} className="text-red-500" />
           </div>
           <div className="flex-1 min-w-0">
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none italic">Address:</p>
              <p className="font-bold text-xs text-gray-800 leading-tight pr-6">{order.shippingAddress?.address || 'Premium Customer Location'}</p>
              <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest mt-1">Sector 18, Noida - 201301</p>
           </div>
        </div>
      </div>

      <div className="flex gap-4 pt-2">
         <button 
           onClick={() => { setExpanded(!expanded); onShowMore && onShowMore(order._id); }}
           className="flex-1 py-4 border border-blue-600 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all text-center leading-none"
         >
           Show more
         </button>
         <button className="w-16 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center border border-green-200 shadow-inner group hover:bg-green-600 hover:text-white transition-all">
            <Navigation size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
         </button>
      </div>

      {expanded && (
        <div className="pt-6 border-t border-gray-50 grid grid-cols-2 gap-6 animate-in fade-in duration-300">
           <div className="space-y-1">
              <p className="text-[8px] font-black text-gray-400 uppercase">Items Payload</p>
              <div className="space-y-0.5">
                 {order.orderItems?.map((item, idx) => (
                    <p key={idx} className="text-[10px] font-bold text-gray-800 leading-none truncate">{item.quantity} x {item.name}</p>
                 ))}
              </div>
           </div>
           <div className="space-y-1 text-right">
              <p className="text-[8px] font-black text-gray-400 uppercase">Ordered At</p>
              <p className="text-[10px] font-bold text-gray-800">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
           </div>
        </div>
      )}

    </div>
  );
};

export default OrderCard;
