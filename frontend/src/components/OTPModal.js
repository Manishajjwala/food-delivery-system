import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck } from 'lucide-react';

const OTPModal = ({ onConfirm, onCancel, orderId }) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleKeyPress = (num) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError('');
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (pin.length !== 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/api/delivery/order/status/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify({ status: 'delivered', otp: pin })
      });

      const data = await response.json();

      if (response.ok) {
        onConfirm();
      } else {
        setError(data.message || 'Verification failed');
        setPin(''); // Reset on failure
      }
    } catch (err) {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-gray-900/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full sm:max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl relative animate-in slide-in-from-bottom duration-500">
        
        <button 
          onClick={onCancel}
          className="absolute top-6 right-6 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-10 pt-4">
           <div className="inline-flex items-center justify-center w-16 h-16 bg-warmOrange/10 rounded-3xl mb-4 text-warmOrange">
              <ShieldCheck size={32} />
           </div>
           <h2 className="text-2xl font-black text-gray-900 tracking-tight">Security Handover</h2>
           <p className="text-gray-400 text-xs font-bold leading-relaxed max-w-[200px] mx-auto mt-1">
              Ask the customer for the 4-digit PIN to finalize delivery.
           </p>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i}
              className={`w-14 h-16 rounded-2xl border-2 flex items-center justify-center text-3xl font-black transition-all ${pin[i] ? 'border-warmOrange text-warmOrange bg-warmOrange/5 scale-105' : 'border-gray-100 bg-gray-50 text-gray-200'}`}
            >
              {pin[i] ? '●' : '○'}
            </div>
          ))}
        </div>

        {error && (
          <div className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center mb-6 animate-shake">
            {error}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'DEL'].map((k) => (
            <button
              key={k}
              onClick={() => {
                if (k === 'C') setPin('');
                else if (k === 'DEL') handleDelete();
                else handleKeyPress(k);
              }}
              className="py-4 bg-gray-50 rounded-2xl text-xl font-black text-gray-900 hover:bg-warmOrange hover:text-white transition-all active:scale-95 shadow-sm active:shadow-inner"
            >
              {k}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || pin.length !== 4}
          className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black tracking-widest uppercase text-sm hover:bg-black transition-all active:scale-95 disabled:opacity-30 shadow-xl shadow-gray-900/10 flex items-center justify-center gap-3"
        >
          {loading ? 'Verifying...' : (
            <>Complete Delivery <CheckCircle size={18} /></>
          )}
        </button>
      </div>
    </div>
  );
};

export default OTPModal;
