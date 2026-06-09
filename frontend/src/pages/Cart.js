import React from 'react';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-48 h-48 bg-peach-50 rounded-full flex items-center justify-center mb-6">
          <span className="text-6xl">🛒</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 font-serif mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md text-center">Looks like you haven't added any delicious food to your cart yet.</p>
        <Link 
          to="/" 
          className="bg-warmOrange hover:bg-peach-500 text-white font-bold py-3 px-8 rounded-full shadow-md transform hover:-translate-y-1 transition-all"
        >
          Explore Menu
        </Link>
      </div>
    );
  }

  const deliveryFee = 50;
  const tax = cartTotal * 0.05; // 5% GST
  const grandTotal = cartTotal + deliveryFee + tax;

  return (
    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 font-serif">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="lg:w-2/3 space-y-4">
          {cartItems.map((item) => (
            <div key={`${item.id}-${item.variant?.name}`} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-peach-50 flex flex-col sm:flex-row items-center gap-6">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full sm:w-32 h-32 object-cover rounded-xl shadow-lg border border-peach-50"
              />
              <div className="flex-grow flex flex-col sm:flex-row items-center sm:items-start justify-between w-full">
                <div className="text-center sm:text-left mb-4 sm:mb-0">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                  {item.variant && (
                    <span className="inline-block px-3 py-1 bg-peach-50 text-warmOrange rounded-lg text-[10px] font-black uppercase tracking-widest mb-3 border border-peach-100">
                      Size: {item.variant.name}
                    </span>
                  )}
                  <p className="text-gray-500 text-sm font-bold">₹{String(item.price).replace(/[₹$,]/g, '')}</p>
                </div>
                
                <div className="flex items-center gap-6">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 shadow-inner">
                    <button 
                      onClick={() => updateQuantity(item.id, item.variant?.name, -1)}
                      className="px-4 py-2 text-gray-600 hover:text-warmOrange hover:bg-peach-50 transition-all font-black text-lg"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-black text-gray-900">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.variant?.name, 1)}
                      className="px-4 py-2 text-gray-600 hover:text-warmOrange hover:bg-peach-50 transition-all font-black text-lg"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  {/* Item Total & Remove */}
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-black text-xl text-warmOrange tracking-tighter">
                      ₹{(parseFloat(String(item.price).replace(/[₹$,]/g, '')) * item.quantity)}
                    </span>
                    <button 
                      onClick={() => removeFromCart(item.id, item.variant?.name)}
                      className="text-gray-400 hover:text-red-500 transition-colors flex items-center text-[10px] font-black uppercase tracking-widest"
                    >
                      <Trash2 size={12} className="mr-1.5" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex justify-start">
            <button 
              onClick={clearCart}
              className="text-gray-500 hover:text-red-500 font-medium py-2 transition-colors flex items-center"
            >
              <Trash2 size={18} className="mr-2" /> Clear All Items
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-peach-50 sticky top-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                <span>₹{cartTotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (5%)</span>
                <span>₹{tax.toFixed(0)}</span>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-warmOrange">
                    ₹{grandTotal.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>
            
            <Link 
              to="/checkout"
              className="w-full bg-warmOrange hover:bg-peach-500 text-white font-bold py-4 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
