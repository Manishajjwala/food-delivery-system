import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bike, ShieldCheck, ArrowRight, User, Mail, Lock, Phone, Clipboard } from 'lucide-react';

const RiderRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    vehicleType: 'bike',
    vehicleNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: 'delivery' }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userRole', data.role);
        navigate('/rider');
      } else {
        setError(data.message || 'Onboarding transmission failure');
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
        <div className="text-center mb-10 animate-in slide-in-from-top duration-700">
           <div className="inline-flex items-center justify-center w-20 h-20 bg-warmOrange/10 rounded-3xl mb-4 text-warmOrange shadow-2xl border border-warmOrange/20 animate-bounce-slow">
              <Clipboard size={40} />
           </div>
           <h1 className="text-3xl font-black tracking-tighter leading-none text-gray-900">Partner Onboarding</h1>
           <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] mt-3 underline decoration-warmOrange decoration-2 underline-offset-4">Join the Delivery Network</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-warmOrange/5 border border-white/50">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
               <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-warmOrange transition-colors">
                     <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Legal Name"
                    className="block w-full pl-16 pr-6 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-warmOrange/10 focus:border-warmOrange transition-all text-xs font-black placeholder:text-gray-400 shadow-sm"
                    required
                  />
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative group">
                     <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-warmOrange transition-colors">
                        <Mail size={18} />
                     </div>
                     <input
                       type="email"
                       name="email"
                       value={formData.email}
                       onChange={handleChange}
                       placeholder="Fleet Email"
                       className="block w-full pl-16 pr-6 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-warmOrange/10 focus:border-warmOrange transition-all text-xs font-black placeholder:text-gray-400 shadow-sm"
                       required
                     />
                  </div>
                  <div className="relative group">
                     <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-warmOrange transition-colors">
                        <Phone size={18} />
                     </div>
                     <input
                       type="text"
                       name="phone"
                       value={formData.phone}
                       onChange={handleChange}
                       placeholder="Phone"
                       className="block w-full pl-16 pr-6 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-warmOrange/10 focus:border-warmOrange transition-all text-xs font-black placeholder:text-gray-400 shadow-sm"
                       required
                     />
                  </div>
               </div>

               <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-warmOrange transition-colors">
                     <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Security Passcode"
                    className="block w-full pl-16 pr-6 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-warmOrange/10 focus:border-warmOrange transition-all text-xs font-black placeholder:text-gray-400 shadow-sm"
                    required
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                     <p className="text-[8px] font-black uppercase text-gray-600 mb-2 tracking-widest">Vessel Type</p>
                     <select 
                       name="vehicleType"
                       value={formData.vehicleType}
                       onChange={handleChange}
                       className="bg-transparent text-[10px] font-black text-gray-900 focus:outline-none w-full"
                     >
                       <option value="bike">Motorcycle (Fast)</option>
                       <option value="scooter">Electric Scooter</option>
                       <option value="cycle">Bicycle (Eco)</option>
                       <option value="walking">Walking (Hyper-Local)</option>
                     </select>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                     <p className="text-[8px] font-black uppercase text-gray-600 mb-2 tracking-widest">Plate Number</p>
                     <input
                       type="text"
                       name="vehicleNumber"
                       value={formData.vehicleNumber}
                       onChange={handleChange}
                       placeholder="GJ01-..."
                       className="bg-transparent text-[10px] font-black text-gray-900 focus:outline-none w-full placeholder:text-gray-300 uppercase"
                       required
                     />
                  </div>
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
              className="w-full py-5 bg-warmOrange text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-orange-600 transition-all active:scale-[0.98] disabled:opacity-50 shadow-2xl shadow-warmOrange/20 flex items-center justify-center gap-3 mt-4"
            >
              {loading ? 'Transmitting Data...' : (
                <>Join the Fleet <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-600 font-black text-[10px] leading-relaxed uppercase tracking-widest">
            Already part of the fleet? 
            <Link to="/rider/login" className="text-warmOrange ml-2 hover:underline">Partner Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiderRegister;
