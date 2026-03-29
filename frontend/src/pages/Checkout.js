import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MapPin, CreditCard, ChevronRight, CheckCircle, Home, Plus, Briefcase, Edit2, Trash2 } from 'lucide-react';

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
          })),
          shippingAddress: {
            address: orderAddress,
            type: selected ? selected.type : 'Home',
          },
          paymentMethod: selectedPayment,
          totalPrice: grandTotal,
        };

        const response = await fetch('http://localhost:5000/api/orders', {
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

                {/* Conditional Payment Fields */}
                <div className="mt-8 animate-in fade-in slide-in-from-top-2">
                    {selectedPayment === 'upi' && (
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 max-w-md mx-auto">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Enter UPI ID</label>
                            <input 
                                type="text"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder="e.g. username@okhdfcbank"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-warmOrange/20 focus:border-warmOrange"
                            />
                            <p className="text-xs text-gray-500 mt-2 text-center">A payment request will be sent to your UPI app.</p>
                        </div>
                    )}

                    {selectedPayment === 'card' && (
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 max-w-lg mx-auto space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Card Number</label>
                                <input 
                                    type="text"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    placeholder="0000 0000 0000 0000"
                                    maxLength="19"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-warmOrange/20 focus:border-warmOrange tracking-widest"
                                />
                            </div>
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Expiry Date</label>
                                    <input 
                                        type="text"
                                        value={cardExpiry}
                                        onChange={(e) => setCardExpiry(e.target.value)}
                                        placeholder="MM/YY"
                                        maxLength="5"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-warmOrange/20 focus:border-warmOrange text-center"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">CVV</label>
                                    <input 
                                        type="password"
                                        value={cardCvv}
                                        onChange={(e) => setCardCvv(e.target.value)}
                                        placeholder="•••"
                                        maxLength="3"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-warmOrange/20 focus:border-warmOrange text-center tracking-widest"
                                    />
                                </div>
                            </div>
                             <p className="text-xs text-gray-500 mt-2 text-center">Your payment details are securely encrypted.</p>
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
                  <div key={item.id} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded-xl">
                    <div className="flex space-x-3 items-center">
                        <img src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} alt={item.name} className="w-12 h-12 object-cover rounded-lg shadow-sm" />
                        <div>
                          <p className="text-gray-900 font-bold truncate w-28">{item.name}</p>
                          <p className="text-warmOrange font-bold text-xs">{item.quantity}x</p>
                        </div>
                    </div>
                    <span className="font-bold text-gray-900">₹{(parseFloat(String(item.price).replace(/[₹$,]/g, '')) * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 pt-4 border-t border-gray-50">
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>GST (5%)</span>
                  <span>₹{tax.toFixed(0)}</span>
                </div>
                {discountApplied > 0 && (
                   <div className="flex justify-between text-green-600 font-bold text-sm">
                     <span>Discount Applied</span>
                     <span>-₹{discountApplied.toFixed(0)}</span>
                   </div>
                )}
                <div className="bg-peach-50/50 p-3 rounded-xl border border-peach-100 flex justify-between items-center mt-2">
                   <p className="text-sm font-bold text-gray-700">Estimated Delivery:</p>
                   <p className="text-sm font-black text-warmOrange">30-40 minutes</p>
                </div>
                <div className="flex justify-between items-baseline pt-4 mt-4 border-t border-peach-100">
                  <span className="text-xl font-bold text-gray-900">Grand Total</span>
                  <span className="text-3xl font-extrabold text-warmOrange">
                    ₹{grandTotal.toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Apply Coupon Section */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                 <p className="text-sm font-bold text-gray-900 mb-3">Apply Promo Code</p>
                 <div className="flex space-x-2">
                    <input 
                      type="text" 
                      value={couponCode}
                      onChange={(e) => {
                          setCouponCode(e.target.value);
                          setCouponMessage({ text: '', type: '' });
                      }}
                      disabled={discountApplied > 0}
                      placeholder="e.g. HUNGRY50"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-warmOrange/20 focus:border-warmOrange text-sm uppercase disabled:bg-gray-50 disabled:text-gray-500"
                    />
                    {discountApplied > 0 ? (
                      <button 
                        onClick={removeCoupon}
                        className="px-4 py-2 bg-red-100 text-red-600 font-bold rounded-xl hover:bg-red-200 transition-colors text-sm"
                      >
                          Remove
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleApplyCoupon()}
                        className="px-4 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors text-sm"
                      >
                          Apply
                      </button>
                    )}
                 </div>
                 {couponMessage.text && (
                     <p className={`text-xs font-bold mt-2 ${couponMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                         {couponMessage.text}
                     </p>
                 )}
                 
                 {/* Available Coupons Quick Select */}
                 {!discountApplied && (
                     <div className="mt-4">
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Available Coupons</p>
                         <div className="max-h-[340px] overflow-y-auto pr-2 space-y-3 no-scrollbar">
                         
                         {/* HUNGRY50 */}
                         <div 
                           onClick={() => cartTotal >= 199 && handleApplyCoupon('HUNGRY50')} 
                           className={`border p-3 rounded-xl transition-colors flex justify-between items-center ${cartTotal >= 199 ? 'bg-orange-50 border-orange-100 cursor-pointer hover:bg-orange-100 group' : 'bg-gray-50 border-gray-100 opacity-60 pointer-events-none'}`}
                         >
                             <div>
                                 <p className={`font-bold text-sm ${cartTotal >= 199 ? 'text-gray-900' : 'text-gray-500'}`}>HUNGRY50</p>
                                 <p className="text-xs text-gray-500">Flat ₹50 OFF on orders above ₹199</p>
                             </div>
                             {cartTotal >= 199 ? (
                               <span className="text-xs font-bold text-warmOrange group-hover:underline">Apply</span>
                             ) : (
                               <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">Not Eligible</span>
                             )}
                         </div>
                         
                         {/* WELCOME20 */}
                         <div 
                           onClick={() => handleApplyCoupon('WELCOME20')} 
                           className="bg-pink-50 border border-pink-100 p-3 rounded-xl cursor-pointer hover:bg-pink-100 transition-colors flex justify-between items-center group"
                         >
                             <div>
                                 <p className="font-bold text-sm text-gray-900">WELCOME20</p>
                                 <p className="text-xs text-gray-600">20% OFF for new users (Max ₹100)</p>
                             </div>
                             <span className="text-xs font-bold text-pink-500 group-hover:underline">Apply</span>
                         </div>
                         
                         {/* HDFC150 */}
                         <div 
                           onClick={() => cartTotal >= 599 && handleApplyCoupon('HDFC150')} 
                           className={`border p-3 rounded-xl transition-colors flex justify-between items-center ${cartTotal >= 599 ? 'bg-blue-50 border-blue-100 cursor-pointer hover:bg-blue-100 group' : 'bg-gray-50 border-gray-100 opacity-60 pointer-events-none'}`}
                         >
                             <div>
                                 <div className="flex items-center space-x-2">
                                     <p className={`font-bold text-sm ${cartTotal >= 599 ? 'text-gray-900' : 'text-gray-500'}`}>HDFC150</p>
                                     <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-bold tracking-wider">BANK OFFER</span>
                                 </div>
                                 <p className="text-xs text-gray-500 mt-1">Flat ₹150 OFF with HDFC Bank Cards (Min ₹599)</p>
                             </div>
                             {cartTotal >= 599 ? (
                               <span className="text-xs font-bold text-blue-600 group-hover:underline">Apply</span>
                             ) : (
                               <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">Not Eligible</span>
                             )}
                         </div>

                         {/* FREEDELIVERY */}
                         <div 
                           onClick={() => cartTotal >= 499 && handleApplyCoupon('FREEDELIVERY')} 
                           className={`border p-3 rounded-xl transition-colors flex justify-between items-center ${cartTotal >= 499 ? 'bg-purple-50 border-purple-100 cursor-pointer hover:bg-purple-100 group' : 'bg-gray-50 border-gray-100 opacity-60 pointer-events-none'}`}
                         >
                             <div>
                                 <p className={`font-bold text-sm ${cartTotal >= 499 ? 'text-gray-900' : 'text-gray-500'}`}>FREEDELIVERY</p>
                                 <p className="text-xs text-gray-500">Free delivery on orders above ₹499</p>
                             </div>
                             {cartTotal >= 499 ? (
                               <span className="text-xs font-bold text-purple-600 group-hover:underline">Apply</span>
                             ) : (
                               <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">Not Eligible</span>
                             )}
                         </div>

                         {/* PAYUPI */}
                         <div 
                           onClick={() => cartTotal >= 149 && handleApplyCoupon('PAYUPI')} 
                           className={`border p-3 rounded-xl transition-colors flex justify-between items-center ${cartTotal >= 149 ? 'bg-cyan-50 border-cyan-100 cursor-pointer hover:bg-cyan-100 group' : 'bg-gray-50 border-gray-100 opacity-60 pointer-events-none'}`}
                         >
                             <div>
                                 <div className="flex items-center space-x-2">
                                     <p className={`font-bold text-sm ${cartTotal >= 149 ? 'text-gray-900' : 'text-gray-500'}`}>PAYUPI</p>
                                     <span className="text-[10px] bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded border border-cyan-200 font-bold tracking-wider">UPI OFFER</span>
                                 </div>
                                 <p className="text-xs text-gray-500 mt-1">Flat ₹30 OFF via any UPI App (Min ₹149)</p>
                             </div>
                             {cartTotal >= 149 ? (
                               <span className="text-xs font-bold text-cyan-600 group-hover:underline">Apply</span>
                             ) : (
                               <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">Not Eligible</span>
                             )}
                         </div>

                         {/* MASTER50 */}
                         <div 
                           onClick={() => cartTotal >= 299 && handleApplyCoupon('MASTER50')} 
                           className={`border p-3 rounded-xl transition-colors flex justify-between items-center ${cartTotal >= 299 ? 'bg-indigo-50 border-indigo-100 cursor-pointer hover:bg-indigo-100 group' : 'bg-gray-50 border-gray-100 opacity-60 pointer-events-none'}`}
                         >
                             <div>
                                 <div className="flex items-center space-x-2">
                                     <p className={`font-bold text-sm ${cartTotal >= 299 ? 'text-gray-900' : 'text-gray-500'}`}>MASTER50</p>
                                     <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 font-bold tracking-wider">CARDS OFFER</span>
                                 </div>
                                 <p className="text-xs text-gray-500 mt-1">Flat ₹50 OFF on Mastercard (Min ₹299)</p>
                             </div>
                             {cartTotal >= 299 ? (
                               <span className="text-xs font-bold text-indigo-600 group-hover:underline">Apply</span>
                             ) : (
                               <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">Not Eligible</span>
                             )}
                         </div>

                         {/* AMZPAY */}
                         <div 
                           onClick={() => cartTotal >= 199 && handleApplyCoupon('AMZPAY')} 
                           className={`border p-3 rounded-xl transition-colors flex justify-between items-center ${cartTotal >= 199 ? 'bg-amber-50 border-amber-100 cursor-pointer hover:bg-amber-100 group' : 'bg-gray-50 border-gray-100 opacity-60 pointer-events-none'}`}
                         >
                             <div>
                                 <div className="flex items-center space-x-2">
                                     <p className={`font-bold text-sm ${cartTotal >= 199 ? 'text-gray-900' : 'text-gray-500'}`}>AMZPAY</p>
                                     <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded border border-amber-200 font-bold tracking-wider">WALLET</span>
                                 </div>
                                 <p className="text-xs text-gray-500 mt-1">10% OFF up to ₹100 via Amazon Pay</p>
                             </div>
                             {cartTotal >= 199 ? (
                               <span className="text-xs font-bold text-amber-600 group-hover:underline">Apply</span>
                             ) : (
                               <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">Not Eligible</span>
                             )}
                         </div>

                         {/* PAYTM */}
                         <div 
                           onClick={() => cartTotal >= 199 && handleApplyCoupon('PAYTM')} 
                           className={`border p-3 rounded-xl transition-colors flex justify-between items-center ${cartTotal >= 199 ? 'bg-blue-50 border-blue-100 cursor-pointer hover:bg-blue-100 group' : 'bg-gray-50 border-gray-100 opacity-60 pointer-events-none'}`}
                         >
                             <div>
                                 <div className="flex items-center space-x-2">
                                     <p className={`font-bold text-sm ${cartTotal >= 199 ? 'text-gray-900' : 'text-gray-500'}`}>PAYTM</p>
                                     <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-bold tracking-wider">WALLET</span>
                                 </div>
                                 <p className="text-xs text-gray-500 mt-1">Flat ₹40 OFF via Paytm Wallet (Min ₹199)</p>
                             </div>
                             {cartTotal >= 199 ? (
                               <span className="text-xs font-bold text-blue-600 group-hover:underline">Apply</span>
                             ) : (
                               <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">Not Eligible</span>
                             )}
                         </div>
                         
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
