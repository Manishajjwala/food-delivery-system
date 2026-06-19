import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Calendar, ChevronRight, Award, ArrowUpRight } from 'lucide-react';

const EarningsView = () => {
  const [activeTab, setActiveTab] = useState('payout');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await fetch('food-delivery-system-xb0m.onrender.com/api/delivery/earnings', {
          headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
        });
        if (res.ok) setData(await res.json());
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchEarnings();
  }, []);

  if (loading) return <div className="p-10 text-center opacity-30 animate-pulse font-black uppercase tracking-widest text-xs">Auditing Accounts...</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-700">
      
      {/* Finance Summary Header */}
      <div className="text-center space-y-2">
         <h2 className="text-2xl font-black italic font-serif text-gray-900 tracking-tight leading-none underline decoration-warmOrange/30 decoration-8 underline-offset-8">Finance Terminal</h2>
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Live Revenue & Incentives Feed</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-orange-50/50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-warmOrange/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        <div className="relative z-10 flex justify-between items-start">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                   <Wallet size={18} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total {activeTab === 'payout' ? 'Payout' : 'Incentives'}</p>
             </div>
             <h2 className="text-5xl font-black italic font-serif text-gray-900 tracking-tighter">₹{activeTab === 'payout' ? data?.totalPayout : data?.totalIncentives}</h2>
          </div>
          <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-warmOrange shadow-inner">
             {activeTab === 'payout' ? <ArrowUpRight size={28} /> : <Award size={28} />}
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex p-1.5 bg-gray-100 rounded-2xl gap-1">
        <button 
          onClick={() => setActiveTab('payout')}
          className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'payout' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Payout
        </button>
        <button 
          onClick={() => setActiveTab('incentives')}
          className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'incentives' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Incentives
        </button>
      </div>

      {/* Structured Stats Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
         <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Activity Report</span>
            <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-md border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 transition-all">
               <Calendar size={12} className="text-gray-400" />
               <span className="text-[8px] font-black uppercase text-gray-600 italic">Current Month</span>
            </div>
         </div>
         
         {/* Simple Table Style Layout */}
         <div className="w-full">
            <div className="grid grid-cols-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-[8px] font-black text-gray-400 uppercase tracking-widest italic">
               <div>Date</div>
               <div className="text-center">Protocols</div>
               <div className="text-center">Hours</div>
               <div className="text-right">Payout</div>
            </div>
            <div className="divide-y divide-gray-50">
               {data?.dailyStats?.map((day, idx) => (
                  <div key={idx} className="grid grid-cols-4 px-6 py-5 items-center hover:bg-orange-50/30 transition-all group">
                     <div className="text-[10px] font-black text-gray-500 uppercase">{day.day.slice(0, 5)}</div>
                     <div className="text-center text-xs font-bold text-gray-700">{day.count}</div>
                     <div className="text-center text-xs font-bold text-gray-700">4.0</div>
                     <div className="text-right text-xs font-black text-green-600 italic">₹{day.earnings}</div>
                  </div>
               ))}
            </div>
            <div className="grid grid-cols-4 px-6 py-5 bg-gray-900 text-white font-black italic tracking-tighter">
               <div className="text-[10px] font-black uppercase tracking-widest">Total</div>
               <div className="text-center text-lg">{data?.totalDeliveries}</div>
               <div className="text-center text-lg">24.0</div>
               <div className="text-right text-lg text-green-400">₹{data?.totalPayout}</div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default EarningsView;
