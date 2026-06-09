import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, UtensilsCrossed, Award } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const role = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName') || '';




  // Get first letter of username for avatar
  const getInitials = () => {
    return userName ? userName.charAt(0).toUpperCase() : 'U';
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    localStorage.removeItem('userToken');
    navigate('/');
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-md py-2 border-b border-gray-100/50' : 'bg-white/90 backdrop-blur-md py-3'}`}>
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="flex justify-between items-center h-14 w-full relative">
          
          {/* Logo (Left) */}
          <div className="flex items-center w-auto md:w-[30%]">
            <Link to="/" className="flex-shrink-0 flex items-center group transition-transform hover:scale-105">
              <div className="bg-gradient-to-br from-warmOrange to-orange-600 text-white p-2 rounded-xl mr-3 shadow-lg shadow-warmOrange/30">
                <UtensilsCrossed size={24} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-black text-warmOrange tracking-tight font-sans">Hungry</span>
            </Link>
          </div>
          
          {/* Desktop Links (Center) */}
          <div className="hidden md:flex flex-1 items-center justify-center space-x-8 font-sans font-medium text-[15px]">
            <Link to="/" className="relative text-gray-700 hover:text-warmOrange transition-colors py-1 group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-warmOrange transition-all duration-300 ease-out group-hover:w-full"></span>
            </Link>
            <Link to="/about" className="relative text-gray-700 hover:text-warmOrange transition-colors py-1 group">
              About
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-warmOrange transition-all duration-300 ease-out group-hover:w-full"></span>
            </Link>
            <Link to="/contact" className="relative text-gray-700 hover:text-warmOrange transition-colors py-1 group">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-warmOrange transition-all duration-300 ease-out group-hover:w-full"></span>
            </Link>
            <Link to="/blog" className="relative text-gray-700 hover:text-warmOrange transition-colors py-1 group">
              Blog
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-warmOrange transition-all duration-300 ease-out group-hover:w-full"></span>
            </Link>
          </div>
            
          {/* Cart & Auth (Right) */}
          <div className="hidden md:flex items-center justify-end space-x-6 w-auto md:w-[30%]">
              <Link to="/cart" className="text-gray-700 hover:text-warmOrange transition-colors relative block p-2 group">
                <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-warmOrange to-orange-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">


                  <Link 
                    to={role === 'admin' ? '/admin/dashboard' : role === 'delivery' ? '/rider' : '/dashboard'} 
                    className="transition-transform hover:scale-105 focus:outline-none" 
                    title={role === 'admin' ? "Admin Console" : role === 'delivery' ? "Partner Hub" : "Profile Dashboard"}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-warmOrange to-orange-500 text-white flex items-center justify-center shadow-md border-2 border-white ring-2 ring-transparent hover:ring-warmOrange/30 transition-all">
                       <User size={20} strokeWidth={2.5} />
                    </div>
                  </Link>
                  {!location.pathname.startsWith('/admin') && !location.pathname.startsWith('/delivery') && location.pathname !== '/dashboard' && (
                    <button 
                      onClick={handleLogout} 
                      className="text-red-500 hover:text-white bg-red-50 hover:bg-red-500 px-5 py-2 rounded-full transition-all border border-red-100 hover:border-red-500 font-bold text-sm shadow-sm"
                      title="Logout"
                    >
                      <span>Logout</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="flex items-center justify-center bg-gradient-to-r from-warmOrange to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 shadow-warmOrange/30 whitespace-nowrap">
                    Sign In
                  </Link>
                </div>
              )}
          </div>

          {/* Mobile menu button */}
          <div className="flex flex-1 justify-end items-center md:hidden">
            <Link to="/cart" className="text-gray-700 hover:text-warmOrange mr-4 relative p-1">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-warmOrange to-orange-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={toggleMenu} type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-warmOrange focus:outline-none bg-gray-50">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-100 absolute w-full shadow-2xl z-50 animate-in slide-in-from-top-2">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link to="/" onClick={toggleMenu} className="block px-4 py-3 rounded-xl text-base font-bold text-gray-800 hover:text-warmOrange hover:bg-orange-50 transition-colors">Home</Link>
            <Link to="/about" onClick={toggleMenu} className="block px-4 py-3 rounded-xl text-base font-bold text-gray-800 hover:text-warmOrange hover:bg-orange-50 transition-colors">About</Link>
            <Link to="/contact" onClick={toggleMenu} className="block px-4 py-3 rounded-xl text-base font-bold text-gray-800 hover:text-warmOrange hover:bg-orange-50 transition-colors">Contact</Link>
            <Link to="/blog" onClick={toggleMenu} className="block px-4 py-3 rounded-xl text-base font-bold text-gray-800 hover:text-warmOrange hover:bg-orange-50 transition-colors">Blog</Link>
            
            <div className="border-t border-gray-100 mt-4 pt-4">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-warmOrange to-orange-500 text-white flex items-center justify-center shadow-sm">
                       <User size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{role === 'admin' ? (localStorage.getItem('adminName') || 'Admin') : (userName || 'User')}</p>
                      <p className="text-xs text-gray-500 capitalize">{role}</p>
                    </div>
                  </div>
                  <Link 
                    to={role === 'admin' ? '/admin/dashboard' : role === 'delivery' ? '/rider' : '/dashboard'} 
                    onClick={toggleMenu} 
                    className="block px-4 py-3 rounded-xl text-base font-bold text-gray-800 hover:text-warmOrange hover:bg-orange-50 transition-colors"
                  >
                    {role === 'admin' ? 'Admin Panel' : role === 'delivery' ? 'Partner Hub' : 'My Dashboard'}
                  </Link>
                  {!location.pathname.startsWith('/admin') && !location.pathname.startsWith('/delivery') && location.pathname !== '/dashboard' && (
                    <button onClick={() => { handleLogout(); toggleMenu(); }} className="w-full text-left px-4 py-3 rounded-xl text-base font-bold text-red-500 hover:bg-red-50 transition-colors">
                      Logout
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Link
                    to="/login"
                    onClick={toggleMenu}
                    className="block px-4 py-3 rounded-xl text-base font-bold text-center text-white bg-gradient-to-r from-warmOrange to-orange-600 hover:from-orange-500 hover:to-orange-700 transition-colors shadow-md whitespace-nowrap"
                  >
                    Sign In / Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
