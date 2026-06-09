import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

const SlideToAction = ({ onAction, label, color = "bg-orange-500" }) => {
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeWidth, setSwipeWidth] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef(null);
  const sliderRef = useRef(null);

  const SLIDER_SIZE = 64;

  const handleStart = (e) => {
    if (isComplete) return;
    setIsSwiping(true);
  };

  const handleMove = (e) => {
    if (!isSwiping || isComplete) return;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const containerRect = containerRef.current.getBoundingClientRect();
    let offset = clientX - containerRect.left - (SLIDER_SIZE / 2);
    
    // Constraints
    const maxOffset = containerRect.width - SLIDER_SIZE - 4;
    if (offset < 0) offset = 0;
    if (offset > maxOffset) offset = maxOffset;
    
    setSwipeWidth(offset);

    // Completion check (85% swiped)
    if (offset > maxOffset * 0.85) {
      handleComplete();
    }
  };

  const handleEnd = () => {
    if (isComplete) return;
    setIsSwiping(false);
    if (!isComplete) {
      setSwipeWidth(0); // Reset
    }
  };

  const handleComplete = () => {
    setIsComplete(true);
    setSwipeWidth(containerRef.current.getBoundingClientRect().width - SLIDER_SIZE - 4);
    if (navigator.vibrate) navigator.vibrate(50); // Haptic feedback
    setTimeout(() => {
      onAction();
    }, 300);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-[72px] bg-gray-100 rounded-[2.5rem] p-1 flex items-center overflow-hidden border border-gray-200 select-none touch-none shadow-inner`}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      {/* Background Track Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <p className={`text-[11px] font-black uppercase tracking-[0.3em] font-sans transition-all duration-300 ${isSwiping ? 'opacity-20 scale-95' : 'opacity-40 animate-pulse'}`}>
          {label}
        </p>
      </div>

      {/* Progress Track */}
      <div 
        className={`absolute left-1 top-1 bottom-1 ${color} rounded-[2.2rem] transition-all duration-300 ${isComplete ? 'opacity-100' : 'opacity-80'}`}
        style={{ width: swipeWidth + SLIDER_SIZE }}
      ></div>

      {/* The Slider Handle */}
      <div
        ref={sliderRef}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        className={`w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-300 ${isComplete ? 'scale-0' : 'scale-100'}`}
        style={{ transform: `translateX(${swipeWidth}px)` }}
      >
        <ChevronRight className={`text-gray-900 transition-all duration-300 ${isSwiping ? 'scale-125' : 'scale-100'}`} size={28} strokeWidth={3} />
      </div>

      {/* Completion Icon */}
      {isComplete && (
        <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in duration-300">
           <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-500 shadow-xl">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
           </div>
        </div>
      )}
    </div>
  );
};

export default SlideToAction;
