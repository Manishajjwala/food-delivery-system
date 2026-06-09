import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

const SwipeButton = ({ onConfirm, text, color = "bg-warmOrange" }) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [sliderPos, setSliderPos] = useState(0);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const handleStart = (e) => {
    if (isConfirmed) return;
    isDragging.current = true;
  };

  const handleMove = (e) => {
    if (!isDragging.current || isConfirmed) return;
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const rect = containerRef.current.getBoundingClientRect();
    let newPos = clientX - rect.left - 24; // 24 is half of knob width
    
    const maxPos = rect.width - 64; // 64 is total knob width
    if (newPos < 0) newPos = 0;
    if (newPos > maxPos) newPos = maxPos;
    
    setSliderPos(newPos);

    if (newPos >= maxPos * 0.95) {
      completeAction();
    }
  };

  const handleEnd = () => {
    if (!isDragging.current || isConfirmed) return;
    isDragging.current = false;
    
    const maxPos = containerRef.current.getBoundingClientRect().width - 64;
    if (sliderPos < maxPos * 0.95) {
      setSliderPos(0);
    }
  };

  const completeAction = () => {
    setIsConfirmed(true);
    setSliderPos(containerRef.current.getBoundingClientRect().width - 64);
    if (onConfirm) onConfirm();
    
    // Auto-reset after animation
    setTimeout(() => {
       setIsConfirmed(false);
       setSliderPos(0);
    }, 2000);
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchmove', handleMove);
    return () => {
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchmove', handleMove);
    };
  }, [sliderPos]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-16 bg-gray-900 rounded-2xl border border-white/10 p-2 overflow-hidden shadow-2xl transition-all ${isConfirmed ? 'opacity-80 scale-95' : ''}`}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className={`text-xs font-black uppercase tracking-[0.2em] transition-opacity duration-300 ${sliderPos > 50 ? 'opacity-0' : 'opacity-40 text-white'}`}>
           {isConfirmed ? 'Success!' : text}
        </span>
      </div>

      <div 
        className={`absolute top-2 left-2 bottom-2 w-12 rounded-xl flex items-center justify-center text-white shadow-xl transition-colors duration-300 pointer-events-none z-10 ${isConfirmed ? 'bg-blue-600' : color}`}
        style={{ transform: `translateX(${sliderPos}px)` }}
      >
        <ChevronRight size={24} className={isConfirmed ? 'hidden' : ''} />
        {isConfirmed && <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
      </div>

      <div 
        className="absolute top-2 left-2 bottom-2 bg-white/5 rounded-xl transition-all pointer-events-none"
        style={{ width: `${sliderPos + 48}px` }}
      ></div>
    </div>
  );
};

export default SwipeButton;
