import React, { useState } from 'react';
import { Star, X, MessageSquare, Send } from 'lucide-react';

const ReviewModal = ({ orderId, onCancel, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return setError('Please select a star rating');
    setLoading(true);
    
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });

      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to submit review');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="p-8 border-b border-[#f7e8da] flex justify-between items-center bg-[#fffcf9]">
          <h2 className="text-2xl font-black font-serif text-gray-900">Rate Your Feast</h2>
          <button onClick={onCancel} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"><X size={24}/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
             <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-2">
                <AlertCircle size={16}/> {error}
             </div>
          )}

          <div className="flex flex-col items-center gap-4">
             <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-center">How was your food?</p>
             <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="p-1 transition-transform hover:scale-125"
                  >
                    <Star 
                      size={40} 
                      className={`transition-colors ${
                        (hover || rating) >= star ? 'text-warmOrange fill-warmOrange' : 'text-gray-200'
                      }`} 
                    />
                  </button>
                ))}
             </div>
             <p className="text-lg font-black text-warmOrange min-h-[1.75rem] font-serif italic">
               {rating === 5 ? 'Exceptional!' : rating === 4 ? 'Great!' : rating === 3 ? 'Good' : rating === 2 ? 'Could be better' : rating === 1 ? 'Disappointing' : ''}
             </p>
          </div>

          <div className="space-y-3">
             <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <MessageSquare size={16} className="text-warmOrange"/>
                Add a comment (Optional)
             </div>
             <textarea 
               value={comment}
               onChange={(e) => setComment(e.target.value)}
               className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[2rem] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-warmOrange/30 focus:bg-white transition-all resize-none"
               placeholder="Tell us what you loved..."
               rows={4}
             />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-warmOrange hover:bg-orange-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-warmOrange/20 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : (
              <>
                <Send size={20}/> Submit Review
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const AlertCircle = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

export default ReviewModal;
