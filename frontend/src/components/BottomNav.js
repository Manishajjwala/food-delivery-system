import React from 'react';
import { Home, History, CreditCard, User, Users } from 'lucide-react';

const BottomNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'wallet', label: 'Earnings', icon: CreditCard },
    { id: 'referral', label: 'Referral', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className={`backdrop-blur-2xl border border-white/40 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex items-center justify-around h-20 px-4 rounded-[2.5rem] transition-all duration-500 overflow-hidden ${activeTab === 'home' ? 'bg-white/40' : 'bg-white/80'}`}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-col items-center justify-center gap-1 transition-all duration-500 group flex-1 h-full`}
          >
            <div 
              className={`p-3 rounded-2xl transition-all duration-500 relative ${
                isActive ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 -translate-y-1' : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span 
              className={`text-[9px] font-black uppercase tracking-[0.1em] transition-all duration-500 ${
                isActive ? 'text-orange-500 scale-100 opacity-100' : 'text-gray-400 scale-90 opacity-40'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
