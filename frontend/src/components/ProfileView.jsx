import React from 'react';
import { 
  LogOut, User, ShieldCheck, Mail, Phone, 
  MapPin, Settings, ChevronRight, Award, 
  Smartphone, Bike, Power 
} from 'lucide-react';

const ProfileView = ({ user, onLogout }) => {
  const riderName = user?.name || localStorage.getItem('userName') || 'Logistics Pilot';
  const riderEmail = user?.email || localStorage.getItem('userEmail') || 'pilot@hungry.com';
  const vehicleType = user?.vehicle?.type || 'Not Assigned';
  const vehicleNumber = user?.vehicle?.number || '----';
  const totalDeliveries = user?.stats?.totalDeliveries || 0;
  const rating = user?.stats?.rating || 0;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom duration-700 pb-12">
      
      {/* Rider Identity Card */}
      <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-orange-50 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
         
         <div className="flex flex-col items-center text-center space-y-6 relative z-10">
            <div className="relative">
               <div className="w-28 h-28 bg-orange-500 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl rotate-3 group-hover:rotate-0 transition-transform">
                  {riderName.charAt(0)}
               </div>
               <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-white rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <ShieldCheck size={20} />
               </div>
            </div>
            
            <div className="space-y-1">
               <h2 className="text-2xl font-black italic font-serif text-gray-900 tracking-tight">{riderName}</h2>
               <div className="flex items-center justify-center gap-2">
                  <span className="text-[10px] font-black bg-orange-50 text-orange-600 px-3 py-1 rounded-full uppercase tracking-widest italic">{totalDeliveries > 50 ? 'Senior Fleet Partner' : 'Fleet Associate'}</span>
               </div>
            </div>
         </div>
      </div>

      {/* Achievement Row */}
      <div className="grid grid-cols-2 gap-6">
         <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white space-y-3">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-orange-400">
               <Award size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Rating</p>
               <h4 className="text-lg font-black italic font-serif">{rating} ★</h4>
            </div>
         </div>
         <div className="bg-orange-600 rounded-[2.5rem] p-8 text-white space-y-3 shadow-xl shadow-orange-600/20">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-orange-200">
               <Bike size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Missions</p>
               <h4 className="text-lg font-black italic font-serif">{totalDeliveries} Done</h4>
            </div>
         </div>
      </div>

      {/* Action List */}
      <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm">
         <div className="divide-y divide-gray-50">
            <div className="w-full p-8 flex items-center justify-between group">
               <div className="flex items-center gap-5">
                  <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                     <Smartphone size={20} />
                  </div>
                  <div className="text-left">
                     <p className="text-sm font-black text-gray-800">Identity Record</p>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest tracking-tighter italic">{riderEmail}</p>
                  </div>
               </div>
            </div>

            <div className="w-full p-8 flex items-center justify-between group">
               <div className="flex items-center gap-5">
                  <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl group-hover:scale-110 transition-transform">
                     <MapPin size={20} />
                  </div>
                  <div className="text-left">
                     <p className="text-sm font-black text-gray-800">Assigned Equipment</p>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">{vehicleType} • {vehicleNumber}</p>
                  </div>
               </div>
            </div>

            <button className="w-full p-8 flex items-center justify-between hover:bg-gray-50 transition-all group">
               <div className="flex items-center gap-5">
                  <div className="p-4 bg-orange-50 text-orange-500 rounded-2xl group-hover:scale-110 transition-transform">
                     <Settings size={20} />
                  </div>
                  <div className="text-left">
                     <p className="text-sm font-black text-gray-800">Fleet Support</p>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Request Help or Updates</p>
                  </div>
               </div>
               <ChevronRight size={20} className="text-gray-200" />
            </button>
         </div>
      </div>

      {/* Logout Trigger */}
      <button 
         onClick={onLogout}
         className="w-full py-6 bg-red-50 text-red-600 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 border border-red-100 hover:bg-red-600 hover:text-white hover:shadow-2xl hover:shadow-red-500/30 transition-all"
      >
         <Power size={18} />
         Terminate Session
      </button>

    </div>
  );
};

export default ProfileView;
