import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bike, ShieldCheck, ArrowRight, Mail, Lock, Phone } from 'lucide-react';

const RiderLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/delivery/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('userName', data.name);
        navigate('/rider');
      } else {
        setError(data.message || 'Identity not found in fleet');
      }
    } catch (err) {
      setError('Logistics server connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wavy-light flex flex-col justify-center p-6 text-gray-900 font-sans selection:bg-warmOrange/10 relative overflow-hidden">
      
      <div className="max-w-md w-full mx-auto relative z-10">
        <div className="text-center mb-12 animate-in slide-in-from-top duration-700">
           <div className="inline-flex items-center justify-center w-24 h-24 bg-warmOrange/10 rounded-[2.5rem] mb-6 text-warmOrange shadow-2xl shadow-warmOrange/10 border border-warmOrange/20 animate-bounce-slow">
              <Bike size={48} />
           </div>
           <h1 className="text-4xl font-black tracking-tighter leading-none text-gray-900">Partner Portal</h1>
           <p className="text-gray-600 text-xs font-black uppercase tracking-[0.3em] mt-3">Secure Login</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-warmOrange/5 border border-white/50">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
               <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-warmOrange transition-colors">
                     <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Registered Email ID"
                    className="block w-full pl-16 pr-6 py-5 bg-white border border-gray-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-warmOrange/10 focus:border-warmOrange transition-all text-sm font-bold placeholder:text-gray-400 shadow-sm"
                    required
                  />
               </div>

               <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-warmOrange transition-colors">
                     <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Secure Passcode"
                    className="block w-full pl-16 pr-6 py-5 bg-white border border-gray-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-warmOrange/10 focus:border-warmOrange transition-all text-sm font-bold placeholder:text-gray-400 shadow-sm"
                    required
                  />
               </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-500 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-shake">
                 {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-warmOrange text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-orange-600 transition-all active:scale-[0.98] disabled:opacity-50 shadow-2xl shadow-warmOrange/20 flex items-center justify-center gap-3 mt-4"
            >
              {loading ? 'Authenticating...' : (
                <>Login to Dashboard <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-600 font-black text-xs uppercase tracking-widest leading-relaxed">
            Not part of the fleet? 
            <Link to="/rider/register" className="text-warmOrange ml-2 hover:underline">Apply Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiderLogin;
