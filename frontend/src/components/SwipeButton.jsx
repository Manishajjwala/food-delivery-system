import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Check, ArrowRight } from 'lucide-react';

const SwipeButton = ({ onSwipe, label = "Swipe to Action", color = "bg-green-600" }) => {
  const [swipeX, setSwipeX] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const startXRef = useRef(0);

  const SWIPE_THRESHOLD = 240;

  const handleStart = (e) => {
    if (isComplete) return;
    setIsDragging(true);
    startXRef.current = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  };

  const handleMove = (e) => {
    if (!isDragging || isComplete) return;
    const currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const diff = currentX - startXRef.current;
    
    // Smoothly drag and cap at end
    const newX = Math.max(0, Math.min(diff, SWIPE_THRESHOLD));
    setSwipeX(newX);
  };

  const handleEnd = () => {
    if (!isDragging || isComplete) return;
    setIsDragging(false);

    if (swipeX >= SWIPE_THRESHOLD - 20) {
      setIsComplete(true);
      setSwipeX(SWIPE_THRESHOLD);
      if (onSwipe) onSwipe();
    } else {
      setSwipeX(0); // Snap back to start
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEnd);
    } else {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, swipeX]);

  return (
    <div 
      ref={containerRef}
      className={`relative h-[4.5rem] w-full max-w-[360px] mx-auto rounded-xl p-1 shadow-lg transition-all duration-300 overflow-hidden ${color} border-2 border-white/10`}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    >
      {/* Centered Label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span 
          className={`text-sm font-bold text-white transition-opacity duration-300 ${isComplete ? 'opacity-0' : 'opacity-90'}`}
        >
          {label}
        </span>
      </div>

      {/* The White Button Handle */}
      <div 
        className={`relative z-10 h-16 w-16 bg-white rounded-lg flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing transition-transform ${isDragging ? '' : 'duration-300'}`}
        style={{ transform: `translateX(${swipeX}px)` }}
      >
        {isComplete ? (
          <Check size={28} className="text-green-600 animate-in zoom-in duration-300" />
        ) : (
          <div className="flex items-center justify-center bg-gray-50/50 w-10 h-10 rounded-full border border-gray-100">
             <ChevronRight size={28} className="text-gray-900" />
          </div>
        )}
      </div>

      {/* Success Loading State */}
      {isComplete && (
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-500">
           <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default SwipeButton;
