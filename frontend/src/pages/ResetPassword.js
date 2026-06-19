import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, Circle, ArrowRight } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigateBack = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Password Validation (Min 8 Characters)
    if (password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
    }

    setLoading(true);
    try {
      const response = await fetch(`food-delivery-system-xb0m.onrender.com/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.message || 'Reset failed');
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
                <Lock size={32} />
             </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Set New Password</h2>
            <p className="mt-2 text-sm text-gray-500 font-medium italic">
               Choose a strong password to secure your account
            </p>
          </div>

          {success ? (
            <div className="text-center py-8 animate-bounce-slow">
               <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 text-green-500 rounded-full mb-6">
                  <CheckCircle size={48} />
               </div>
               <h3 className="text-2xl font-black text-gray-900 mb-2">Success!</h3>
               <p className="text-gray-500 font-medium">Your password has been reset. Redirecting to login...</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleReset}>
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm text-center font-medium animate-shake">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">New Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-warmOrange transition-colors">
                      <Lock size={20} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="block w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-warmOrange/20 focus:border-warmOrange focus:bg-white transition-all text-gray-800"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-warmOrange transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {/* Simplified Text Hint */}
                  <p className="mt-2 text-[11px] text-gray-400 font-medium italic px-1">
                    Note: Password must be at least 8 characters long.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Confirm Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-warmOrange transition-colors">
                      <Lock size={20} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="block w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-warmOrange/20 focus:border-warmOrange focus:bg-white transition-all text-gray-800"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-warmOrange/20 text-sm font-black text-white bg-gradient-to-r from-warmOrange to-orange-600 hover:from-orange-500 hover:to-orange-700 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? 'Updating...' : 'Reset Password'}
                {!loading && <ArrowRight size={18} className="ml-2" />}
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-warmOrange transition-colors">
               Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
