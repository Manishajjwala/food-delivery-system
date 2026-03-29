import React, { useRef } from 'react';
import { ChevronRight, ChevronLeft, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const foodItems = [
  { id: 1, name: 'Veg Hakka Noodles', price: '₹180', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=2092&auto=format&fit=crop' },
  { id: 2, name: 'Gobi Manchurian', price: '₹150', image: 'https://images.unsplash.com/photo-1512058560366-cd2429458634?q=80&w=2070&auto=format&fit=crop' },
  { id: 3, name: 'Margherita Pizza', price: '₹350', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=2069&auto=format&fit=crop' },
  { id: 4, name: 'Veg White Sauce Pasta', price: '₹280', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=2070&auto=format&fit=crop' },
  { id: 5, name: 'Masala Dosa', price: '₹120', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=2070&auto=format&fit=crop' },
  { id: 6, name: 'Paneer Butter Masala', price: '₹250', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?q=80&w=1974&auto=format&fit=crop' },
];

const FoodCarousel = ({ title }) => {
  const scrollContainerRef = useRef(null);
  const { addToCart } = useCart();

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-3xl font-bold text-gray-900 font-serif tracking-tight">{title}</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-white shadow-sm border border-peach-100 text-gray-600 hover:text-warmOrange hover:bg-peach-50 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-white shadow-sm border border-peach-100 text-gray-600 hover:text-warmOrange hover:bg-peach-50 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex space-x-6 overflow-x-auto pb-8 pt-2 no-scrollbar scroll-smooth"
      >
        {foodItems.map((item) => (
          <div 
            key={item.id} 
            className="min-w-[280px] bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-peach-50 overflow-hidden group cursor-pointer"
          >
            <div className="h-48 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-1 rounded-md shadow-sm">
                <div className="w-3 h-3 border border-green-600 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
              <p className="text-warmOrange font-bold text-lg mb-4">{item.price}</p>
              
              <button 
                onClick={() => handleAddToCart(item)}
                className="w-full bg-peach-50 text-warmOrange hover:bg-warmOrange hover:text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <Plus size={18} />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodCarousel;
