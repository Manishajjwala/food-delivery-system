import React from 'react';
import { Clock, ShieldCheck, BadgeDollarSign } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      icon: <Clock size={40} className="text-warmOrange" />,
      title: 'Fast Delivery',
      description: 'We deliver your food hot and fresh in under 30 minutes. Real-time tracking included.',
      bgColor: 'bg-peach-50'
    },
    {
      id: 2,
      icon: <ShieldCheck size={40} className="text-green-500" />,
      title: 'Fresh Food',
      description: 'We use only the finest, freshest ingredients from trusted local farmers and suppliers.',
      bgColor: 'bg-green-50'
    },
    {
      id: 3,
      icon: <BadgeDollarSign size={40} className="text-blue-500" />,
      title: 'Affordable Price',
      description: 'Enjoy premium quality food without breaking the bank. Great portions for great prices.',
      bgColor: 'bg-blue-50'
    }
  ];

  return (
    <div className="py-12 border-t border-peach-100">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 font-serif tracking-tight mb-4">Why Choose Hungry</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          We pride ourselves on providing the best food delivery experience. Here's why our customers love us.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature) => (
          <div 
            key={feature.id} 
            className="flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-peach-50 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-20 h-20 flex items-center justify-center rounded-full ${feature.bgColor} mb-6 transform hover:scale-110 transition-transform duration-300`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
            <p className="text-gray-600 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
