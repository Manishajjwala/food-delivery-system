import React from 'react';
import { Leaf, Award, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-cream">
      {/* Hero Section */}
      <div className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop" 
          alt="Restaurant kitchen" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif drop-shadow-lg">Our Story</h1>
          <p className="text-xl text-white/90 font-medium">Delivering joy, one meal at a time.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 font-serif text-warmOrange">What is Hungry?</h2>
        <p className="text-gray-600 text-xl leading-relaxed max-w-4xl mx-auto mb-16">
          Hungry started with a simple idea: that getting your favorite food from local restaurants shouldn't be a hassle. 
          We built a platform that connects hungry people with the best chefs in town. With a focus on speed, quality, 
          and customer satisfaction, we have become the go-to destination for delicious, fresh, and fast food delivery.
          We believe in bringing the best culinary experiences straight to your doorstep, making every meal memorable.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-peach-50 transform hover:-translate-y-2 transition-transform">
            <div className="w-16 h-16 bg-peach-100 rounded-full flex items-center justify-center mx-auto mb-6 text-warmOrange">
              <Leaf size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Fresh Ingredients</h3>
            <p className="text-gray-600">We partner exclusively with restaurants that source local, organic, and sustainable ingredients whenever possible.</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-peach-50 transform hover:-translate-y-2 transition-transform">
            <div className="w-16 h-16 bg-peach-100 rounded-full flex items-center justify-center mx-auto mb-6 text-warmOrange">
              <Users size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Community First</h3>
            <p className="text-gray-600">Our success is local success. We provide software and logistics to help independent mom-and-pop shops thrive online.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-peach-50 transform hover:-translate-y-2 transition-transform">
            <div className="w-16 h-16 bg-peach-100 rounded-full flex items-center justify-center mx-auto mb-6 text-warmOrange">
              <Award size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Award Winning</h3>
            <p className="text-gray-600">Voted #1 Fastest Delivery App across major Indian cities three years running, prioritizing food quality in transit.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;


