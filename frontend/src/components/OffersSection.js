import React from 'react';
import { Tag, Truck, Gift } from 'lucide-react';

const offers = [
  {
    id: 1,
    title: 'FLAT ₹50 OFF',
    subtitle: 'Orders above ₹199',
    code: 'HUNGRY50',
    icon: <Tag size={32} className="text-white" />,
    color: 'bg-gradient-to-br from-warmOrange to-orange-500',
  },
  {
    id: 2,
    title: '20% OFF',
    subtitle: 'For our new foodies! (Max ₹100)',
    code: 'WELCOME20',
    icon: <Gift size={32} className="text-white" />,
    color: 'bg-gradient-to-br from-pink-500 to-rose-400',
  },
  {
    id: 3,
    title: 'FREE DELIVERY',
    subtitle: 'Orders above ₹499',
    code: 'FREEDELIVERY',
    icon: <Truck size={32} className="text-white" />,
    color: 'bg-gradient-to-br from-purple-500 to-indigo-400',
  }
];

const OffersSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {offers.map((offer) => (
        <div 
          key={offer.id} 
          className={`${offer.color} rounded-3xl p-6 text-white shadow-lg cursor-pointer transform hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group`}
        >
          {/* Decorative backdrop */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white opacity-10 rounded-full transform group-hover:scale-150 transition-transform duration-500"></div>
          
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-white/80 font-medium mb-1 drop-shadow-sm">{offer.subtitle}</p>
              <h3 className="text-3xl font-extrabold mb-4 font-serif tracking-tight drop-shadow-md">{offer.title}</h3>
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/30">
                <span className="text-sm font-bold tracking-wider">CODE: {offer.code}</span>
              </div>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              {offer.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OffersSection;
