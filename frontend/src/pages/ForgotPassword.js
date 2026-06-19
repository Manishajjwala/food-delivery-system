import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('food-delivery-system-xb0m.onrender.com/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Could not connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-peach-50 relative overflow-hidden animate-slide-up">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-peach-100 rounded-full opacity-40 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-warmOrange/10 rounded-full opacity-40 blur-2xl"></div>

        <div className="relative z-10">
          <div className="text-center mb-10">
             <div className="inline-flex items-center justify-center w-16 h-16 bg-peach-50 rounded-2xl mb-4 text-warmOrange">
                <Mail size={32} />
             </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Recover Password</h2>
            <p className="mt-2 text-sm text-gray-500 font-medium italic">
              {submitted 
                ? "Check your inbox for instructions" 
                : "Enter your email to receive a reset link"}
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm text-center font-medium animate-shake">
              {error}
            </div>
          )}

          {!submitted ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-warmOrange transition-colors">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-warmOrange/20 focus:border-warmOrange focus:bg-white transition-all text-gray-800 font-bold"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-warmOrange/20 text-sm font-black text-white bg-gradient-to-r from-warmOrange to-orange-600 hover:from-orange-500 hover:to-orange-700 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? 'Sending link...' : 'Send Reset Link'}
                {!loading && <Send size={18} className="ml-2" />}
              </button>
            </form>
          ) : (
            <div className="text-center py-6">
               <p className="text-gray-600 font-medium mb-8">
                  We've sent a recovery link to <span className="font-bold text-gray-900 underline decoration-warmOrange decoration-2">{email}</span>. Click the link in the email to set a new password.
               </p>
               <button 
                 onClick={() => setSubmitted(false)}
                 className="text-warmOrange font-black text-sm uppercase tracking-widest hover:underline"
               >
                 Try another email
               </button>
            </div>
          )}

          <div className="mt-8 flex flex-col items-center">
            <Link to="/login" className="flex items-center text-sm font-bold text-gray-400 hover:text-warmOrange transition-colors group">
              <ArrowLeft size={16} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
