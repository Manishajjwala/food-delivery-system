import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MapPin, CreditCard, ChevronRight, CheckCircle, Home, Plus, Briefcase, Edit2, Trash2, AlertCircle } from 'lucide-react';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Address, 2: Payment
  
  // Address States
  const [userAddresses, setUserAddresses] = useState(() => {
    const saved = localStorage.getItem('userAddresses');
    if (saved) return JSON.parse(saved);
    const legacy = localStorage.getItem('userAddress');
    return legacy ? [{ id: '1', type: 'Home', details: legacy }] : [];
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState('');
  const [newAddressType, setNewAddressType] = useState('Home');
  const [selectedAddress, setSelectedAddress] = useState(userAddresses.length > 0 ? userAddresses[0].id : null);

  useEffect(() => {
    localStorage.setItem('userAddresses', JSON.stringify(userAddresses));
    if (!selectedAddress && userAddresses.length > 0) {
      setSelectedAddress(userAddresses[0].id);
    }
  }, [userAddresses, selectedAddress]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') {
      navigate('/login');
    }
  }, [navigate]);

  const handleSaveAddress = () => {
    if (newAddress.length < 5) return;
    if (editingAddressId) {
      setUserAddresses(prev => prev.map(a => a.id === editingAddressId ? { ...a, type: newAddressType, details: newAddress } : a));
    } else {
      const newAddr = { id: Date.now().toString(), type: newAddressType, details: newAddress };
      setUserAddresses(prev => [...prev, newAddr]);
      if (!selectedAddress) setSelectedAddress(newAddr.id);
    }
    setIsAddingAddress(false);
    setEditingAddressId(null);
    setNewAddress('');
    setNewAddressType('Home');
  };

  const handleDeleteAddress = (id, e) => {
    e.stopPropagation();
    setUserAddresses(prev => prev.filter(a => a.id !== id));
    if (selectedAddress === id) setSelectedAddress(null);
  };

  const handleEditAddress = (addr, e) => {
    e.stopPropagation();
    setEditingAddressId(addr.id);
    setNewAddress(addr.details);
    setNewAddressType(addr.type);
    setIsAddingAddress(true);
  };
  
  // Payment States
  const [selectedPayment, setSelectedPayment] = useState('upi'); // 'upi', 'card', 'cod'
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Coupon States
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(0);
  const [couponMessage, setCouponMessage] = useState({ text: '', type: '' });
  const [paymentError, setPaymentError] = useState('');

  const deliveryFee = 50;
  const tax = cartTotal * 0.05;
  const grandTotal = Math.max(0, cartTotal + deliveryFee + tax - discountApplied);

  const handleApplyCoupon = (codeToApply = couponCode) => {
    const code = codeToApply.toUpperCase().trim();
    if (code === 'HUNGRY50') {
        if (cartTotal >= 199) {
            setDiscountApplied(50);
            setCouponMessage({ text: '₹50 flat discount applied!', type: 'success' });
            setCouponCode(code);
        } else {
            setDiscountApplied(0);
            setCouponMessage({ text: 'Min order value must be ₹199 for this coupon.', type: 'error' });
        }
    } else if (code === 'HDFC150') {
        if (cartTotal >= 599) {
            setDiscountApplied(150);
            setCouponMessage({ text: '₹150 HDFC Bank discount applied!', type: 'success' });
            setCouponCode(code);
        } else {
            setDiscountApplied(0);
            setCouponMessage({ text: 'Min order value must be ₹599 for HDFC offer.', type: 'error' });
        }
    } else if (code === 'PAYUPI') {
        if (cartTotal >= 149) {
            setDiscountApplied(30);
            setCouponMessage({ text: '₹30 UPI discount applied!', type: 'success' });
            setCouponCode(code);
        } else {
            setDiscountApplied(0);
            setCouponMessage({ text: 'Min order value must be ₹149 for UPI offer.', type: 'error' });
        }
    } else if (code === 'MASTER50') {
        if (cartTotal >= 299) {
            setDiscountApplied(50);
            setCouponMessage({ text: '₹50 Mastercard discount applied!', type: 'success' });
            setCouponCode(code);
        } else {
            setDiscountApplied(0);
            setCouponMessage({ text: 'Min order value must be ₹299 for Mastercard offer.', type: 'error' });
        }
    } else if (code === 'AMZPAY') {
        if (cartTotal >= 199) {
            const discount = Math.min(cartTotal * 0.10, 100);
            setDiscountApplied(discount);
            setCouponMessage({ text: `10% Amazon Pay discount applied (-₹${discount.toFixed(0)})!`, type: 'success' });
            setCouponCode(code);
        } else {
            setDiscountApplied(0);
            setCouponMessage({ text: 'Min order value must be ₹199 for Amazon Pay offer.', type: 'error' });
        }
    } else if (code === 'PAYTM') {
        if (cartTotal >= 199) {
            setDiscountApplied(40);
            setCouponMessage({ text: '₹40 Paytm Wallet discount applied!', type: 'success' });
            setCouponCode(code);
        } else {
            setDiscountApplied(0);
            setCouponMessage({ text: 'Min order value must be ₹199 for Paytm offer.', type: 'error' });
        }
    } else if (code === 'WELCOME20') {
        const discount = Math.min(cartTotal * 0.20, 100);
        setDiscountApplied(discount);
        setCouponMessage({ text: `20% discount applied (-₹${discount.toFixed(0)})!`, type: 'success' });
        setCouponCode(code);
    } else if (code === 'FREEDELIVERY') {
        if (cartTotal >= 499) {
            setDiscountApplied(deliveryFee);
            setCouponMessage({ text: 'Free Delivery applied!', type: 'success' });
            setCouponCode(code);
        } else {
            setDiscountApplied(0);
            setCouponMessage({ text: 'Min order value must be ₹499 for free delivery.', type: 'error' });
        }
    } else {
        setDiscountApplied(0);
        setCouponMessage({ text: 'Invalid or expired coupon code.', type: 'error' });
    }
  };

  const removeCoupon = () => {
      setDiscountApplied(0);
      setCouponCode('');
      setCouponMessage({ text: '', type: '' });
      setPaymentError('');
  };

  const handlePlaceOrder = () => {
    setPaymentError('');

    // Payment method validation for coupons
    if (couponCode === 'PAYUPI' && selectedPayment !== 'upi') {
      setPaymentError('Please select UPI payment method to use the PAYUPI coupon.');
      return;
    }
    if ((couponCode === 'MASTER50' || couponCode === 'HDFC150') && selectedPayment !== 'card') {
      setPaymentError(`Please select Credit / Debit Card to use the ${couponCode} coupon.`);
      return;
    }
    if ((couponCode === 'AMZPAY' || couponCode === 'PAYTM') && selectedPayment === 'cod') {
      setPaymentError(`The ${couponCode} offer is not valid for Cash on Delivery. Please select UPI or Card.`);
      return;
    }

    // Generate order data
    const orderId = `HG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const orderDate = new Date().toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
    
    // Address for this order
    let orderAddress = 'No address selected';
    const selected = userAddresses.find(a => a.id === selectedAddress);
    if (selected) {
        orderAddress = selected.details;
    }

    const placeOrderBackend = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const orderData = {
          orderItems: cartItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: parseFloat(String(item.price).replace(/[₹$,]/g, '')),
            variant: item.variant?.name || 'Regular',
          })),
          shippingAddress: {
            address: orderAddress,
            type: selected ? selected.type : 'Home',
          },
          paymentMethod: selectedPayment,
          totalPrice: grandTotal,
          estimatedDeliveryTime: 30 + Math.min(Math.floor(cartTotal / 500) * 5, 20) + (cartItems.length * 2), 
          preparationTime: 10 + Math.min(cartItems.length * 2, 20),
        };

        const response = await fetch('food-delivery-system-xb0m.onrender.com/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        });

        if (response.ok) {
          const createdOrder = await response.json();
          clearCart();
          navigate('/order-success', { state: { orderId: createdOrder._id }, replace: true });
        } else {
          alert('Failed to place order. Please check if you are logged in.');
        }
      } catch (error) {
        console.error('Order Error:', error);
        alert('Could not connect to the server.');
      }
    };

    placeOrderBackend();
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="bg-cream min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 font-serif text-center">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Checkout Form */}
          <div className="lg:w-2/3 space-y-8">
            
            {/* Steps Progress */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-peach-50 flex justify-between items-center relative overflow-hidden">
                <div className="flex-1 text-center relative z-10 font-serif">
                    <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold mb-2 transition-colors ${step >= 1 ? 'bg-warmOrange text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>1</div>
                    <span className={`text-sm font-bold ${step >= 1 ? 'text-warmOrange' : 'text-gray-400'}`}>Delivery</span>
                </div>
                <div className={`flex-1 h-1 bg-gray-100 relative rounded-full mx-2 ${step >= 2 ? 'bg-warmOrange/30' : ''}`}>
                    <div className={`absolute left-0 top-0 h-full bg-warmOrange transition-all duration-500`} style={{ width: step >= 2 ? '100%' : '0%' }}></div>
                </div>
                <div className="flex-1 text-center relative z-10 font-serif">
                    <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold mb-2 transition-colors ${step >= 2 ? 'bg-warmOrange text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>2</div>
                    <span className={`text-sm font-bold ${step >= 2 ? 'text-warmOrange' : 'text-gray-400'}`}>Payment</span>
                </div>
            </div>

            {/* Step 1: Address */}
            {step === 1 && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-peach-50">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="bg-peach-100 p-2 rounded-lg text-warmOrange">
                    <MapPin size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 font-serif">Select Delivery Address</h2>
                </div>
                
                <div className="space-y-4">
                  {/* Address List */}
                  {userAddresses.map(addr => (
                    <div 
                      key={addr.id}
                      onClick={() => !isAddingAddress && setSelectedAddress(addr.id)}
                      className={`border-2 p-6 rounded-2xl relative cursor-pointer shadow-sm transition-all ${selectedAddress === addr.id ? 'border-warmOrange bg-peach-50/20' : 'border-gray-50 bg-white hover:border-peach-200'} ${isAddingAddress && editingAddressId !== addr.id ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      {selectedAddress === addr.id && <div className="absolute top-4 right-4 text-[10px] font-bold text-white bg-warmOrange px-2 py-1 rounded-full uppercase tracking-tighter">Selected</div>}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className={`p-2 rounded-full ${selectedAddress === addr.id ? 'bg-white text-warmOrange' : 'bg-peach-50 text-gray-400'}`}>
                            {addr.type === 'Home' ? <Home size={20} /> : addr.type === 'Work' ? <Briefcase size={20} /> : <MapPin size={20} />}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 mb-1">{addr.type} Address</p>
                            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                              {addr.details}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                           <button onClick={(e) => handleEditAddress(addr, e)} className="p-2 text-gray-400 hover:text-warmOrange hover:bg-peach-50 rounded-lg transition-colors">
                             <Edit2 size={16} />
                           </button>
                           <button onClick={(e) => handleDeleteAddress(addr.id, e)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                             <Trash2 size={16} />
                           </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Custom Address Input */}
                  {isAddingAddress ? (
                    <div className="bg-peach-50/20 border-2 border-warmOrange p-6 rounded-2xl shadow-inner animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-center mb-4">
                          <p className="font-bold text-gray-900 text-sm uppercase tracking-wider">{editingAddressId ? 'Edit Address' : 'New Address Details'}</p>
                          <div className="flex space-x-2">
                            {['Home', 'Work', 'Other'].map(type => (
                              <button
                                key={type}
                                onClick={() => setNewAddressType(type)}
                                className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors ${newAddressType === type ? 'bg-warmOrange text-white border-warmOrange' : 'bg-white text-gray-500 border-gray-200'}`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>
                        <textarea 
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            placeholder="Apartment name, street, nearby landmark, city, pincode..."
                            className="w-full p-4 rounded-xl border border-peach-200 focus:ring-2 focus:ring-warmOrange/20 focus:border-warmOrange outline-none text-gray-700 min-h-[120px] mb-4 bg-white"
                        />
                        <div className="flex space-x-3">
                            <button 
                                onClick={handleSaveAddress}
                                className="flex-1 bg-warmOrange text-white font-bold py-2 rounded-xl hover:bg-peach-500 transition-colors shadow-md disabled:opacity-50"
                                disabled={newAddress.length < 5}
                            >
                                Save Address
                            </button>
                            <button 
                                onClick={() => {
                                  setIsAddingAddress(false);
                                  setEditingAddressId(null);
                                  setNewAddress('');
                                  setNewAddressType('Home');
                                }}
                                className="flex-1 bg-white text-gray-500 font-bold py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                  ) : (
                    <div 
                        onClick={() => setIsAddingAddress(true)}
                        className={`border-2 border-dashed p-6 rounded-2xl flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all border-gray-100 bg-gray-50/30 hover:border-warmOrange hover:bg-white text-gray-400`}
                    >
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                            <Plus size={24} />
                        </div>
                        <span className="font-bold text-sm tracking-wide">+ Add {userAddresses.length === 0 ? 'Address' : 'New Address'}</span>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => setStep(2)}
                  className="w-full mt-10 bg-warmOrange hover:bg-peach-500 text-white font-bold py-5 rounded-[1.5rem] shadow-xl transform hover:-translate-y-1 transition-all flex items-center justify-center space-x-2 text-lg uppercase tracking-wider"
                >
                  <span>Continue to Payment</span>
                  <ChevronRight size={22} />
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-peach-50">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="bg-peach-100 p-2 rounded-lg text-warmOrange">
                    <CreditCard size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 font-serif">Payment Method</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div 
                    onClick={() => setSelectedPayment('upi')}
                    className={`border-2 p-6 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all ${selectedPayment === 'upi' ? 'border-warmOrange bg-peach-50/20 shadow-inner scale-105' : 'border-gray-100 hover:border-peach-200 bg-white'}`}
                  >
                     <span className="text-4xl mb-3">📱</span>
                     <p className={`font-bold ${selectedPayment === 'upi' ? 'text-gray-900' : 'text-gray-400'}`}>UPI (GPay, PhonePe)</p>
                     {selectedPayment === 'upi' && <div className="mt-2 w-2 h-2 bg-warmOrange rounded-full animate-bounce"></div>}
                  </div>
                  <div 
                    onClick={() => setSelectedPayment('card')}
                    className={`border-2 p-6 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all ${selectedPayment === 'card' ? 'border-warmOrange bg-peach-50/20 shadow-inner scale-105' : 'border-gray-100 hover:border-peach-200 bg-white'}`}
                  >
                     <span className="text-4xl mb-3">💳</span>
                     <p className={`font-bold ${selectedPayment === 'card' ? 'text-gray-900' : 'text-gray-400'}`}>Credit / Debit Card</p>
                     {selectedPayment === 'card' && <div className="mt-2 w-2 h-2 bg-warmOrange rounded-full animate-bounce"></div>}
                  </div>
                  <div 
                    onClick={() => setSelectedPayment('cod')}
                    className={`border-2 p-6 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all ${selectedPayment === 'cod' ? 'border-warmOrange bg-peach-50/20 shadow-inner scale-105' : 'border-gray-100 hover:border-peach-200 bg-white'}`}
                  >
                     <span className="text-4xl mb-3">💵</span>
                     <p className={`font-bold ${selectedPayment === 'cod' ? 'text-gray-900' : 'text-gray-400'}`}>Cash on Delivery</p>
                     {selectedPayment === 'cod' && <div className="mt-2 w-2 h-2 bg-warmOrange rounded-full animate-bounce"></div>}
                  </div>
                </div>

                <div className="mt-8 animate-in fade-in slide-in-from-top-2">
                    {selectedPayment === 'upi' && (
                        <div className="bg-peach-50/30 p-8 rounded-[2rem] border border-peach-100 max-w-md mx-auto shadow-inner">
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 text-[10px] uppercase tracking-widest">Enter UPI ID</label>
                            <input 
                                type="text"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder="e.g. username@okhdfcbank"
                                className="w-full px-6 py-4 rounded-2xl border border-peach-100 focus:outline-none focus:ring-4 focus:ring-warmOrange/10 focus:border-warmOrange bg-white font-medium text-gray-800"
                            />
                            <p className="text-[10px] text-gray-400 mt-4 text-center italic font-medium">A secure protocol request will be sent to your primary UPI terminal.</p>
                        </div>
                    )}
 
                    {selectedPayment === 'card' && (
                        <div className="bg-peach-50/30 p-8 rounded-[2rem] border border-peach-100 max-w-lg mx-auto space-y-6 shadow-inner">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 text-[10px] uppercase tracking-widest">Card Identification</label>
                                <input 
                                    type="text"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    placeholder="0000 0000 0000 0000"
                                    maxLength="19"
                                    className="w-full px-6 py-4 rounded-2xl border border-peach-100 focus:outline-none focus:ring-4 focus:ring-warmOrange/10 focus:border-warmOrange bg-white tracking-[0.2em] text-gray-800 font-mono"
                                />
                            </div>
                            <div className="flex space-x-6">
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 text-[10px] uppercase tracking-widest">Expiry</label>
                                    <input 
                                        type="text"
                                        value={cardExpiry}
                                        onChange={(e) => setCardExpiry(e.target.value)}
                                        placeholder="MM/YY"
                                        maxLength="5"
                                        className="w-full px-6 py-4 rounded-2xl border border-peach-100 focus:outline-none focus:ring-4 focus:ring-warmOrange/10 focus:border-warmOrange bg-white text-center font-mono"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 text-[10px] uppercase tracking-widest">CVV</label>
                                    <input 
                                        type="password"
                                        value={cardCvv}
                                        onChange={(e) => setCardCvv(e.target.value)}
                                        placeholder="•••"
                                        maxLength="3"
                                        className="w-full px-6 py-4 rounded-2xl border border-peach-100 focus:outline-none focus:ring-4 focus:ring-warmOrange/10 focus:border-warmOrange bg-white text-center tracking-[0.4em]"
                                    />
                                </div>
                            </div>
                             <p className="text-[10px] text-gray-400 mt-2 text-center italic font-medium">Your credentials are protected by bank-grade encryption protocols.</p>
                        </div>
                    )}
                </div>
                
                {paymentError && (
                  <p className="mt-8 text-center text-red-600 font-bold bg-red-50 p-4 rounded-xl border border-red-200 animate-in fade-in">
                    {paymentError}
                  </p>
                )}
                
                <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 border-2 border-gray-100 text-gray-500 font-bold py-4 rounded-2xl hover:bg-gray-50 transition-all font-serif bg-white"
                  >
                    Go Back
                  </button>
                  <button 
                    onClick={handlePlaceOrder}
                    className="flex-[2] bg-warmOrange hover:bg-peach-500 text-white font-bold py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-2 text-xl uppercase tracking-wider transform hover:scale-[1.02]"
                  >
                    <CheckCircle size={24} />
                    <span>Place Order &bull; ₹{grandTotal.toFixed(0)}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-peach-50 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif border-b border-gray-50 pb-4">Order Review</h2>
              
              <div className="max-h-60 overflow-y-auto pr-2 mb-6 no-scrollbar space-y-4">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.variant?.name}`} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded-xl border border-gray-100">
                    <div className="flex space-x-3 items-center">
                        <img src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} alt={item.name} className="w-12 h-12 object-cover rounded-lg shadow-sm border border-peach-50" />
                        <div>
                          <p className="text-gray-900 font-bold truncate w-28">{item.name}</p>
                          <div className="flex items-center gap-1.5">
                             <p className="text-warmOrange font-black text-[10px]">{item.quantity}x</p>
                             {item.variant && <span className="text-[9px] font-black text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-100 uppercase">{item.variant.name}</span>}
                          </div>
                        </div>
                    </div>
                    <span className="font-black text-gray-900">₹{(parseFloat(String(item.price).replace(/[₹$,]/g, '')) * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 pt-4 border-t border-gray-50">
                <div className="flex justify-between text-gray-500 text-sm font-medium">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm font-medium">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm font-medium">
                  <span>GST (5%)</span>
                  <span>₹{tax.toFixed(0)}</span>
                </div>
                {discountApplied > 0 && (
                   <div className="flex justify-between text-green-600 font-extrabold text-sm animate-fade-in">
                     <span>Discount Applied</span>
                     <span>-₹{discountApplied.toFixed(0)}</span>
                   </div>
                )}
                <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100 flex justify-between items-center mt-2 group hover:bg-orange-50 transition-colors">
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Estimated Delivery:</p>
                   <p className="text-sm font-black text-warmOrange">30-40 mins</p>
                </div>
                <div className="flex justify-between items-baseline pt-4 mt-4 border-t border-peach-100">
                  <span className="text-xl font-black text-gray-900">Grand Total</span>
                  <span className="text-3xl font-black text-warmOrange tracking-tighter">
                    ₹{grandTotal.toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Apply Coupon Section */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                 <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Promo Code</p>
                    {step === 1 && <span className="text-[8px] font-black text-warmOrange bg-warmOrange/10 px-2 py-0.5 rounded-full uppercase tracking-widest">All Available</span>}
                 </div>
                 <div className="flex space-x-2">
                    <input 
                      type="text" 
                      value={couponCode}
                      onChange={(e) => {
                          setCouponCode(e.target.value);
                          setCouponMessage({ text: '', type: '' });
                      }}
                      disabled={discountApplied > 0}
                      className="flex-1 px-4 py-3 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-warmOrange/20 focus:border-warmOrange text-sm uppercase font-bold disabled:bg-gray-50 disabled:text-gray-500 shadow-inner"
                    />
                    {discountApplied > 0 ? (
                      <button 
                        onClick={removeCoupon}
                        className="px-5 py-3 bg-red-50 text-red-600 font-black rounded-2xl hover:bg-red-100 transition-all text-xs uppercase tracking-widest"
                      >
                          Remove
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleApplyCoupon()}
                        className="px-5 py-3 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-widest shadow-lg"
                      >
                          Apply
                      </button>
                    )}
                 </div>
                 {couponMessage.text && (
                     <p className={`text-[10px] font-black mt-3 flex items-center gap-2 uppercase tracking-tight ${couponMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                         <span className={`w-1.5 h-1.5 rounded-full ${couponMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                         {couponMessage.text}
                     </p>
                 )}
                 
                 {/* Available Coupons Quick Select */}
                 {!discountApplied && (
                     <div className="mt-6">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Eligible Offers</p>
                         <div className="max-h-[340px] overflow-y-auto pr-2 space-y-4 no-scrollbar pb-2">
                         
                         {[
                           { code: 'HUNGRY50', min: 199, desc: 'Flat ₹50 OFF on orders above ₹199', color: 'orange', method: 'any' },
                           { code: 'WELCOME20', min: 0, desc: '20% OFF for new users (Max ₹100)', color: 'pink', method: 'any' },
                           { code: 'HDFC150', min: 599, desc: 'Flat ₹150 OFF with HDFC Cards', color: 'blue', method: 'card', badge: 'BANK OFFER' },
                           { code: 'FREEDELIVERY', min: 499, desc: 'Free delivery on orders above ₹499', color: 'purple', method: 'any' },
                           { code: 'PAYUPI', min: 149, desc: 'Flat ₹30 OFF via any UPI App', color: 'cyan', method: 'upi', badge: 'UPI OFFER' },
                           { code: 'MASTER50', min: 299, desc: 'Flat ₹50 OFF on Mastercard', color: 'indigo', method: 'card', badge: 'CARDS OFFER' },
                           { code: 'AMZPAY', min: 199, desc: '10% OFF via Amazon Pay Wallet', color: 'amber', method: 'wallet', badge: 'WALLET' },
                           { code: 'PAYTM', min: 199, desc: '₹40 OFF via Paytm Wallet', color: 'blue', method: 'wallet', badge: 'WALLET' }
                         ].map(coupon => {
                           const isPriceEligible = cartTotal >= coupon.min;
                           const isMethodEligible = step === 1 || coupon.method === 'any' || selectedPayment === coupon.method || (coupon.method === 'wallet' && selectedPayment !== 'cod');
                           const isEligible = isPriceEligible && isMethodEligible;

                           return (
                             <div 
                               key={coupon.code}
                               onClick={() => isEligible && handleApplyCoupon(coupon.code)} 
                               className={`border p-4 rounded-[1.5rem] transition-all relative overflow-hidden group ${
                                 isEligible 
                                   ? `bg-${coupon.color}-50 border-${coupon.color}-100 cursor-pointer hover:shadow-lg hover:shadow-${coupon.color}-500/10` 
                                   : 'bg-gray-50 border-gray-100 opacity-60'
                               }`}
                             >
                                 <div className="flex justify-between items-start mb-2 relative z-10">
                                   <div className="flex items-center space-x-2">
                                       <p className={`font-black text-sm ${isEligible ? 'text-gray-900' : 'text-gray-400'}`}>{coupon.code}</p>
                                       {coupon.badge && <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${isEligible ? `bg-${coupon.color}-100 text-${coupon.color}-700 border-${coupon.color}-200` : 'bg-gray-100 text-gray-400 border-gray-200'}`}>{coupon.badge}</span>}
                                   </div>
                                 </div>
                                 <p className="text-[10px] text-gray-500 font-bold leading-tight relative z-10">{coupon.desc}</p>
                                 
                                 <div className="mt-3 flex justify-between items-center relative z-10">
                                    {isEligible ? (
                                       <span className={`text-[10px] font-black text-${coupon.color}-600 uppercase tracking-widest group-hover:underline`}>Apply Code</span>
                                    ) : (
                                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-tight flex items-center gap-1.5">
                                          <AlertCircle size={12} />
                                          {!isPriceEligible ? `Min order ₹${coupon.min}` : 'Method restricted'}
                                       </span>
                                    )}
                                 </div>
                                 {isEligible && <div className={`absolute -right-4 -bottom-4 w-12 h-12 bg-${coupon.color}-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform`}></div>}
                             </div>
                           );
                         })}
                         
                         </div>
                     </div>
                 )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
