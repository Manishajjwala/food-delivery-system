import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, ShoppingBag, TrendingUp, LogOut,
  UtensilsCrossed, Trash2, Search, IndianRupee, ShieldCheck,
  AlertCircle, X, Clock, Truck, CheckCircle2, XCircle, Package,
  Plus, Edit2, CheckCircle, Tag, Percent, ArrowRight, Award
} from 'lucide-react';
import { io } from 'socket.io-client';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, Cell, PieChart, Pie 
} from 'recharts';

const API = 'http://localhost:5000/api/admin';
const getToken = () => localStorage.getItem('adminToken') || localStorage.getItem('userToken');

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const statusConfig = {
  pending:    { label: 'Pending', color: '#f59e0b', bg: '#fef3c7', icon: Clock },
  accepted:   { label: 'Confirmed', color: '#0ea5e9', bg: '#e0f2fe', icon: CheckCircle },
  preparing:  { label: 'Preparing', color: '#8b5cf6', bg: '#ede9fe', icon: UtensilsCrossed },
  ready_for_pickup: { label: 'Ready', color: '#10b981', bg: '#d1fae5', icon: Package },
  picked_up:  { label: 'Picked Up', color: '#f97316', bg: '#fff7ed', icon: Truck },
  out_for_delivery: { label: 'Out for Delivery', color: '#3b82f6', bg: '#dbeafe', icon: Truck },
  delivered:  { label: 'Delivered', color: '#16a34a', bg: '#dcfce7', icon: CheckCircle2 },
  cancelled:  { label: 'Cancelled',  color: '#dc2626', bg: '#fee2e2', icon: XCircle },
};

// ─── Peripheral Components ───────────────────────────────────────────────────

const StatCard = ({ icon: Icon, label, value, color, growth, trendLabel = 'vs yesterday', subtitle }) => {
  const isPositive = parseFloat(growth) >= 0;
  return (
    <div className="group relative overflow-hidden p-6 rounded-[2.5rem] bg-white border border-[#f7e8da] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div style={{ background: `${color}15` }} className="p-4 rounded-2xl border border-gray-50 group-hover:scale-110 transition-transform">
          <Icon size={26} style={{ color }} />
        </div>
        {growth !== undefined && (
          <div className={`flex flex-col items-end`}>
            <span className={`text-[13px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
               <TrendingUp size={14} className={!isPositive ? 'rotate-180' : ''} />
               {isPositive ? '+' : ''}{growth}%
            </span>
            <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tight">{trendLabel}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-1">{value}</h3>
        {subtitle && <p className="text-xs font-bold text-gray-500">{subtitle}</p>}
      </div>
      
      {/* Decorative background element */}
      <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
        <Icon size={120} style={{ color }} />
      </div>
    </div>
  );
};


const StatusBadge = ({ status }) => {
  const config = statusConfig[status || 'pending'];
  const Icon = config.icon;
  return (
    <div className="px-3 py-1.5 rounded-full flex items-center gap-1.5 w-fit border" style={{ borderColor: `${config.color}20`, background: config.bg, color: config.color }}>
      <Icon size={14} strokeWidth={2.5} />
      <span className="text-xs font-bold whitespace-nowrap">{config.label}</span>
    </div>
  );
};

const MenuModal = ({ mode, item, onConfirm, onCancel, loading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      category: formData.get('category'),
      price: Number(formData.get('price')),
      image: formData.get('image'),
      description: formData.get('description'),
      isVeg: formData.get('isVeg') === 'on',
      isAvailable: formData.get('isAvailable') === 'on',
    };
    onConfirm(e, data);
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[2rem] overflow-hidden bg-white shadow-2xl border border-peach-100">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-cream">
          <h2 className="text-2xl font-bold text-gray-900 font-serif">
            {mode === 'add' ? 'Add New Menu Item' : 'Edit Menu Item'}
          </h2>
          <button onClick={onCancel} className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Dish Name</label>
              <input name="name" defaultValue={item?.name} required className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-warmOrange/30 bg-gray-50 text-gray-900" placeholder="e.g. Paneer Tikka" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Category</label>
              <input name="category" defaultValue={item?.category} required className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-warmOrange/30 bg-gray-50 text-gray-900" placeholder="e.g. Starters" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Price (₹)</label>
              <input name="price" type="number" defaultValue={item?.price} required className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-warmOrange/30 bg-gray-50 text-gray-900" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Image URL</label>
              <input name="image" defaultValue={item?.image} required className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-warmOrange/30 bg-gray-50 text-gray-900" placeholder="https://..." />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">Description</label>
            <textarea name="description" defaultValue={item?.description} required rows={3} className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-warmOrange/30 bg-gray-50 text-gray-900" />
          </div>
          <div className="flex gap-8 bg-orange-50/50 p-4 rounded-xl border border-peach-50">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" name="isVeg" defaultChecked={item?.isVeg} className="w-5 h-5 rounded accent-green-600" />
              <span className="text-sm font-bold text-gray-700 group-hover:text-green-600 transition-colors">Pure Veg</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" name="isAvailable" defaultChecked={item?.isAvailable !== false} className="w-5 h-5 rounded accent-blue-600" />
              <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">In Stock (Available)</span>
            </label>
          </div>
          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button type="button" onClick={onCancel} className="flex-1 py-4 rounded-xl border-2 border-gray-200 font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all">Cancel</button>
            <button type="submit" disabled={loading} className="flex-[2] py-4 rounded-xl bg-warmOrange text-white font-bold hover:bg-orange-600 transition-all shadow-md">
              {loading ? 'Saving Changes...' : mode === 'add' ? 'Add Dish to Menu' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('analytics');
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [topDishes, setTopDishes] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [offers, setOffers] = useState([
      { id: 1, code: 'HUNGRY50', discount: 50, type: 'flat', isActive: true },
      { id: 2, code: 'WELCOME20', discount: 20, type: 'percent', isActive: true },
      { id: 3, code: 'FREEDELIVERY', discount: 0, type: 'flat', isActive: true }
  ]);
  
  const [loading, setLoading] = useState({ stats: true, users: false, orders: false, menu: false, analytics: true });
  const [notification, setNotification] = useState(null);
  const [userSearch, setUserSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [menuSearch, setMenuSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');

  const [menuModal, setMenuModal] = useState({ open: false, mode: 'add', item: null });
  const [menuLoading, setMenuLoading] = useState(false);

  const adminName = localStorage.getItem('adminName') || 'Restaurant Manager';

  const handleToggleUserStatus = async (id, currentStatus) => {
    const res = await authFetch(`${API}/users/${id}/status`, { method: 'PUT', body: JSON.stringify({ isActive: !currentStatus }) });
    if (res?.ok) { showNotification('Customer status updated'); fetchUsers(); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user entirely? This cannot be undone.')) return;
    const res = await authFetch(`${API}/users/${id}`, { method: 'DELETE' });
    if (res?.ok) { showNotification('User account deleted'); fetchUsers(); }
  };

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const authFetch = useCallback(async (url, options = {}) => {
    const token = getToken();
    try {
      const res = await fetch(url, {
        ...options,
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}`, 
          ...(options.headers || {}) 
        },
      });
      if (res.status === 401 || res.status === 403) {
        localStorage.clear();
        navigate('/login');
        return null;
      }
      return res;
    } catch (err) {
      console.error('Network Error:', err);
      return null;
    }
  }, [navigate]);

  const fetchStats = useCallback(async () => {
    setLoading(p => ({ ...p, stats: true, analytics: true }));
    const [sR, slR, dR] = await Promise.all([
      authFetch(`${API}/stats`),
      authFetch(`${API}/stats/daily-sales`),
      authFetch(`${API}/stats/top-dishes`)
    ]);
    if (sR?.ok) setStats(await sR.json());
    if (slR?.ok) setSalesData(await slR.json());
    if (dR?.ok) setTopDishes(await dR.json());
    setLoading(p => ({ ...p, stats: false, analytics: false }));
  }, [authFetch]);

  const fetchUsers = useCallback(async () => {
    setLoading(p => ({ ...p, users: true }));
    const res = await authFetch(`${API}/users`);
    if (res?.ok) {
      const data = await res.json();
      setUsers(data);
      setDeliveryBoys(data.filter(u => u.role === 'delivery'));
    }
    setLoading(p => ({ ...p, users: false }));
  }, [authFetch]);

  const fetchOrders = useCallback(async () => {
    setLoading(p => ({ ...p, orders: true }));
    const res = await authFetch(`${API}/orders`);
    if (res?.ok) setOrders(await res.json());
    setLoading(p => ({ ...p, orders: false }));
  }, [authFetch]);

  const fetchMenu = useCallback(async () => {
    setLoading(p => ({ ...p, menu: true }));
    const res = await fetch('http://localhost:5000/api/menu');
    if (res?.ok) setMenuItems(await res.json());
    setLoading(p => ({ ...p, menu: false }));
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('isAdminAuthenticated')) return navigate('/login');
    fetchStats(); fetchUsers(); fetchOrders(); fetchMenu();

    // Socket.io for Real-time Dashboard Updates
    const socket = io('http://localhost:5000');
    
    socket.on('ORDER_CREATED', (data) => {
       console.log('New order received:', data.orderId);
       // Play notification sound
       try {
         const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
         audio.play();
       } catch (err) { console.error('Audio fail'); }
       
       showNotification('🚀 NEW ORDER RECEIVED', 'warning');
       fetchOrders();
       fetchStats();
    });

    socket.on('ORDER_STATUS_UPDATED', () => {
       fetchOrders();
       fetchStats();
    });

    socket.on('adminDataUpdated', () => {
       fetchStats();
       fetchOrders();
    });

    return () => socket.disconnect();
  }, [fetchStats, fetchUsers, fetchOrders, fetchMenu, navigate]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const filteredOrders = useMemo(() => {
    let list = orders;
    if (orderFilter !== 'all') list = list.filter(o => o.status === orderFilter);
    if (orderSearch) list = list.filter(o => o._id.toLowerCase().includes(orderSearch.toLowerCase()) || o.user?.name.toLowerCase().includes(orderSearch.toLowerCase()));
    return list;
  }, [orders, orderFilter, orderSearch]);

  const filteredMenu = useMemo(() => {
    return menuItems.filter(item => item.name.toLowerCase().includes(menuSearch.toLowerCase()) || item.category.toLowerCase().includes(menuSearch.toLowerCase()));
  }, [menuItems, menuSearch]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()));
  }, [users, userSearch]);

  const handleUpdateOrderStatus = async (id, status) => {
    const res = await authFetch(`${API}/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
    if (res?.ok) { showNotification(`Order marked as ${status.replace(/_/g, ' ')}`); fetchOrders(); }
  };

  const handleAssignRider = async (orderId, riderId) => {
    if(!riderId) return;
    const res = await authFetch(`${API}/orders/${orderId}/assign`, { method: 'PUT', body: JSON.stringify({ deliveryBoyId: riderId }) });
    if (res?.ok) { showNotification('Delivery partner assigned successfully'); fetchOrders(); }
  };

  const handleMenuSubmit = async (e, data) => {
    e.preventDefault();
    setMenuLoading(true);
    const url = menuModal.mode === 'add' ? 'http://localhost:5000/api/menu' : `http://localhost:5000/api/menu/${menuModal.item._id}`;
    const res = await authFetch(url, { method: menuModal.mode === 'add' ? 'POST' : 'PUT', body: JSON.stringify(data) });
    if (res?.ok) { showNotification(menuModal.mode === 'add' ? 'Menu item added' : 'Menu item updated'); setMenuModal({ open: false }); fetchMenu(); }
    setMenuLoading(false);
  };

  const handleDeleteMenu = async (id) => {
    if (!window.confirm('Are you sure you want to delete this dish from the menu?')) return;
    const res = await authFetch(`http://localhost:5000/api/menu/${id}`, { method: 'DELETE' });
    if (res?.ok) { showNotification('Menu item deleted'); fetchMenu(); }
  };

  const ChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-[#f7e8da]">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-lg font-black text-warmOrange">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  const renderAnalytics = () => (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard 
          icon={IndianRupee} 
          label="Today's Revenue" 
          value={formatCurrency(stats?.todayRevenue || 0)} 
          color="#16a34a" 
          growth={stats?.revenueGrowth} 
          subtitle={`Total: ${formatCurrency(stats?.totalRevenue || 0)}`}
        />
        <StatCard 
          icon={ShoppingBag} 
          label="Today's Orders" 
          value={stats?.todayOrders || 0} 
          color="#f97316" 
          growth={stats?.ordersGrowth} 
          subtitle={`Total: ${stats?.totalOrders || 0} Orders`}
        />
        <StatCard 
          icon={Users} 
          label="Total Customers" 
          value={stats?.totalUsers || 0} 
          color="#3b82f6" 
          growth={5.4} 
        />
        <StatCard 
          icon={Truck} 
          label="Delivery Fleet" 
          value={stats?.totalRiders || 0} 
          color="#ef4444" 
          growth={12.5} 
          trendLabel="active pilots"
        />
        <StatCard 
          icon={TrendingUp} 
          label="Avg Ticket Size" 
          value={formatCurrency(stats?.avgOrderValue || 0)} 
          color="#8b5cf6" 
          growth={2.1} 
          trendLabel="overall avg"
        />
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Weekly Sales Chart */}
        <div className="space-y-4">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-black text-gray-800 font-serif flex items-center gap-2">
                 <div className="w-2 h-8 bg-warmOrange rounded-full"></div>
                 Revenue Trends (Last 7 Days)
              </h3>
           </div>
           
           <div className="bg-white p-8 rounded-[3rem] border border-[#f7e8da] shadow-sm h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData.map(d => ({ ...d, name: new Date(d._id).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) }))}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }}
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }}
                    tickFormatter={(val) => `₹${val/1000}k`}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#f97316" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Top Dishes Chart */}
        <div className="space-y-4">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-black text-gray-800 font-serif flex items-center gap-2">
                 <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                 Popular Dishes by Volume
              </h3>
           </div>

           <div className="bg-white p-8 rounded-[3rem] border border-[#f7e8da] shadow-sm h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topDishes.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="_id" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }}
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-[#f7e8da]">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                            <p className="text-lg font-black text-green-600">{payload[0].value} Units</p>
                            <p className="text-[10px] font-bold text-gray-400">{formatCurrency(payload[0].payload.revenue)} Revenue</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="totalSold" radius={[10, 10, 0, 0]} barSize={40}>
                    {topDishes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#16a34a' : index === 1 ? '#22c55e' : '#86efac'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Insights Row */}
      <div className="p-8 rounded-[3rem] bg-gradient-to-r from-orange-600 to-warmOrange text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1">
               <h3 className="text-2xl font-black font-serif text-white">Deep Insights</h3>
               <p className="text-white/80 font-bold max-w-xl">
                  {stats?.revenueGrowth > 0 
                    ? `Your revenue is trending upwards! Today is ${stats.revenueGrowth}% better than yesterday. Keep up the momentum!` 
                    : "Your business metrics are live. Monitor real-time performance trends and optimize your kitchen operations through the panels above."}
               </p>
            </div>
            <div className="flex gap-4">
               <div className="bg-white/20 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/30 text-center">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-white/70">Efficiency</span>
                  <span className="text-2xl font-black text-white">94%</span>
               </div>
               <div className="bg-white px-8 py-4 rounded-2xl text-center shadow-lg">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Customer ROI</span>
                  <span className="text-2xl font-black text-warmOrange">+12%</span>
               </div>
            </div>
         </div>
         {/* Decoration */}
         <div className="absolute -bottom-10 -right-10 opacity-10">
            <TrendingUp size={200} />
         </div>
      </div>
    </div>
  );



  const renderKDS = () => {
    const kdsColumns = [
      { id: 'pending', label: 'New (Pending)', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
      { id: 'accepted', label: 'Confirmed', color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200' },
      { id: 'preparing', label: 'Kitchen (Preparing)', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
      { id: 'ready_for_pickup', label: 'Ready / Dispatch', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    ];

    return (
      <div className="h-full flex flex-col space-y-6">
        <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-[#f7e8da] shadow-sm shrink-0">
           <div>
               <h3 className="text-xl font-black text-gray-900 font-serif tracking-tight">Kitchen Display System (KDS)</h3>
               <p className="text-sm text-gray-500 font-bold">Real-time order tracking for kitchen staff.</p>
           </div>
           <div className="flex items-center gap-2 text-sm font-black bg-green-50 text-green-600 px-4 py-2 rounded-xl border border-green-200 shadow-sm transition-all hover:bg-green-100 cursor-default">
               <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
               System Live
           </div>
        </div>
        
        <div className="flex-1 flex gap-6 overflow-x-auto pb-4 no-scrollbar items-stretch h-full">
           {kdsColumns.map(col => (
             <div key={col.id} className="min-w-[340px] max-w-[380px] flex-1 flex flex-col bg-gray-50/80 border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
                <div className={`p-5 border-b ${col.border} ${col.bg} font-black flex justify-between items-center shrink-0`}>
                   <span className={`flex items-center gap-2 ${col.color}`}>
                     {col.id === 'pending' && <Clock size={18}/>}
                     {col.id === 'preparing' && <UtensilsCrossed size={18}/>}
                     {col.id === 'out_for_delivery' && <Truck size={18}/>}
                     {col.label}
                   </span>
                   <span className={`px-2.5 py-1 rounded-lg text-xs bg-white shadow-sm ${col.color}`}>
                      {orders.filter(o => o.status === col.id || (col.id === 'out_for_delivery' && (o.status === 'out_for_delivery' || o.status === 'ready_for_pickup'))).length}
                   </span>
                </div>
                <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
                   {orders.filter(o => o.status === col.id || (col.id === 'out_for_delivery' && (o.status === 'out_for_delivery' || o.status === 'ready_for_pickup'))).map(order => (
                     <div key={order._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-warmOrange hover:shadow-md transition-all group flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                           <span className="font-mono text-sm font-black text-gray-800 bg-gray-50 border border-gray-100 px-3 py-1 rounded-md">#{order._id.slice(-5).toUpperCase()}</span>
                           <span className="text-xs font-bold text-gray-400">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <ul className="space-y-1.5 mb-5 border-l-[3px] border-warmOrange/40 pl-3 flex-1">
                           {order.orderItems?.map((item, idx) => (
                             <li key={idx} className="text-sm font-bold text-gray-800 leading-snug flex gap-2">
                                <span className="text-warmOrange">{item.quantity}x</span> {item.name}
                             </li>
                           ))}
                        </ul>
                        {col.id === 'pending' && (
                           <button onClick={() => handleUpdateOrderStatus(order._id, 'accepted')} className="w-full py-3 bg-sky-600 text-white text-sm font-black rounded-xl hover:bg-sky-700 flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all shrink-0">
                             Confirm Order <ArrowRight size={16}/>
                           </button>
                        )}
                        {col.id === 'accepted' && (
                           <button onClick={() => handleUpdateOrderStatus(order._id, 'preparing')} className="w-full py-3 bg-purple-600 text-white text-sm font-black rounded-xl hover:bg-purple-700 flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all shrink-0">
                             Send to Kitchen <ArrowRight size={16}/>
                           </button>
                        )}
                        {col.id === 'preparing' && (
                           <button onClick={() => handleUpdateOrderStatus(order._id, 'ready_for_pickup')} className="w-full py-3 bg-green-600 text-white text-sm font-black rounded-xl hover:bg-green-700 flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all shrink-0">
                             Mark as Ready <ArrowRight size={16}/>
                           </button>
                        )}
                        {col.id === 'ready_for_pickup' && (
                           <div className="w-full py-3 bg-gray-100 text-gray-500 text-xs font-black rounded-xl flex items-center justify-center gap-1.5 border border-gray-200 italic">
                             Waiting for Rider...
                           </div>
                        )}
                     </div>
                   ))}
                   {orders.filter(o => o.status === col.id || (col.id === 'out_for_delivery' && (o.status === 'out_for_delivery' || o.status === 'ready_for_pickup'))).length === 0 && (
                     <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10 opacity-70">
                       <CheckCircle size={40} className="mb-2 opacity-20" />
                       <span className="text-sm font-bold">No orders</span>
                     </div>
                   )}
                </div>
             </div>
           ))}
        </div>
      </div>
    );
  };

  const renderOffers = () => (
    <div className="space-y-6">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 p-8 rounded-[2rem] bg-white border border-[#f7e8da] shadow-sm h-fit">
             <h3 className="text-xl font-bold font-serif text-gray-900 mb-6 flex items-center gap-2"><Tag size={20} className="text-warmOrange"/> Create Promo Code</h3>
             <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); showNotification('Promo code created successfully! (Mock)'); e.target.reset(); }}>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">Code (e.g., FESTIVE20)</label>
                  <input required className="w-full p-3.5 rounded-xl border border-gray-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-warmOrange/30 focus:border-warmOrange uppercase bg-gray-50 text-gray-900" placeholder="HELLO20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Type</label>
                    <select className="w-full p-3.5 rounded-xl border border-gray-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-warmOrange/30 focus:border-warmOrange bg-gray-50">
                       <option value="percent">% Percentage</option>
                       <option value="flat">₹ Flat Amount</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Value</label>
                    <input type="number" required placeholder="50" className="w-full p-3.5 rounded-xl border border-gray-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-warmOrange/30 focus:border-warmOrange bg-gray-50 text-gray-900" />
                  </div>
                </div>
                <button type="submit" className="w-full mt-4 py-4 bg-warmOrange hover:bg-orange-600 text-white rounded-xl font-black text-sm shadow-md transition-all flex justify-center items-center gap-2">
                   <Plus size={18}/> Publish Promo Code
                </button>
             </form>
          </div>
          
          <div className="lg:col-span-2 space-y-6 p-8 rounded-[2rem] bg-white border border-[#f7e8da] shadow-sm">
             <h3 className="text-xl font-bold font-serif text-gray-900 flex items-center gap-2 mb-2"><Percent size={20} className="text-warmOrange"/> Active Campaigns</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {offers.map(offer => (
                   <div key={offer.id} className="group relative overflow-hidden p-6 rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-white hover:border-warmOrange/40 transition-all shadow-sm">
                      <div className="absolute top-0 right-0 py-1.5 px-4 bg-green-100 rounded-bl-2xl opacity-90 group-hover:bg-green-500 transition-colors">
                         <span className="text-[10px] font-black uppercase text-green-700 group-hover:text-white">Active</span>
                      </div>
                      <div className="flex flex-col gap-1 relative z-10">
                         <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-1">Promo Code</span>
                         <h4 className="text-2xl font-black text-gray-900 tracking-tight font-serif">{offer.code}</h4>
                         <p className="text-xl font-black text-warmOrange mt-2 border-t border-gray-200 pt-3 flex items-center gap-1.5">
                            <Tag size={16}/> {offer.discount === 0 ? 'FREE DELIVERY' : (offer.type === 'percent' ? `${offer.discount}% OFF` : `₹${offer.discount} OFF`)}
                         </p>
                      </div>
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );

  const renderMenu = () => (
    <div className="space-y-8">
      <div className="p-6 rounded-[2rem] bg-white border border-[#f7e8da] flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            placeholder="Search catalog by name or category..." 
            value={menuSearch} 
            onChange={e => setMenuSearch(e.target.value)} 
            className="w-full pl-12 pr-6 py-3.5 rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-warmOrange/30 bg-gray-50 text-gray-900" 
          />
        </div>
        <button 
          onClick={() => setMenuModal({ open: true, mode: 'add', item: null })} 
          className="w-full sm:w-auto px-6 py-3.5 bg-warmOrange hover:bg-orange-600 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center transition-transform hover:-translate-y-0.5"
        >
          <Plus size={18} className="mr-2" /> Add New Dish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMenu.map(item => (
          <div key={item._id} className="group flex flex-col rounded-[2rem] bg-white border border-[#f7e8da] overflow-hidden hover:shadow-xl transition-all hover:border-peach-200">
            <div className="h-48 overflow-hidden relative bg-gray-100">
              <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
              <div className="absolute top-3 left-3 flex gap-1.5 shadow-sm">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase text-white shadow-sm ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}>{item.isVeg ? 'Veg' : 'Non-Veg'}</span>
                {!item.isAvailable && <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-gray-800 text-white shadow-sm">Sold Out</span>}
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{item.category}</span>
              <h4 className="text-lg font-black text-gray-900 mb-2 leading-tight">{item.name}</h4>
              <p className="text-xl font-black text-warmOrange mt-auto mb-4">{formatCurrency(item.price)}</p>
              
              <div className="flex gap-2">
                <button onClick={() => setMenuModal({ open: true, mode: 'edit', item })} className="flex-1 py-2 bg-gray-100 rounded-xl hover:bg-warmOrange hover:text-white transition-all text-sm font-bold flex items-center justify-center gap-1 text-gray-700"><Edit2 size={14} /> Edit</button>
                <button onClick={() => handleDeleteMenu(item._id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
        ))}
        {filteredMenu.length === 0 && <div className="col-span-full py-20 text-center text-gray-500 font-bold">No menu items found.</div>}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="py-4 px-2 flex gap-2 overflow-x-auto no-scrollbar">
        {['all', 'pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map(f => (
          <button 
             key={f} 
             onClick={() => setOrderFilter(f)} 
             className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm border ${orderFilter === f ? 'bg-warmOrange text-white border-warmOrange' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
          >
             {f.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      <div className="rounded-[2rem] bg-white border border-[#f7e8da] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Assign Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map(o => (
                <tr key={o._id} className="hover:bg-orange-50/40 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">#{o._id.slice(-6).toUpperCase()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-sm text-gray-900">{o.user?.name || 'Guest User'}</p>
                    <p className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </td>
                  <td className="px-6 py-4">
                     <p className="text-xs text-gray-600 font-medium truncate max-w-[200px]" title={o.orderItems?.map(i => i.name).join(', ')}>
                         {o.orderItems?.length > 0 ? o.orderItems.map(i => i.name).join(', ') : 'Food items'}
                     </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-black text-warmOrange">{formatCurrency(o.totalPrice)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 items-center">
                        <StatusBadge status={o.status} />
                        {o.status === 'pending' && (
                            <button onClick={() => handleUpdateOrderStatus(o._id, 'preparing')} className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100">Accept</button>
                        )}
                        {o.status === 'preparing' && (
                            <button onClick={() => handleUpdateOrderStatus(o._id, 'out_for_delivery')} className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded hover:bg-orange-100">Dispatch</button>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {o.deliveryBoy ? (
                       <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1.5 rounded-lg flex items-center gap-1 w-fit"><Truck size={12}/> {o.deliveryBoy.name}</span>
                    ) : (
                       <select 
                          onChange={e => handleAssignRider(o._id, e.target.value)} 
                          className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-bold text-gray-700 outline-none focus:border-warmOrange"
                          disabled={o.status === 'delivered' || o.status === 'cancelled'}
                       >
                         <option value="">Assign Rider...</option>
                         {deliveryBoys.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                       </select>
                    )}
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && <tr><td colSpan="6" className="text-center py-10 text-gray-500 font-bold">No orders found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredUsers.map(u => (
        <div key={u._id} className="p-6 rounded-[2rem] bg-white border border-[#f7e8da] hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-peach-100 text-warmOrange flex items-center justify-center font-black text-xl"><Users size={24} /></div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 leading-tight">{u.name}</h4>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{u.role.replace('_', ' ')}</p>
            </div>
          </div>
          <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600 truncate">{u.email}</p>
                {u.role === 'user' && (
                  <div className="flex items-center gap-1.5 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                    <Award size={14} className="text-yellow-600" />
                    <span className="text-xs font-black text-yellow-700">{u.loyaltyPoints || 0}</span>
                  </div>
                )}
                {(u.role === 'delivery') && (
                  <div className="flex items-center gap-2 px-2 py-1 rounded-lg border border-blue-100 bg-blue-50">
                    <Truck size={14} className="text-blue-600" />
                    <span className="text-xs font-black text-blue-700">{u.deliveryStaff?.totalDeliveries || 0}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${u.deliveryStaff?.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{u.deliveryStaff?.vehicleType || 'No Vehicle'} • {u.deliveryStaff?.vehicleNumber || 'No Plate'}</p>
              <p className="text-xs text-gray-400">Joined: {new Date(u.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-50">
            <button onClick={() => handleToggleUserStatus(u._id, u.isActive !== false)} className={`flex-1 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold transition-colors ${u.isActive === false ? 'text-green-600 hover:bg-green-50 hover:border-green-200' : 'text-orange-600 hover:bg-orange-50 hover:border-orange-200'}`}>
              {u.isActive === false ? 'Unban User' : 'Suspend Account'}
            </button>
            <button onClick={() => handleDeleteUser(u._id)} className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-colors">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen font-sans flex overflow-hidden bg-cream">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#f7e8da] flex flex-col z-20 shadow-sm shadow-warmOrange/5">
        <div className="p-8 pb-10">
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <div className="p-2 bg-gradient-to-br from-warmOrange to-orange-600 rounded-xl shadow-md group-hover:scale-105 transition-transform"><UtensilsCrossed size={22} className="text-white" /></div>
            <span className="text-2xl font-black tracking-tighter text-gray-900 font-serif">Hungry</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Restaurant Panel</p>
          {[
            { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
            { id: 'kds', icon: LayoutDashboard, label: 'Live Kitchen (KDS)' },
            { id: 'orders', icon: ShoppingBag, label: 'Manage Orders' },
            { id: 'menu', icon: UtensilsCrossed, label: 'Manage Menu' },
            { id: 'offers', icon: Tag, label: 'Coupons & Promos' },
            { id: 'users', icon: Users, label: 'Customers & Staff' },
          ].map(t => (
            <button 
              key={t.id} 
              onClick={() => setActiveTab(t.id)} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === t.id ? 'bg-warmOrange/10 text-warmOrange' : 'text-gray-600 hover:bg-orange-50/50 hover:text-warmOrange'}`}
            >
              <t.icon size={18} className={activeTab === t.id ? 'text-warmOrange' : 'text-gray-400'} /> {t.label}
            </button>
          ))}
        </nav>
        
        <div className="p-6 border-t border-gray-100 bg-gray-50/30">
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-red-500 hover:bg-red-50 font-bold transition-all shadow-sm">
             <LogOut size={16} /> Secure Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-[1] flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-[#f7e8da] flex items-center justify-between px-10 relative z-10 shadow-sm shadow-warmOrange/5">
           <div className="flex flex-col">
             <h2 className="text-2xl font-black tracking-tight text-gray-900 font-serif capitalize">{activeTab.replace('_', ' ')}</h2>
             <p className="text-xs font-bold text-gray-500">Manage your restaurant operations effectively.</p>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                  <div className="text-right">
                     <span className="block text-sm font-bold text-gray-900">{adminName}</span>
                     <span className="block text-xs font-black text-warmOrange uppercase tracking-wide">Admin</span>
                  </div>
                  <div className="w-11 h-11 rounded-full bg-peach-100 border border-peach-200 flex items-center justify-center text-warmOrange font-black shadow-inner"><ShieldCheck size={20} strokeWidth={2.5} /></div>
              </div>
           </div>
        </header>

        {/* Scrollable Main View */}
        <main className="flex-1 overflow-y-auto p-10 no-scrollbar">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'kds' && renderKDS()}
            {activeTab === 'offers' && renderOffers()}
            {activeTab === 'menu' && renderMenu()}
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'users' && renderUsers()}
          </div>
        </main>
      </div>

      {/* Floater Notifications */}
      {notification && (
        <div className={`fixed bottom-10 right-10 z-[6000] px-6 py-4 rounded-xl border bg-white shadow-xl animate-bounce flex items-center gap-3 ${notification.type === 'error' ? 'border-red-200 text-red-600' : 'border-green-200 text-green-600'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.type === 'error' ? 'bg-red-50' : 'bg-green-50'}`}>
             {notification.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />} 
          </div>
          <span className="text-sm font-bold">{notification.msg}</span>
        </div>
      )}

      {menuModal.open && <MenuModal mode={menuModal.mode} item={menuModal.item} onConfirm={handleMenuSubmit} onCancel={() => setMenuModal({ open: false })} loading={menuLoading} />}
    </div>
  );
};

export default AdminDashboard;
