import React, { useState } from 'react';
import HeroSlider from '../components/HeroSlider';
import OffersSection from '../components/OffersSection';
import MenuSection from '../components/MenuSection';
import WhyChooseUs from '../components/WhyChooseUs';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="bg-cream min-h-screen">
      <HeroSlider onSearch={setSearchTerm} />
      
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 py-12 space-y-16">
        <OffersSection />
        <MenuSection searchTerm={searchTerm} />
        <WhyChooseUs />
      </div>
    </div>
  );
};

export default Home;
