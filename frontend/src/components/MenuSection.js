import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Star, Lock, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const categories = ['All', 'Main Course', 'Fast Food', 'Street Food', 'South Indian', 'Chinese', 'Italian', 'Desserts', 'Beverages'];

const MenuSection = ({ searchTerm = '' }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [filterHighRated, setFilterHighRated] = useState(false);
  const [filterUnder200, setFilterUnder200] = useState(false);
  const [filterRecentlyOrdered, setFilterRecentlyOrdered] = useState(false);
  const [myOrderedItems, setMyOrderedItems] = useState([]);
  const { addToCart } = useCart();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  useEffect(() => {
    if (isAuthenticated) {
      const fetchMyOrders = async () => {
        try {
          const res = await fetch('http://localhost:5000/api/orders/myorders', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
          });
          const data = await res.json();
          const items = new Set();
          if (Array.isArray(data)) {
            data.forEach(o => o.orderItems?.forEach(i => items.add(i.name)));
          }
          setMyOrderedItems(Array.from(items));
        } catch (err) { console.error("Error fetching my orders:", err); }
      };
      fetchMyOrders();
    }
  }, [isAuthenticated]);

  const menuRef = React.useRef(null);

  useEffect(() => {
    if (searchTerm && searchTerm.length > 0) {
      const timer = setTimeout(() => {
        if (menuRef.current) {
          menuRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
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

  const completeMenu = useMemo(() => {
    let filtered = menuItems.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesHighRated = !filterHighRated || (item.rating >= 4.5);
      const matchesPrice = !filterUnder200 || (item.price <= 200);
      const matchesRecent = !filterRecentlyOrdered || myOrderedItems.includes(item.name);
      
      return matchesCategory && matchesSearch && matchesHighRated && matchesPrice && matchesRecent;
    });

    // Handle Sorting
    if (sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    return filtered;
  }, [menuItems, activeCategory, searchTerm, filterHighRated, filterUnder200, filterRecentlyOrdered, sortBy, myOrderedItems]);

  const filteredMenu = isAuthenticated ? completeMenu : completeMenu.slice(0, 8);

  const handleAddToCart = (item) => {
    addToCart({ ...item, id: item._id || item.id });
  };

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.filter(String).map((part, i) => 
          regex.test(part) ? (
            <mark key={i} className="bg-warmOrange/20 text-warmOrange px-0.5 rounded font-black">{part}</mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
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
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div className="animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-12 bg-warmOrange rounded-full"></div>
            <span className="text-warmOrange font-black uppercase tracking-[0.2em] text-[10px]">Best Dishes</span>
          </div>
          <h2 className="text-4xl font-black text-gray-900 font-serif tracking-tight">Explore Our Menu</h2>
          <p className="text-gray-500 mt-2 font-medium">Discover delicious vegetarian options tailored to your taste.</p>
        </div>
        {/* Category Filter */}
        <div className="flex space-x-2 overflow-x-auto pb-4 no-scrollbar bg-white/50 backdrop-blur-md p-2 rounded-2xl border border-white/40 shadow-sm animate-in fade-in slide-in-from-right-4 duration-700">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-xl whitespace-nowrap text-xs font-black uppercase tracking-widest transition-all duration-300 border ${
                activeCategory === category 
                  ? 'bg-warmOrange text-white border-warmOrange shadow-lg shadow-warmOrange/20 scale-105' 
                  : 'bg-white/50 text-gray-600 border-transparent hover:bg-white hover:text-warmOrange hover:shadow-sm'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-10 pb-6 border-b border-gray-100 animate-in fade-in duration-700">
         <div className="flex items-center gap-2 pr-6 border-r border-gray-100">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort By</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-bold text-gray-900 focus:outline-none cursor-pointer hover:text-warmOrange transition-colors"
            >
               <option value="relevance">Relevance</option>
               <option value="rating">Best Rated</option>
               <option value="price-low">Price: Low to High</option>
               <option value="price-high">Price: High to Low</option>
            </select>
         </div>

         <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setFilterHighRated(!filterHighRated)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                filterHighRated ? 'bg-orange-50 border-warmOrange text-warmOrange' : 'bg-white border-gray-100 text-gray-400 hover:border-warmOrange/30'
              }`}
            >
               Rating 4.5+
            </button>
            <button 
              onClick={() => setFilterUnder200(!filterUnder200)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                filterUnder200 ? 'bg-orange-50 border-warmOrange text-warmOrange' : 'bg-white border-gray-100 text-gray-400 hover:border-warmOrange/30'
              }`}
            >
               Under ₹200
            </button>
            {isAuthenticated && myOrderedItems.length > 0 && (
               <button 
                 onClick={() => setFilterRecentlyOrdered(!filterRecentlyOrdered)}
                 className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                   filterRecentlyOrdered ? 'bg-orange-50 border-warmOrange text-warmOrange' : 'bg-white border-gray-100 text-gray-400 hover:border-warmOrange/30'
                 }`}
               >
                  Ordered Before
               </button>
            )}
            {(filterHighRated || filterUnder200 || filterRecentlyOrdered || activeCategory !== 'All') && (
               <button 
                 onClick={() => {
                   setFilterHighRated(false);
                   setFilterUnder200(false);
                   setFilterRecentlyOrdered(false);
                   setActiveCategory('All');
                   setSortBy('relevance');
                 }}
                 className="px-5 py-2 text-[10px] font-black text-red-500 uppercase tracking-wider hover:bg-red-50 rounded-xl transition-all"
               >
                  Clear All
               </button>
            )}
         </div>
      </div>

      {/* Menu Grid */}
      {filteredMenu.length === 0 ? (
        <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-peach-100 flex flex-col items-center animate-in zoom-in-95 duration-500">
           <div className="w-20 h-20 bg-peach-50 rounded-full flex items-center justify-center text-warmOrange mb-4">
              <Search size={32} />
           </div>
           <p className="text-gray-400 font-bold italic text-lg">No dishes found in this category.</p>
           <button onClick={() => {setActiveCategory('All');}} className="mt-4 text-warmOrange font-black text-sm uppercase tracking-widest hover:underline">Clear Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredMenu.map((item, index) => (
            <MenuItem 
              key={item._id || item.id} 
              item={item} 
              index={index} 
              searchTerm={searchTerm} 
              highlightText={highlightText} 
              handleAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}

      {/* Premium Sign In Prompt (Theme Colors) */}
      {!isAuthenticated && (
        <div className="mt-20 text-center p-12 bg-gradient-to-br from-warmOrange/5 to-white rounded-[4rem] border border-warmOrange/20 flex flex-col items-center justify-center shadow-2xl shadow-warmOrange/5 relative overflow-hidden group transition-all hover:border-warmOrange/40">
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-warmOrange opacity-10 blur-[100px] group-hover:opacity-20 transition-opacity duration-1000"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-orange-600 opacity-5 blur-[100px] group-hover:opacity-10 transition-opacity duration-1000"></div>
          
          <div className="w-20 h-20 bg-warmOrange text-white rounded-[2rem] flex items-center justify-center mb-6 z-10 transition-all group-hover:rotate-12 group-hover:scale-110 shadow-lg shadow-warmOrange/30">
            <Lock size={36} />
          </div>
          <h3 className="text-4xl font-black text-gray-900 mb-4 z-10 font-serif tracking-tight">Craving More Delicious Options?</h3>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto z-10 font-medium leading-relaxed italic">Sign in to unlock our complete menu of vegetarian delicacies, earn loyalty rewards, and enjoy seamless real-time order tracking.</p>
          <Link to="/login" className="px-10 py-5 bg-gradient-to-r from-warmOrange to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-black uppercase tracking-widest text-[10px] rounded-3xl shadow-xl shadow-warmOrange/30 transition-all transform hover:scale-105 active:scale-95 z-10 flex items-center gap-4 whitespace-nowrap">
            Sign In To Explore <Plus size={16} />
          </Link>
        </div>
      )}
    </div>
  );
};

const MenuItem = ({ item, index, searchTerm, highlightText, handleAddToCart }) => {
  const [selectedVariant, setSelectedVariant] = useState(item.variants && item.variants.length > 0 ? item.variants[0] : null);
  const displayPrice = selectedVariant ? selectedVariant.price : item.price;
  
  return (
    <div 
      style={{ animationDelay: `${index * 50}ms` }}
      className={`bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-peach-50/50 overflow-hidden group flex flex-col h-full cursor-pointer animate-in fade-in slide-in-from-bottom-4`}
    >
      <div className="h-56 overflow-hidden relative">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-gray-800 flex items-center shadow-xl border border-white/50">
          <Star size={12} className="text-yellow-500 mr-1.5 fill-current" />
          {item.rating}
        </div>
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-xl border border-white/50">
          <div className="w-3.5 h-3.5 border-2 border-green-600 flex items-center justify-center rounded-sm">
            <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
          </div>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow text-left">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-warmOrange transition-colors">
            {highlightText(item.name, searchTerm)}
          </h3>
        </div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{item.category}</p>
        
        {/* Variant Selection */}
        {item.variants && item.variants.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {item.variants.map((v, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setSelectedVariant(v); }}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border flex flex-col items-center gap-0.5 ${
                  selectedVariant?.name === v.name 
                    ? 'bg-warmOrange text-white border-warmOrange shadow-md scale-105' 
                    : 'bg-gray-50 text-gray-400 border-transparent hover:border-gray-200'
                }`}
              >
                <span>{v.name}</span>
                <span className={`text-[8px] ${selectedVariant?.name === v.name ? 'text-white/80' : 'text-warmOrange/80'}`}>₹{v.price}</span>
              </button>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-peach-50/50">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight">Price</span>
            <span className="text-warmOrange font-black text-2xl tracking-tighter">₹{String(displayPrice || 0).replace(/[₹$,]/g, '')}</span>
          </div>
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              handleAddToCart({ 
                ...item, 
                price: displayPrice,
                variant: selectedVariant 
              }); 
            }} 
            className="bg-gray-900 text-white hover:bg-warmOrange hover:scale-110 p-3.5 rounded-2xl transition-all shadow-lg active:scale-95"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuSection;
