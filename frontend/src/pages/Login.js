import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Phone, ShieldCheck, ArrowRight, Smartphone, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [loginMode, setLoginMode] = useState('email'); // 'email' or 'mobile'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Enter Phone, 2: Enter OTP
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('food-delivery-system-xb0m.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Essential storage for all roles
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userName', data.name);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userRole', data.role);

        // Role-based redirection
        if (data.role === 'admin') {
          localStorage.setItem('isAdminAuthenticated', 'true');
          window.location.href = '/admin/dashboard';
        } else if (data.role === 'delivery') {
          localStorage.setItem('isRiderAuthenticated', 'true');
          window.location.href = '/rider';
        } else {
          // Standard Customer
          window.location.href = '/home';
        }
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (error) {
      setError('Could not connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    // Validation: 10 digits
    if (!/^\d{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('food-delivery-system-xb0m.onrender.com/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (res.ok) {
        setStep(2);
        // For demo: showing OTP in alert so user doesn't have to check console
        alert(`Demo OTP: ${data.otp}`);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    // Validation: 6 digits
    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('food-delivery-system-xb0m.onrender.com/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        // Essential storage for all roles
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userName', data.name);
        localStorage.setItem('userEmail', data.email || '');
        localStorage.setItem('userPhone', data.phone || '');
        localStorage.setItem('userRole', data.role);

        // Role-based redirection
        if (data.role === 'admin') {
          localStorage.setItem('isAdminAuthenticated', 'true');
          window.location.href = '/admin/dashboard';
        } else if (data.role === 'delivery') {
          localStorage.setItem('isRiderAuthenticated', 'true');
          window.location.href = '/rider';
        } else {
          // Standard Customer
          window.location.href = '/home';
        }
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-peach-50 relative overflow-hidden animate-slide-up">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-peach-100 rounded-full opacity-40 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-warmOrange/10 rounded-full opacity-40 blur-2xl"></div>

        <div className="relative z-10">
          <div className="text-center mb-10">
             <div className="inline-flex items-center justify-center w-16 h-16 bg-peach-50 rounded-2xl mb-4 text-warmOrange">
                {loginMode === 'email' ? <Mail size={32} /> : <Smartphone size={32} />}
             </div>
            <h2 className="text-3xl font-black text-gray-900 font-sans tracking-tight">
              {loginMode === 'email' ? 'Welcome Back' : 'Mobile Sign In'}
            </h2>
            <p className="mt-2 text-sm text-gray-500 font-medium">
              {loginMode === 'email' ? 'Sign in with your email details' : 'Enter your number to receive code'}
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm text-center font-medium animate-shake">
              {error}
            </div>
          )}

          {loginMode === 'email' ? (
            <form className="space-y-6" onSubmit={handleEmailLogin}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-warmOrange transition-colors">
                      <Mail size={20} />
                    </div>
                    <input
                      type="email"
                      required
                      className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-warmOrange/20 focus:border-warmOrange focus:bg-white transition-all text-gray-800"
                      placeholder="user@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Password</label>
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
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-warmOrange focus:ring-warmOrange border-gray-200 rounded-lg cursor-pointer" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500 font-medium cursor-pointer">
                    Keep me signed in
                  </label>
                </div>
                <Link to="/forgot-password" size="sm" className="text-sm font-bold text-warmOrange hover:text-orange-600 transition-colors">
                  Forgot?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-warmOrange/20 text-sm font-black text-white bg-gradient-to-r from-warmOrange to-orange-600 hover:from-orange-500 hover:to-orange-700 focus:outline-none transform transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? 'Processing...' : <span className="whitespace-nowrap">Sign In</span>}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {step === 1 ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Mobile Number</label>
                    <div className="relative group overflow-hidden bg-gray-50 border border-gray-100 rounded-2xl focus-within:ring-2 focus-within:ring-warmOrange/20 focus-within:border-warmOrange transition-all">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-warmOrange transition-colors z-10 border-r border-gray-100 pr-3">
                         <span className="text-sm font-black mr-2">+91</span>
                         <Phone size={18} />
                      </div>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        className="block w-full pl-24 pr-4 py-4 bg-transparent focus:outline-none text-gray-800 font-mono tracking-wider"
                        placeholder="10-digit number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-warmOrange/20 text-sm font-black text-white bg-gradient-to-r from-warmOrange to-orange-600 hover:from-orange-500 hover:to-orange-700 transition-all active:scale-[0.98] disabled:opacity-70"
                  >
                    {loading ? 'Sending...' : 'Send OTP'}
                    <ArrowRight size={18} className="ml-2" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2 px-1">
                      <label className="block text-sm font-bold text-gray-700">Enter 6-digit Code</label>
                      <button type="button" onClick={() => { setStep(1); setOtp(''); setError(''); }} className="text-xs font-bold text-warmOrange">Change Number</button>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-warmOrange transition-colors">
                        <ShieldCheck size={20} />
                      </div>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-warmOrange/20 focus:border-warmOrange focus:bg-white transition-all text-gray-800 font-mono text-2xl tracking-[0.5em] text-center"
                        placeholder="••••••"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-warmOrange/20 text-sm font-black text-white bg-gradient-to-r from-warmOrange to-orange-600 hover:from-orange-500 hover:to-orange-700 transition-all active:scale-[0.98] disabled:opacity-70"
                  >
                    {loading ? 'Verifying...' : 'Verify & Continue'}
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="mt-8 flex flex-col items-center space-y-4 text-center">
            <div className="text-sm text-gray-400 font-medium">
               Don't have an account?{' '}
              <Link to="/signup" className="text-warmOrange font-bold hover:underline whitespace-nowrap">
                Create one now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
