import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bike, ArrowRight, ShieldCheck, Wallet, Award, TrendingUp, HandHelping, LogIn, UserPlus, Zap, ChevronRight } from 'lucide-react';

const DeliveryHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex flex-col items-center font-sans overflow-x-hidden relative">
      
      {/* 1. ULTRA-PREMIUM HERO BACKGROUND */}
      <div className="fixed inset-0 z-0">
         <img 
            src="/images/delivery-hero.png" 
            alt="Delivery Hero" 
            className="w-full h-full object-cover opacity-60 scale-110 animate-float"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black"></div>
      </div>

      {/* 2. MISSION CONTROL CONTENT */}
      <main className="relative z-10 w-full flex flex-col items-center justify-between min-h-screen p-8 pb-40">
         
         {/* Branding Header */}
         <div className="w-full flex justify-between items-center animate-in fade-in duration-1000">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-warmOrange rounded-xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,107,53,0.4)]">
                  <Bike size={20} />
               </div>
               <span className="text-xl font-black italic text-white tracking-tighter">HUNGRY<span className="text-warmOrange">.FLEET</span></span>
            </div>
            <div className="px-4 py-1.5 glass-terminal rounded-full flex items-center gap-2">
               <div className="w-2 h-2 signal-online rounded-full animate-pulse"></div>
               <span className="text-[8px] font-black text-white uppercase tracking-widest">System Online</span>
            </div>
         </div>

         {/* Hero Text: "STRIKE WHILE THE ENGINE'S HOT" */}
         <div className="text-center space-y-6 max-w-lg mt-20 animate-in zoom-in duration-1000">
            <div className="inline-block px-4 py-1 bg-warmOrange/20 border border-warmOrange/30 rounded-full mb-4">
               <span className="text-[10px] font-black text-warmOrange uppercase tracking-[0.3em]">Logistics Terminal v3.0</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-[1.2] leading-[0.85] italic font-serif text-glow-orange">
               STRIKE WHILE<br/>
               <span className="text-warmOrange">THE ENGINE</span><br/>
               IS HOT!
            </h1>
            <p className="text-white/60 font-bold text-xs uppercase tracking-[0.4em] max-w-xs mx-auto">Master the streets. Own the earnings.</p>
         </div>

         {/* Interactive Benefit Cards (Glassmorphism) */}
         <div className="w-full max-w-sm grid grid-cols-1 gap-4 mt-12 animate-in slide-in-from-bottom duration-1000 delay-500">
            
            <div className="glass-terminal p-6 rounded-[2rem] flex items-center gap-5 group hover:bg-white/20 transition-all cursor-pointer">
               <div className="w-12 h-12 bg-warmOrange rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
                  <Zap size={24} />
               </div>
               <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-warmOrange uppercase tracking-widest leading-none">The Hustle</p>
                  <h4 className="text-lg font-black italic font-serif text-white tracking-tight leading-none">Start Delivering in a Swipe!</h4>
               </div>
            </div>

            <div className="glass-terminal p-6 rounded-[2rem] flex items-center justify-between group hover:bg-white/20 transition-all cursor-pointer">
               <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
                     <HandHelping size={24} />
                  </div>
                  <div className="space-y-0.5">
                     <p className="text-[10px] font-black text-green-400 uppercase tracking-widest leading-none">The Bonus</p>
                     <h4 className="text-lg font-black italic font-serif text-white tracking-tight leading-none">Refer & Earn ₹75,000!</h4>
                  </div>
               </div>
               <ChevronRight size={20} className="text-white/20" />
            </div>

         </div>
      </main>

      {/* 3. TERMINAL ACTION BAR (Sticky Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 p-8 z-50 animate-in slide-in-from-bottom duration-1000 delay-700">
         <div className="max-w-md mx-auto glass-terminal p-4 rounded-[3rem] border-white/10 flex gap-4">
            <button 
               onClick={() => navigate('/delivery/login')}
               className="flex-1 py-5 bg-white text-gray-900 font-black rounded-3xl shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all text-xs uppercase tracking-widest"
            >
               <LogIn size={18} strokeWidth={3} /> Login
            </button>
            <button 
               onClick={() => navigate('/delivery/register')}
               className="flex-[1.2] py-5 bg-warmOrange text-white font-black rounded-3xl shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(255,107,53,0.4)]"
            >
               <UserPlus size={18} strokeWidth={3} /> Become Pilot
            </button>
         </div>
      </div>

    </div>
  );
};

export default DeliveryHome;
