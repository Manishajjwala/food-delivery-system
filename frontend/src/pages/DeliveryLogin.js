import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bike, Lock, User, Eye, EyeOff, ShieldCheck, ChevronRight } from 'lucide-react';

const DeliveryLogin = () => {
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSwipeLogin = async () => {
    if (!identity || !password) {
      setError('Please provide credentials to initiate session');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch('food-delivery-system-xb0m.onrender.com/api/delivery/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identity, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userName', data.name);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userRole', data.role);
        navigate('/rider');
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch (err) {
      setError('Terminal link severed - Check connection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wavy flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Domino's Style Header Text */}
      <h1 className="text-3xl font-black text-white text-center mb-10 tracking-tight leading-tight max-w-xs animate-in slide-in-from-bottom duration-700">
        Login To Kickstart Your Earnings!
      </h1>

      <div className="max-w-[380px] w-full bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/20 relative z-10 animate-in slide-in-from-bottom duration-1000">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center text-warmOrange font-black text-2xl italic tracking-tighter gap-2">
             <div className="w-10 h-10 bg-warmOrange text-white rounded-lg flex items-center justify-center shadow-lg -rotate-6">
                <Bike size={24} />
             </div>
             Hungry
          </div>
        </div>

        <div className="space-y-6">
          {error && <div className="bg-red-50 border-2 border-dashed border-red-200 text-red-600 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">{error}</div>}

          <div className="space-y-4">
            <div className="group border-2 border-gray-100 rounded-xl focus-within:border-warmOrange transition-all overflow-hidden bg-gray-50/50">
               <input
                 type="text"
                 placeholder="Email or Phone Number"
                 className="w-full p-4 bg-transparent outline-none font-bold text-sm"
                 value={identity}
                 onChange={(e) => setIdentity(e.target.value)}
               />
            </div>

            <div className="group border-2 border-gray-100 rounded-xl focus-within:border-warmOrange transition-all flex items-center bg-gray-50/50 overflow-hidden">
               <input
                 type={showPassword ? 'text' : 'password'}
                 placeholder="Password"
                 className="flex-1 p-4 bg-transparent outline-none font-bold text-sm"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
               />
               <button onClick={() => setShowPassword(!showPassword)} className="px-4 text-gray-300 hover:text-warmOrange transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
               </button>
            </div>

            <div className="flex items-center gap-3 px-1">
               <div 
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center cursor-pointer ${rememberMe ? 'bg-blue-600 border-blue-600' : 'border-gray-200'}`}
               >
                  {rememberMe && <ShieldCheck size={12} className="text-white" />}
               </div>
               <span className="text-xs font-bold text-gray-400">Remember me</span>
            </div>
          </div>

          <div className="pt-6">
             <button
                onClick={handleSwipeLogin}
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-warmOrange to-orange-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-warmOrange/20 hover:shadow-warmOrange/40 hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
             >
                {loading ? (
                   <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Authenticating...
                   </>
                ) : (
                   <>
                      Login to Dashboard
                      <ChevronRight size={18} />
                   </>
                )}
             </button>
          </div>

          <div className="text-center pt-10">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Don't have an account? <Link to="/rider/register" className="text-red-500 hover:underline">Register</Link></p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DeliveryLogin;
