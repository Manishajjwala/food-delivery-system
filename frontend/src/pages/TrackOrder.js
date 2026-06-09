import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Bike, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/api/orders/track/${orderId.trim()}`);
      const data = await response.json();

      if (response.ok) {
        // Redirect to the detail page (it handles public tracking too)
        navigate(`/order/${orderId.trim()}`);
      } else {
        setError(data.message || 'Order not found. Please check your ID.');
      }
    } catch (err) {
      setError('Could not connect to tracking server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col font-sans overflow-x-hidden relative">
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-warmOrange/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-warmOrange/10 rounded-full blur-3xl -ml-48 -mb-48"></div>

      <div className="flex-grow flex items-center justify-center p-6 relative z-10">
        <div className="max-w-xl w-full">
          <div className="text-center mb-12 space-y-4">
             <div className="inline-flex items-center justify-center w-20 h-20 bg-warmOrange/10 rounded-3xl mb-4 text-warmOrange animate-bounce-slow">
                <MapPin size={40} />
             </div>
             <h1 className="text-4xl font-black text-gray-900 tracking-tight">Track Your Feast</h1>
             <p className="text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
                Enter your Order ID to see the real-time journey of your flavors. 
             </p>
          </div>

          <form onSubmit={handleTrack} className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-warmOrange transition-colors">
                <Search size={24} />
              </div>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter Order ID (e.g. 64b8...)"
                className="block w-full pl-16 pr-6 py-6 bg-white border-2 border-gray-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-warmOrange/10 focus:border-warmOrange transition-all text-xl font-bold shadow-xl shadow-gray-100/50"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-6 px-4 border border-transparent rounded-[2rem] shadow-2xl shadow-warmOrange/30 text-xl font-black text-white bg-gradient-to-r from-warmOrange to-orange-600 hover:from-orange-500 hover:to-orange-700 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Locating...' : (
                <span className="flex items-center gap-3 uppercase tracking-widest">
                  Start Tracking <ArrowRight size={24} />
                </span>
              )}
            </button>
          </form>

          <div className="mt-16 grid grid-cols-3 gap-4">
             <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center mx-auto text-warmOrange">
                   <Clock size={20} />
                </div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-tight">Live ETA</p>
             </div>
             <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center mx-auto text-warmOrange">
                   <Bike size={20} />
                </div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-tight">Rider Map</p>
             </div>
             <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center mx-auto text-warmOrange">
                   <ShieldCheck size={20} />
                </div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-tight">Secure OTP</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
