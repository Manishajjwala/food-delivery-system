import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Bike, ShieldCheck, 
  LogOut, Star, Award, Settings, Phone, Mail
} from 'lucide-react';

const RiderProfile = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Pilot Alpha';
  const fleetId = 'FLT-9283-CX';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/rider/login');
  };

  return (
    <div className="min-h-screen bg-[#fdfcf0] text-gray-900 font-sans p-6 pb-24">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
         <button 
           onClick={() => navigate('/rider')}
           className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-all active:scale-90 shadow-sm border border-gray-100"
         >
            <ArrowLeft size={20} />
         </button>
         <h1 className="text-xl font-black uppercase tracking-widest text-gray-900">Partner Profile</h1>
         <div className="w-12"></div>
      </div>

      <div className="max-w-md mx-auto space-y-8">
         
         {/* Identity Card */}
         <div className="bg-white p-8 rounded-[2.5rem] border border-warmOrange/10 shadow-2xl shadow-warmOrange/5 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
               <User size={120} className="text-warmOrange" />
            </div>
            
            <div className="w-24 h-24 bg-warmOrange/10 rounded-full mx-auto flex items-center justify-center text-warmOrange mb-4 border-4 border-white shadow-lg relative z-10">
               <User size={48} />
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 relative z-10">{userName}</h2>
            <p className="text-[10px] font-black text-warmOrange uppercase tracking-widest mt-1 relative z-10">
               Verified Delivery Partner • {fleetId}
            </p>

            <div className="mt-8 flex items-center justify-center gap-6 relative z-10 pt-8 border-t border-gray-50">
               <div className="text-center">
                  <p className="text-xl font-black text-gray-900">4.8</p>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5 flex items-center gap-1"><Star size={10} className="text-yellow-500" /> Rating</p>
               </div>
               <div className="w-px h-8 bg-gray-100"></div>
               <div className="text-center">
                  <p className="text-xl font-black text-gray-900">Gold</p>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5 flex items-center gap-1"><Award size={10} className="text-warmOrange" /> Badge</p>
               </div>
            </div>
         </div>

         {/* Logistics Intel Section */}
         <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Vehicle Details</h3>
            <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm space-y-6">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-warmOrange">
                        <Bike size={20} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Transport Method</p>
                        <p className="text-sm font-black text-gray-900 mt-0.5">Motorcycle (GJ01-CX-2024)</p>
                     </div>
                  </div>
                  <Settings size={18} className="text-gray-300" />
               </div>

               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-warmOrange">
                     <ShieldCheck size={20} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Security Clearance</p>
                     <p className="text-sm font-black text-gray-900 mt-0.5 uppercase tracking-widest">Active • Level 4</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Support Hub */}
         <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Fleet Support</h3>
            <div className="grid grid-cols-2 gap-4">
               <button className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm flex flex-col items-center gap-2 hover:bg-gray-50 transition-all active:scale-95">
                  <Phone size={20} className="text-green-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Hotline</span>
               </button>
               <button className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm flex flex-col items-center gap-2 hover:bg-gray-50 transition-all active:scale-95">
                  <Mail size={20} className="text-warmOrange" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Fleet Mail</span>
               </button>
            </div>
         </div>

         {/* Logout Terminal Button */}
         <button 
           onClick={handleLogout}
           className="w-full py-5 bg-red-50 text-red-500 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] border border-red-100 flex items-center justify-center gap-3 transition-all active:scale-[0.98] hover:bg-red-100"
         >
            <LogOut size={18} />
            Log Out of Partner Portal
         </button>

         <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-widest pt-10">
            Partner Network v4.0.2 • Hungry Dashboard
         </p>
      </div>
    </div>
  );
};

export default RiderProfile;
