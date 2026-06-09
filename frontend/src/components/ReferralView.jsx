import React from 'react';
import { Share2, Users, Gift, Copy, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';

const ReferralView = () => {
  const referralCode = "HUNGRY_RIDER_77";
  const referralLink = `https://hungry.com/join?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Referral terminal link copied!");
  };

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom duration-700 pb-10">
      
      {/* Referral Header */}
      <div className="text-center space-y-4">
         <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner relative overflow-hidden group">
            <Users size={32} className="group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-100/20 to-transparent rotate-45 animate-pulse"></div>
         </div>
         <div className="space-y-1 px-4">
            <h2 className="text-2xl font-black italic font-serif text-gray-900 leading-tight tracking-tight">Refer Your Friends & Earn Up To <span className="text-warmOrange underline decoration-4 decoration-warmOrange/20 underline-offset-4">₹75,000!</span></h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Build Your Network. Earn Collective Incentives.</p>
         </div>
      </div>

      {/* Referral Link Card */}
      <div className="bg-white rounded-[2.5rem] p-10 space-y-8 border-2 border-dashed border-gray-100 shadow-xl shadow-gray-100/50">
         <div className="space-y-3">
            <div className="flex items-center gap-3 p-5 bg-gray-50/80 rounded-2xl border border-gray-100 shadow-inner group">
               <input 
                  readOnly 
                  value={referralLink} 
                  className="flex-1 bg-transparent text-[10px] font-bold text-gray-400 outline-none truncate italic uppercase tracking-widest"
               />
               <button onClick={copyToClipboard} className="p-3 bg-white text-gray-600 border border-gray-100 rounded-xl hover:bg-warmOrange hover:text-white hover:border-warmOrange transition-all shadow-sm"><Copy size={16} /></button>
            </div>
         </div>
         <button className="w-full py-5 bg-warmOrange rounded-3xl font-black uppercase tracking-widest text-xs text-white shadow-xl shadow-warmOrange/30 active:scale-95 transition-all flex items-center justify-center gap-3">
            <Share2 size={18} /> Share Referral Link
         </button>
      </div>

      {/* Schemes Section */}
      <div className="space-y-6">
         <div className="px-6 flex justify-between items-center">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 italic font-serif leading-none">Available Schemes</h3>
            <span className="text-[10px] font-black underline text-warmOrange uppercase tracking-widest cursor-pointer">View All</span>
         </div>
         
         <div className="space-y-4">
            {[
              { title: 'Fleet Booster', desc: 'Get ₹500 for every rider who completes 100 missions.', status: 'Active', color: 'text-warmOrange', bg: 'bg-orange-50' },
              { title: 'Special Rewards', desc: 'Exclusive incentives for top referring pilots this month.', status: 'Active', color: 'text-blue-500', bg: 'bg-blue-50' },
              { title: 'Mega Referral Week', desc: 'Double incentives on all referrals this festive season.', status: 'Coming Soon', color: 'text-gray-400', bg: 'bg-gray-50' },
            ].map((scheme, idx) => (
               <div key={idx} className={`bg-white rounded-[2rem] p-8 flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer border border-gray-50 shadow-sm ${scheme.status === 'Coming Soon' ? 'opacity-50 grayscale border-dashed border-gray-100' : 'hover:border-warmOrange/20'}`}>
                  <div className="flex items-center gap-6">
                     <div className={`w-14 h-14 ${scheme.bg} ${scheme.color} rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform`}><Gift size={24} /></div>
                     <div className="space-y-1">
                        <p className={`text-[10px] font-black uppercase tracking-widest leading-none ${scheme.color}`}>{scheme.title}</p>
                        <p className="text-[10px] font-bold text-gray-500 leading-tight pr-8">{scheme.desc}</p>
                     </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-200" />
               </div>
            ))}
         </div>
      </div>

      <div className="pt-4 text-center">
         <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Terms & Conditions Apply • Fleet Ops</p>
      </div>

    </div>
  );
};

export default ReferralView;
