import React, { useState, useEffect } from 'react';
import { Plus, Star, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const categories = ['All', 'Main Course', 'Fast Food', 'Street Food', 'South Indian', 'Chinese', 'Italian', 'Desserts', 'Beverages'];

const MenuSection = ({ searchTerm = '' }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  const menuRef = React.useRef(null);

  useEffect(() => {
    if (searchTerm && searchTerm.length > 0) {
      const timer = setTimeout(() => {
        if (menuRef.current) {
          menuRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300); // Small delay for better feel
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/menu');
        const data = await response.json();
        setMenuItems(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching menu:', err);
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const completeMenu = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredMenu = isAuthenticated ? completeMenu : completeMenu.slice(0, 8);

  const handleAddToCart = (item) => {
    addToCart({ ...item, id: item._id || item.id });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-warmOrange"></div>
      </div>
    );
  }

  return (
    <div id="menu-section" ref={menuRef} className="pt-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 font-serif tracking-tight mb-2">Explore Our Menu</h2>
          <p className="text-gray-500">Discover delicious vegetarian options tailored to your taste.</p>
        </div>
        
        {/* Category Filter */}
        <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors border ${
                activeCategory === category 
                  ? 'bg-warmOrange text-white border-warmOrange shadow-md' 
                  : 'bg-white text-gray-600 border-peach-100 hover:bg-peach-50 hover:text-warmOrange hover:border-peach-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      {filteredMenu.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-peach-200">
           <p className="text-gray-500 font-bold italic">No dishes found in this category. (Check if database is seeded)</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMenu.map((item, index) => (
            <div 
              key={item._id || item.id} 
              style={{ animationDelay: `${index * 50}ms` }}
              className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-peach-50 overflow-hidden group flex flex-col h-full cursor-pointer ${searchTerm ? 'animate-slide-up' : ''}`}
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-800 flex items-center shadow-sm">
                  <Star size={12} className="text-yellow-500 mr-1 fill-current" />
                  {item.rating}
                </div>
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-1 rounded-md shadow-sm">
                  <div className="w-3 h-3 border border-green-600 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow text-left">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">{item.name}</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">{item.category}</p>
                
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-warmOrange font-bold text-xl">₹{String(item.price || 0).replace(/[₹$,]/g, '')}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(item) }} 
                    className="bg-peach-50 text-warmOrange hover:bg-warmOrange hover:text-white p-2.5 rounded-xl transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sign In Prompt for Guests */}
      {!isAuthenticated && (
        <div className="mt-12 text-center p-8 bg-gradient-to-r from-orange-50 to-peach-50 rounded-3xl border border-orange-100 flex flex-col items-center justify-center shadow-inner relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 transform group-hover:scale-110 transition-transform duration-700">
             <Lock size={120} />
          </div>
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md text-warmOrange mb-4 z-10 transition-transform group-hover:rotate-12">
            <Lock size={32} />
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-3 z-10 font-serif">Hungry for more?</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto z-10">Sign in to unlock our full premium menu with over 40+ delicious vegetarian dishes, exclusive offers, and faster checkout.</p>
          <Link to="/login" className="px-8 py-3.5 bg-gradient-to-r from-warmOrange to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 z-10">
            Sign In to Unlock Full Menu
          </Link>
        </div>
      )}
    </div>
  );
};

export default MenuSection;
