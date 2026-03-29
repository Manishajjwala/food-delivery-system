import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
  User, MapPin, Package, Clock, CheckCircle, Home, Briefcase, Plus, 
  Edit2, Trash2, CreditCard, LogOut, Star, Settings, Shield, Phone, ShoppingBag, X, ChevronRight
} from 'lucide-react';

const dummyOrders = [
  {
    id: 'ORD-8943',
    date: 'Oct 24, 2023',
    items: ['Margherita Pizza x1', 'Garlic Naan x2'],
    total: '₹1599',
    status: 'Delivered',
  },
  {
    id: 'ORD-7592',
    date: 'Oct 20, 2023',
    items: ['Truffle Pasta x2'],
    total: '₹2500',
    status: 'Delivered',
  },
  {
    id: 'ORD-6120',
    date: 'Oct 15, 2023',
    items: ['Veggie Burger x1', 'Macaron Box x1'],
    total: '₹1850',
    status: 'Delivered',
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // User Auth States
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'Hungry User');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || 'user@hungry.com');
  const [userPhone, setUserPhone] = useState(localStorage.getItem('userPhone') || '+91 98765 43210');
  const userRole = localStorage.getItem('userRole') || 'user';
  
  // Tabs State
  const [activeTab, setActiveTab] = useState('profile');

  // Orders State
  const [orders, setOrders] = useState([]);
  
  // Review Modal State
  const [reviewOrder, setReviewOrder] = useState(null);
  const [foodRating, setFoodRating] = useState(5);
  const [foodComment, setFoodComment] = useState('');
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [deliveryComment, setDeliveryComment] = useState('');

  // Address State
  const [userAddresses, setUserAddresses] = useState(() => {
    const saved = localStorage.getItem('userAddresses');
    if (saved) return JSON.parse(saved);
    const legacy = localStorage.getItem('userAddress');
    return legacy ? [{ id: '1', type: 'Home', details: legacy || '123 Culinary Boulevard, Apt 4B, Foodville, NY 10001' }] : [];
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState('');
  const [newAddressType, setNewAddressType] = useState('Home');

  // Payment State
  const [userPayments, setUserPayments] = useState(() => {
    const saved = localStorage.getItem('userPayments');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', type: 'Card', details: '**** **** **** 4242' },
      { id: '2', type: 'UPI', details: 'user@okhdfcbank' }
    ];
  });
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [newPaymentType, setNewPaymentType] = useState('Card');
  const [newPaymentDetails, setNewPaymentDetails] = useState('');

  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [editPhone, setEditPhone] = useState(userPhone);
  const [editPassword, setEditPassword] = useState('');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') {
      navigate('/login');
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const response = await fetch('http://localhost:5000/api/orders/myorders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        // Map backend orders to frontend format
        const formattedOrders = data.map(o => ({
          id: o._id,
          date: new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          items: o.orderItems.map(i => `${i.name} x${i.quantity}`),
          total: `₹${o.totalPrice}`,
          status: o.status,
          review: o.review
        }));

        setOrders(formattedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        const savedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        setOrders(savedOrders);
      }
    };

    fetchOrders();
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem('userAddresses', JSON.stringify(userAddresses));
  }, [userAddresses]);

  useEffect(() => {
    localStorage.setItem('userPayments', JSON.stringify(userPayments));
  }, [userPayments]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const handleSaveProfile = () => {
    setUserName(editName);
    setUserPhone(editPhone);
    localStorage.setItem('userName', editName);
    localStorage.setItem('userPhone', editPhone);
    if (editPassword) {
      localStorage.setItem('userPassword', editPassword); // Note: Simple mock logic for frontend only
    }
    setIsEditingProfile(false);
  };

  const handleSaveAddress = () => {
    if (newAddress.length < 5) return;
    if (editingAddressId) {
      setUserAddresses(prev => prev.map(a => a.id === editingAddressId ? { ...a, type: newAddressType, details: newAddress } : a));
    } else {
      setUserAddresses(prev => [...prev, { id: Date.now().toString(), type: newAddressType, details: newAddress }]);
    }
    setIsAddingAddress(false);
    setEditingAddressId(null);
    setNewAddress('');
    setNewAddressType('Home');
  };

  const handleDeleteAddress = (id) => {
    setUserAddresses(prev => prev.filter(a => a.id !== id));
  };

  const handleEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setNewAddress(addr.details);
    setNewAddressType(addr.type);
    setIsAddingAddress(true);
  };

  const handleSavePayment = () => {
    setUserPayments(prev => [...prev, { id: Date.now().toString(), type: newPaymentType, details: newPaymentDetails || newPaymentType }]);
    setIsAddingPayment(false);
    setNewPaymentDetails('');
    setNewPaymentType('Card');
  };

  const handleDeletePayment = (id) => {
    setUserPayments(prev => prev.filter(p => p.id !== id));
  };

  const handleReorder = (orderItems) => {
    orderItems.forEach(itemStr => {
      const match = itemStr.match(/(.+) x(\d+)/);
      if (match) {
        const name = match[1];
        const qty = parseInt(match[2], 10);
        for (let i = 0; i < qty; i++) {
           addToCart({ id: name, name, price: '₹200', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' });
        }
      } else {
         addToCart({ id: itemStr, name: itemStr, price: '₹200', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' });
      }
    });
    navigate('/cart');
  };

  const handleCancelOrder = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      const savedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      const updatedOrders = savedOrders.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o);
      localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o));
    }
  };

  const handleSubmitReview = () => {
    const updatedOrders = orders.map(o => {
      if (o.id === reviewOrder.id) {
         return {
           ...o,
           review: { foodRating, foodComment, deliveryRating, deliveryComment }
         };
      }
      return o;
    });
    setOrders(updatedOrders);
    
    const savedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const isReal = savedOrders.find(o => o.id === reviewOrder.id);
    if (isReal) {
       const mapped = savedOrders.map(o => o.id === reviewOrder.id ? { ...o, review: { foodRating, foodComment, deliveryRating, deliveryComment } } : o);
       localStorage.setItem('userOrders', JSON.stringify(mapped));
    }

    setReviewOrder(null);
    setFoodRating(5); setFoodComment(''); setDeliveryRating(5); setDeliveryComment('');
  };

  const handleExportCSV = () => {
    if (orders.length === 0) return alert('No orders to export!');
    
    const headers = ['Order ID', 'Date', 'Items', 'Total', 'Status'];
    
    const csvRows = orders.map(order => {
      const itemsString = order.items.join(', ').replace(/"/g, '""');
      return [
        order.id,
        order.date,
        `"${itemsString}"`,
        order.total.toString().replace(/[₹$,]/g, ''),
        order.status
      ].join(',');
    });
    
    const csvString = [headers.join(','), ...csvRows].join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.hidden = true;
    a.href = url;
    a.download = `hungry_orders_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (userRole === 'admin') {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => {
        const amount = parseFloat(order.total.toString().replace(/[₹$,]/g, ''));
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(0) : 0;

    return (
      <div className="bg-cream min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 pt-8 md:pt-0">
          <div className="flex justify-between items-center mb-10">
            <div className="flex flex-col">
                <span className="text-warmOrange font-bold tracking-widest text-sm uppercase mb-1 flex items-center"><Star size={14} className="mr-1" fill="currentColor"/> Admin Panel</span>
                <h2 className="text-4xl font-black text-gray-900 font-serif tracking-tight">Business Overview</h2>
                <p className="text-gray-500 mt-2 text-sm leading-relaxed max-w-md">Track your real-time performance, monitor revenue, and manage recent orders effectively.</p>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-peach-100 flex items-center justify-center text-warmOrange">
                        <User size={16} />
                    </div>
                    <span className="font-bold text-gray-900">{userName}</span>
                </div>
                <button onClick={handleLogout} className="flex items-center space-x-2 bg-red-50 text-red-500 px-4 py-2 rounded-full border border-red-100 hover:bg-red-100 transition-colors font-bold text-sm shadow-sm">
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-peach-50 relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative z-10">
                      <p className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-2">Total Revenue (Profit)</p>
                      <h3 className="text-4xl font-black text-gray-900">₹{totalRevenue.toLocaleString()}</h3>
                      <p className="text-green-500 text-sm font-bold mt-2 flex items-center"><span className="mr-1">↑</span> 12% from last month</p>
                  </div>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-peach-50 relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative z-10">
                      <p className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-2">Total Orders</p>
                      <h3 className="text-4xl font-black text-gray-900">{totalOrders}</h3>
                      <p className="text-blue-500 text-sm font-bold mt-2 flex items-center"><span className="mr-1">↑</span> 8% from last month</p>
                  </div>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-peach-50 relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-warmOrange/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative z-10">
                      <p className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-2">Avg. Order Value</p>
                      <h3 className="text-4xl font-black text-gray-900">₹{avgOrderValue}</h3>
                      <p className="text-warmOrange text-sm font-bold mt-2 flex items-center"><span className="mr-1">↑</span> 5% from last month</p>
                  </div>
              </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-peach-50 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="text-xl font-bold text-gray-900 font-serif">Recent Transactions</h3>
                  <button onClick={handleExportCSV} className="text-sm font-bold text-warmOrange hover:bg-peach-50 px-4 py-2 rounded-lg transition-colors">Export CSV</button>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="bg-white text-gray-400 text-sm uppercase tracking-wider border-b border-gray-100">
                              <th className="p-6 font-bold">Order ID</th>
                              <th className="p-6 font-bold">Date</th>
                              <th className="p-6 font-bold">Items</th>
                              <th className="p-6 font-bold">Total</th>
                              <th className="p-6 font-bold">Status</th>
                          </tr>
                      </thead>
                      <tbody>
                          {orders.map((order, idx) => (
                              <tr key={order.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                  <td className="p-6 font-bold text-gray-900">{order.id}</td>
                                  <td className="p-6 text-gray-500 whitespace-nowrap">{order.date}</td>
                                  <td className="p-6 text-gray-600 truncate max-w-xs" title={order.items.join(', ')}>{order.items.join(', ')}</td>
                                  <td className="p-6 font-bold text-gray-900">₹{order.total.toString().replace(/[₹$,]/g, '')}</td>
                                  <td className="p-6">
                                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                                          order.status === 'Placed' ? 'bg-blue-100 text-blue-700' : 'bg-warmOrange/20 text-warmOrange'
                                      }`}>{order.status}</span>
                                  </td>
                              </tr>
                          ))}
                          {orders.length === 0 && (
                              <tr><td colSpan="5" className="p-10 text-center text-gray-400 font-medium">No order history available.</td></tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular User Layout
  return (
    <div className="bg-cream min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="md:w-1/4">
           <div className="bg-white rounded-3xl p-6 shadow-sm border border-peach-50 sticky top-24">
              <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-100">
                  <div className="w-20 h-20 bg-peach-100 rounded-full flex items-center justify-center text-warmOrange mb-4">
                      <User size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{userName}</h3>
                  <p className="text-gray-500 text-sm">{userEmail}</p>
              </div>

              <div className="space-y-2">
                 <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-bold text-sm ${activeTab === 'profile' ? 'bg-warmOrange text-white shadow-md' : 'text-gray-600 hover:bg-peach-50 hover:text-warmOrange'}`}>
                    <User size={18} /> <span>Profile Info</span>
                 </button>
                 <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-bold text-sm ${activeTab === 'orders' ? 'bg-warmOrange text-white shadow-md' : 'text-gray-600 hover:bg-peach-50 hover:text-warmOrange'}`}>
                    <ShoppingBag size={18} /> <span>My Orders</span>
                 </button>
                 <button onClick={() => setActiveTab('addresses')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-bold text-sm ${activeTab === 'addresses' ? 'bg-warmOrange text-white shadow-md' : 'text-gray-600 hover:bg-peach-50 hover:text-warmOrange'}`}>
                    <MapPin size={18} /> <span>Saved Addresses</span>
                 </button>
                 <button onClick={() => setActiveTab('payments')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-bold text-sm ${activeTab === 'payments' ? 'bg-warmOrange text-white shadow-md' : 'text-gray-600 hover:bg-peach-50 hover:text-warmOrange'}`}>
                    <CreditCard size={18} /> <span>Payment Methods</span>
                 </button>
                 <div className="pt-4 mt-4 border-t border-gray-100">
                   <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-bold text-sm text-red-500 hover:bg-red-50">
                      <LogOut size={18} /> <span>Logout</span>
                   </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Main Content Area */}
        <div className="md:w-3/4">
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-peach-50 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-2xl font-bold text-gray-900 font-serif mb-6">Profile Information</h2>
              {isEditingProfile ? (
                 <div className="max-w-md space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                      <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:border-warmOrange focus:ring-2 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                      <input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:border-warmOrange focus:ring-2 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">New Password (optional)</label>
                      <input type="password" value={editPassword} onChange={e => setEditPassword(e.target.value)} placeholder="Leave blank to keep current" className="w-full p-3 border border-gray-200 rounded-xl focus:border-warmOrange focus:ring-2 outline-none" />
                    </div>
                    <div className="flex space-x-3 pt-4">
                       <button onClick={handleSaveProfile} className="flex-1 bg-warmOrange text-white font-bold py-3 rounded-xl hover:bg-peach-600 transition-colors">Save Changes</button>
                       <button onClick={() => setIsEditingProfile(false)} className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                    </div>
                 </div>
              ) : (
                 <div className="space-y-6 max-w-lg">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                       <div className="flex items-center space-x-4">
                          <div className="p-3 bg-white text-gray-400 rounded-xl shadow-sm"><User size={20} /></div>
                          <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Name</p><p className="font-bold text-gray-900">{userName}</p></div>
                       </div>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                       <div className="flex items-center space-x-4">
                          <div className="p-3 bg-white text-gray-400 rounded-xl shadow-sm"><Package size={20} /></div>
                          <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</p><p className="font-bold text-gray-900">{userEmail}</p></div>
                       </div>
                       <span className="text-xs bg-green-100 text-green-600 font-bold px-2 py-1 rounded">Verified</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                       <div className="flex items-center space-x-4">
                          <div className="p-3 bg-white text-gray-400 rounded-xl shadow-sm"><Phone size={20} /></div>
                          <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</p><p className="font-bold text-gray-900">{userPhone}</p></div>
                       </div>
                    </div>
                    <button onClick={() => setIsEditingProfile(true)} className="mt-8 bg-white border-2 border-warmOrange text-warmOrange font-bold py-3 px-6 rounded-xl hover:bg-warmOrange hover:text-white transition-colors flex items-center space-x-2">
                       <Settings size={18} /> <span>Edit Profile Settings</span>
                    </button>
                 </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-peach-50 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-2xl font-bold text-gray-900 font-serif mb-6">Order History</h2>
              <div className="space-y-6">
                {orders.map(order => (
                   <div key={order.id} className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                      <div className="bg-gray-50 p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                         <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</p>
                            <p className="font-bold text-gray-900">{order.id}</p>
                         </div>
                         <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date</p>
                            <p className="font-bold text-gray-900">{order.date}</p>
                         </div>
                         <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-warmOrange/20 text-warmOrange'}`}>
                              {order.status}
                            </span>
                         </div>
                         <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total</p>
                            <p className="font-black text-warmOrange mt-1 uppercase">₹{order.total.toString().replace(/[₹$,]/g, '')}</p>
                         </div>
                      </div>
                      <div className="p-6">
                         <div className="mb-6">
                            <p className="text-sm font-bold text-gray-900 mb-2">Items Ordered:</p>
                            <p className="text-sm text-gray-600 leading-relaxed">{order.items.join(', ')}</p>
                         </div>

                         {order.review && (
                           <div className="bg-peach-50/30 p-4 rounded-xl mb-6 border border-peach-100">
                              <h4 className="font-bold text-sm text-gray-900 mb-3 flex items-center"><Star size={16} className="text-yellow-400 mr-2" fill="currentColor" /> Your Review</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                 <div><p className="font-bold text-gray-700 text-xs">Food ({order.review.foodRating}/5):</p><p className="text-gray-600 italic">"{order.review.foodComment}"</p></div>
                                 <div><p className="font-bold text-gray-700 text-xs">Delivery ({order.review.deliveryRating}/5):</p><p className="text-gray-600 italic">"{order.review.deliveryComment}"</p></div>
                              </div>
                           </div>
                         )}
                         
                         <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-4">
                            {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                               <>
                                 <Link to={`/order/${order.id}`} className="px-4 py-2 bg-warmOrange text-white text-sm font-bold rounded-lg hover:bg-peach-600 transition-colors text-center w-full sm:w-auto">Track Order</Link>
                                 <button onClick={() => handleCancelOrder(order.id)} className="px-4 py-2 bg-white border border-gray-200 text-red-500 text-sm font-bold rounded-lg hover:bg-red-50 transition-colors w-full sm:w-auto">Cancel Order</button>
                               </>
                            )}
                            {order.status === 'Delivered' && (
                               <>
                                 <button onClick={() => handleReorder(order.items)} className="px-4 py-2 bg-warmOrange text-white text-sm font-bold rounded-lg hover:bg-peach-600 transition-colors flex items-center justify-center w-full sm:w-auto"><ShoppingBag size={16} className="mr-2" /> Reorder</button>
                                 {!order.review && (
                                    <button onClick={() => setReviewOrder(order)} className="px-4 py-2 bg-white border border-gray-200 text-warmOrange text-sm font-bold rounded-lg hover:bg-peach-50 transition-colors flex items-center justify-center w-full sm:w-auto"><Star size={16} className="mr-2" /> Leave Review</button>
                                 )}
                               </>
                            )}
                         </div>
                      </div>
                   </div>
                ))}
                {orders.length === 0 && (
                   <div className="text-center py-12 text-gray-400 font-bold border-2 border-dashed border-gray-100 rounded-2xl">
                      <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
                      No orders found!
                   </div>
                )}
              </div>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-peach-50 animate-in fade-in slide-in-from-bottom-4">
               <h2 className="text-2xl font-bold text-gray-900 font-serif mb-6">Saved Addresses</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                 {!isAddingAddress && userAddresses.map(addr => (
                   <div key={addr.id} className="border border-gray-100 p-5 rounded-2xl bg-gray-50 flex flex-col justify-between group">
                     <div>
                       <div className="flex items-center space-x-2 mb-3">
                         {addr.type === 'Home' ? <Home size={18} className="text-warmOrange" /> : addr.type === 'Work' ? <Briefcase size={18} className="text-warmOrange" /> : <MapPin size={18} className="text-warmOrange" />}
                         <p className="font-bold text-gray-900">{addr.type}</p>
                       </div>
                       <p className="text-gray-600 text-sm leading-relaxed mb-4">{addr.details}</p>
                     </div>
                     <div className="flex space-x-3 pt-4 border-t border-gray-100">
                        <button onClick={() => handleEditAddress(addr)} className="text-xs font-bold text-gray-500 hover:text-warmOrange flex items-center"><Edit2 size={14} className="mr-1" /> Edit</button>
                        <button onClick={() => handleDeleteAddress(addr.id)} className="text-xs font-bold text-gray-500 hover:text-red-500 flex items-center"><Trash2 size={14} className="mr-1" /> Delete</button>
                     </div>
                   </div>
                 ))}
               </div>
               
               {isAddingAddress ? (
                 <div className="border border-warmOrange p-6 rounded-2xl bg-peach-50/20 mb-4 animate-in fade-in slide-in-from-top-2">
                    <p className="font-bold text-gray-900 mb-4">{editingAddressId ? 'Edit Address' : 'Add New Address'}</p>
                    <div className="flex space-x-2 mb-4">
                      {['Home', 'Work', 'Other'].map(type => (
                        <button key={type} onClick={() => setNewAddressType(type)} className={`px-4 py-2 text-xs font-bold rounded-full border transition-colors ${newAddressType === type ? 'bg-warmOrange text-white border-warmOrange' : 'bg-white text-gray-500 border-gray-200'}`}>{type}</button>
                      ))}
                    </div>
                    <textarea value={newAddress} onChange={(e) => setNewAddress(e.target.value)} className="w-full p-4 border border-peach-200 focus:border-warmOrange rounded-xl bg-white outline-none focus:ring-2 focus:ring-warmOrange/20 min-h-[120px] text-gray-700 text-sm mb-4" placeholder="Apartment name, street, nearby landmark, city, pincode..." />
                    <div className="flex space-x-3">
                       <button onClick={handleSaveAddress} disabled={newAddress.length < 5} className="bg-warmOrange text-white text-sm font-bold py-3 px-6 rounded-xl hover:bg-peach-600 disabled:opacity-50">Save Address</button>
                       <button onClick={() => { setIsAddingAddress(false); setEditingAddressId(null); setNewAddress(''); setNewAddressType('Home'); }} className="bg-white text-gray-500 border border-gray-200 text-sm font-bold py-3 px-6 rounded-xl hover:bg-gray-50">Cancel</button>
                    </div>
                 </div>
               ) : (
                 <button onClick={() => setIsAddingAddress(true)} className="w-full bg-white text-warmOrange font-bold border-2 border-dashed border-peach-200 hover:border-warmOrange hover:bg-peach-50/50 py-4 rounded-xl transition-colors flex items-center justify-center space-x-2">
                   <Plus size={20} /><span>Add New Address</span>
                 </button>
               )}
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-peach-50 animate-in fade-in slide-in-from-bottom-4">
               <h2 className="text-2xl font-bold text-gray-900 font-serif mb-6">Payment Methods</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                 {!isAddingPayment && userPayments.map(pay => (
                   <div key={pay.id} className="border border-gray-100 p-5 rounded-2xl bg-gray-50 flex flex-col justify-between group">
                     <div>
                       <div className="flex items-center space-x-2 mb-3">
                         {pay.type === 'Card' ? <CreditCard size={18} className="text-gray-700" /> : pay.type === 'Cash on Delivery' ? <CheckCircle size={18} className="text-green-500" /> : <Shield size={18} className="text-blue-500" />}
                         <p className="font-bold text-gray-900">{pay.type}</p>
                       </div>
                       <p className="text-gray-600 text-sm tracking-widest">{pay.details}</p>
                     </div>
                     <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
                        <button onClick={() => handleDeletePayment(pay.id)} className="text-xs font-bold text-gray-500 hover:text-red-500 flex items-center"><Trash2 size={14} className="mr-1" /> Remove</button>
                     </div>
                   </div>
                 ))}
               </div>
               
               {isAddingPayment ? (
                 <div className="border border-gray-200 p-6 rounded-2xl bg-white mb-4 animate-in fade-in slide-in-from-top-2">
                    <p className="font-bold text-gray-900 mb-4">Add Payment Method</p>
                    <div className="flex space-x-2 mb-4">
                      {['Card', 'UPI', 'Cash on Delivery'].map(type => (
                        <button key={type} onClick={() => setNewPaymentType(type)} className={`px-4 py-2 text-xs font-bold rounded-full border transition-colors ${newPaymentType === type ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200'}`}>{type}</button>
                      ))}
                    </div>
                    {newPaymentType !== 'Cash on Delivery' && (
                       <input value={newPaymentDetails} onChange={(e) => setNewPaymentDetails(e.target.value)} className="w-full p-4 border border-gray-200 focus:border-gray-500 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-gray-200 text-sm mb-4" placeholder={newPaymentType === 'Card' ? 'Card Number (**** **** **** ****)' : 'UPI ID (example@upi)'} />
                    )}
                    <div className="flex space-x-3">
                       <button onClick={handleSavePayment} disabled={newPaymentType !== 'Cash on Delivery' && newPaymentDetails.length < 5} className="bg-gray-900 text-white text-sm font-bold py-3 px-6 rounded-xl hover:bg-gray-800 disabled:opacity-50">Save Method</button>
                       <button onClick={() => { setIsAddingPayment(false); setNewPaymentDetails(''); }} className="bg-white text-gray-500 border border-gray-200 text-sm font-bold py-3 px-6 rounded-xl hover:bg-gray-50">Cancel</button>
                    </div>
                 </div>
               ) : (
                 <button onClick={() => setIsAddingPayment(true)} className="w-full bg-white text-gray-700 font-bold border-2 border-dashed border-gray-200 hover:border-gray-500 hover:bg-gray-50 py-4 rounded-xl transition-colors flex items-center justify-center space-x-2">
                   <Plus size={20} /><span>Add New Payment Method</span>
                 </button>
               )}
            </div>
          )}

        </div>
      </div>

      {/* Review Modal Fragment */}
      {reviewOrder && (
         <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95">
               <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                  <h2 className="text-2xl font-bold font-serif text-gray-900">Rate your order</h2>
                  <button onClick={() => setReviewOrder(null)} className="text-gray-400 hover:text-gray-900"><X size={24} /></button>
               </div>
               
               <div className="space-y-6">
                  <div>
                     <label className="block text-sm font-bold text-gray-900 mb-2">Food Rating</label>
                     <div className="flex space-x-2 mb-3">
                        {[1,2,3,4,5].map(star => (
                          <button key={star} onClick={() => setFoodRating(star)} className={`p-2 rounded-full ${foodRating >= star ? 'text-yellow-400' : 'text-gray-200'}`}>
                             <Star size={24} fill="currentColor" />
                          </button>
                        ))}
                     </div>
                     <textarea value={foodComment} onChange={e => setFoodComment(e.target.value)} placeholder="How were the dishes?" className="w-full p-3 border border-gray-200 rounded-xl focus:border-warmOrange focus:ring-2 outline-none text-sm min-h-[80px]" />
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-gray-900 mb-2">Delivery Service</label>
                     <div className="flex space-x-2 mb-3">
                        {[1,2,3,4,5].map(star => (
                          <button key={star} onClick={() => setDeliveryRating(star)} className={`p-2 rounded-full ${deliveryRating >= star ? 'text-yellow-400' : 'text-gray-200'}`}>
                             <Star size={24} fill="currentColor" />
                          </button>
                        ))}
                     </div>
                     <textarea value={deliveryComment} onChange={e => setDeliveryComment(e.target.value)} placeholder="How was the delivery experience?" className="w-full p-3 border border-gray-200 rounded-xl focus:border-warmOrange focus:ring-2 outline-none text-sm min-h-[80px]" />
                  </div>

                  <button onClick={handleSubmitReview} disabled={!foodComment || !deliveryComment} className="w-full bg-warmOrange text-white font-bold py-4 rounded-xl hover:bg-peach-600 disabled:opacity-50 mt-4 transition-colors">
                     Submit Review
                  </button>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};

export default Dashboard;
