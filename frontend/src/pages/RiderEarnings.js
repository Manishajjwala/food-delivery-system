import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Wallet, TrendingUp, Calendar, 
  MapPin, Clock, Star, Download, ChevronRight,
  TrendingDown, DollarSign, Activity, CheckCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RiderEarnings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    walletBalance: 2450,
    totalDeliveries: 124,
    rating: 4.8,
    todayEarnings: 840,
    weeklyData: [
      { day: 'Mon', earnings: 450 },
      { day: 'Tue', earnings: 620 },
      { day: 'Wed', earnings: 380 },
      { day: 'Thu', earnings: 710 },
      { day: 'Fri', earnings: 840 },
      { day: 'Sat', earnings: 1100 },
      { day: 'Sun', earnings: 590 },
    ]
  });

  useEffect(() => {
    setTimeout(() => { setLoading(false); }, 800);
  }, []);

  if (loading) return (
     <div className="min-h-screen bg-[#fdfcf0] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-warmOrange border-t-transparent rounded-full animate-spin"></div>
     </div>
  );

  return (
    <div className="min-h-screen bg-[#fdfcf0] text-gray-900 font-sans p-6 pb-24">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
         <button 
           onClick={() => navigate('/rider')}
           className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-all active:scale-90 shadow-sm border border-gray-100/50"
         >
            <ArrowLeft size={20} />
         </button>
         <h1 className="text-xl font-black uppercase tracking-widest text-gray-900">Earnings Dashboard</h1>
         <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-all text-warmOrange shadow-sm border border-gray-100/50">
            <Download size={20} />
         </button>
      </div>

      <div className="space-y-8 max-w-lg mx-auto">
         
         {/* Balance Card */}
         <div className="bg-white p-8 rounded-[2.5rem] border border-warmOrange/10 shadow-2xl shadow-warmOrange/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
               <Wallet size={120} className="text-warmOrange" />
            </div>
            
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-warmOrange mb-2">Available Balance</p>
            <div className="flex items-baseline gap-2">
               <span className="text-5xl font-black tracking-tight text-gray-900">₹{stats.walletBalance}</span>
               <span className="text-green-500 text-xs font-black uppercase tracking-widest flex items-center gap-1">
                  <TrendingUp size={14} /> +12%
               </span>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
               <button className="bg-warmOrange text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-warmOrange/20 transition-all active:scale-[0.98] hover:bg-orange-600">
                  Withdrawal
               </button>
               <button className="bg-gray-50 text-gray-500 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-gray-100 transition-all active:scale-[0.98] hover:bg-gray-100">
                  History
               </button>
            </div>
         </div>

         {/* Mini Stats Grid */}
         <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-gray-50 text-center shadow-sm">
               <span className="text-warmOrange block mb-2 mx-auto"><Activity size={20} className="mx-auto" /></span>
               <p className="text-lg font-black text-gray-900">{stats.totalDeliveries}</p>
               <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-1">Deliveries</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-gray-50 text-center shadow-sm">
               <span className="text-yellow-500 block mb-2 mx-auto"><Star size={20} className="mx-auto" /></span>
               <p className="text-lg font-black text-gray-900">{stats.rating}</p>
               <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Rating</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-gray-50 text-center shadow-sm">
               <span className="text-green-500 block mb-2 mx-auto"><TrendingUp size={20} className="mx-auto" /></span>
               <p className="text-lg font-black text-gray-900">₹{stats.todayEarnings}</p>
               <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-1">Today</p>
            </div>
         </div>

         {/* Weekly Performance Chart */}
         <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-xl shadow-warmOrange/5">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Weekly Growth</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">Revenue Analytics</p>
               </div>
               <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 flex items-center gap-2">
                  <Calendar size={14} className="text-warmOrange" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Oct 20-27</span>
               </div>
            </div>

            <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.weeklyData}>
                     <defs>
                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#ff6b35" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 900 }}
                     />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '10px', boxShadow: '0 10px 30px rgba(255, 107, 53, 0.1)' }}
                        itemStyle={{ color: '#ff6b35', fontWeight: 900 }}
                     />
                     <Area 
                        type="monotone" 
                        dataKey="earnings" 
                        stroke="#ff6b35" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorEarnings)" 
                     />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Recent Transaction Pool */}
         <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Recent Payouts</h3>
            <div className="space-y-4">
               {[
                 { title: 'Base Delivery Pay', time: '14:20', amount: '+ ₹40.00', icon: <DollarSign size={16} /> },
                 { title: 'Surge Incentive', time: '13:05', amount: '+ ₹15.00', icon: <TrendingUp size={16} /> },
                 { title: 'Security Handover Bonus', time: '11:45', amount: '+ ₹10.00', icon: <CheckCircle size={16} /> }
               ].map((tx, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-50 flex items-center justify-between group shadow-sm transition-all hover:shadow-md">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-warmOrange italic font-black transition-colors group-hover:bg-warmOrange group-hover:text-white">
                           {tx.icon}
                        </div>
                        <div>
                           <p className="text-xs font-black text-gray-900 leading-tight">{tx.title}</p>
                           <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mt-1 flex items-center gap-2">
                              <Clock size={10} /> {tx.time} Today
                           </p>
                        </div>
                     </div>
                     <p className="text-sm font-black text-green-500">{tx.amount}</p>
                  </div>
               ))}
            </div>
         </div>

      </div>
    </div>
  );
};

export default RiderEarnings;
