import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bike, User, Mail, Lock, Phone, Truck, ShieldCheck, ChevronRight } from 'lucide-react';

const DeliveryRegister = () => {
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

  const handleRegister = async () => {
    const { name, email, phone, password, vehicleNumber } = formData;
    if (!name || !email || !phone || !password || !vehicleNumber) {
      setError('Please complete all protocol fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('food-delivery-system-xb0m.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: 'delivery' }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userName', data.name);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userRole', 'delivery');
        navigate('/rider');
      } else {
        setError(data.message || 'Onboarding failed');
      }
    } catch (err) {
      setError('Logistics Server Down - Try again later');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wavy flex flex-col items-center justify-center p-6 py-12 relative overflow-hidden">
      
      <h1 className="text-3xl font-black text-white text-center mb-10 tracking-tight leading-tight max-w-xs animate-in slide-in-from-bottom duration-700">
        Join the Fleet & Start Earning!
      </h1>

      <div className="max-w-[420px] w-full bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/20 relative z-10 animate-in slide-in-from-bottom duration-1000">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center text-warmOrange font-black text-2xl italic tracking-tighter gap-2">
             <div className="w-10 h-10 bg-warmOrange text-white rounded-lg flex items-center justify-center shadow-lg -rotate-6">
                <Bike size={24} />
             </div>
             Partner Onboarding
          </div>
        </div>

        <div className="space-y-4">
          {error && <div className="bg-red-50 border-2 border-dashed border-red-200 text-red-600 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">{error}</div>}

          <div className="grid grid-cols-1 gap-4">
            <input name="name" placeholder="Full Name" className="w-full p-4 bg-gray-50/50 border-2 border-gray-100 rounded-xl focus:border-warmOrange outline-none font-bold text-sm" onChange={handleChange} />
            <input name="email" type="email" placeholder="Email Address" className="w-full p-4 bg-gray-50/50 border-2 border-gray-100 rounded-xl focus:border-warmOrange outline-none font-bold text-sm" onChange={handleChange} />
            <input name="phone" placeholder="Mobile Number" className="w-full p-4 bg-gray-50/50 border-2 border-gray-100 rounded-xl focus:border-warmOrange outline-none font-bold text-sm" onChange={handleChange} />
            <input name="password" type="password" placeholder="Terminal Password" className="w-full p-4 bg-gray-50/50 border-2 border-gray-100 rounded-xl focus:border-warmOrange outline-none font-bold text-sm" onChange={handleChange} />
            
            <div className="flex gap-4">
               <select name="vehicleType" className="w-1/3 p-4 bg-gray-50/50 border-2 border-gray-100 rounded-xl focus:border-warmOrange outline-none font-bold text-sm appearance-none" onChange={handleChange}>
                  <option value="bike">Bike</option>
                  <option value="scooter">Scooter</option>
                  <option value="cycle">Cycle</option>
               </select>
               <input name="vehicleNumber" placeholder="Vehicle Plate Number" className="flex-1 p-4 bg-gray-50/50 border-2 border-gray-100 rounded-xl focus:border-warmOrange outline-none font-bold text-sm uppercase" onChange={handleChange} />
            </div>
          </div>

          <div className="pt-6">
             <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
             >
                {loading ? (
                   <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Onboarding Partner...
                   </>
                ) : (
                   <>
                      Complete Registration
                      <ChevronRight size={18} />
                   </>
                )}
             </button>
          </div>

          <div className="text-center pt-8">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Already a partner? <Link to="/rider/login" className="text-blue-500 hover:underline">Login Here</Link></p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DeliveryRegister;
