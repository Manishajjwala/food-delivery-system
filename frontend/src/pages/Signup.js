import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, CheckCircle, Circle, Phone, Bike } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRider, setIsRider] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if(password !== confirmPassword) {
        setError("Passwords do not match");
        return;
    }

    // Password Validation (Min 8 Characters)
    if (password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://food-delivery-system-xb0m.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          email, 
          phone, 
          password,
          role: isRider ? 'delivery' : 'user'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userName', data.name);
        localStorage.setItem('userRole', data.role);

        if (data.role === 'delivery') {
          localStorage.setItem('isRiderAuthenticated', 'true');
          navigate('/rider');
        } else if (data.role === 'admin') {
          localStorage.setItem('isAdminAuthenticated', 'true');
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (error) {
      setError('Could not connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-peach-50 relative overflow-hidden animate-slide-up">
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 -mt-8 -ml-8 w-32 h-32 bg-peach-100 rounded-full opacity-40 blur-2xl"></div>
        <div className="absolute bottom-0 right-0 -mb-8 -mr-8 w-40 h-40 bg-warmOrange/10 rounded-full opacity-40 blur-2xl"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-peach-50 rounded-2xl mb-4 text-warmOrange">
               <User size={28} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 font-sans tracking-tight">Create Account</h2>
            <p className="mt-2 text-sm text-gray-400 font-medium font-serif italic">
               Join our community of food lovers
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm text-center font-medium animate-shake italic">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSignup}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-warmOrange transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-warmOrange/20 focus:border-warmOrange focus:bg-white transition-all text-gray-800"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-warmOrange transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-warmOrange/20 focus:border-warmOrange focus:bg-white transition-all text-gray-800"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Mobile Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-warmOrange transition-colors">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-warmOrange/20 focus:border-warmOrange focus:bg-white transition-all text-gray-800"
                    placeholder="10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Set Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-warmOrange transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="block w-full pl-11 pr-11 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-warmOrange/20 focus:border-warmOrange focus:bg-white transition-all text-gray-800"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-warmOrange transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {/* Simplified Text Hint */}
                <p className="mt-2 text-[11px] text-gray-400 font-medium italic px-1">
                  Note: Password must be at least 8 characters long.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-warmOrange transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    className="block w-full pl-11 pr-11 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-warmOrange/20 focus:border-warmOrange focus:bg-white transition-all text-gray-800"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-warmOrange transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="bg-orange-50/50 p-4 rounded-2xl border border-warmOrange/10 flex items-center justify-between group cursor-pointer" onClick={() => setIsRider(!isRider)}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isRider ? 'bg-warmOrange text-white shadow-lg' : 'bg-white text-gray-400 border border-warmOrange/20'}`}>
                    <Bike size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Become a Partner</p>
                    <p className="text-[10px] text-gray-500 font-medium">Join our delivery fleet and earn!</p>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full transition-all relative ${isRider ? 'bg-warmOrange' : 'bg-gray-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${isRider ? 'left-7' : 'left-1'}`}></div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-warmOrange/20 text-sm font-black text-white bg-gradient-to-r from-warmOrange to-orange-600 hover:from-orange-500 hover:to-orange-700 focus:outline-none transform transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? 'Creating Account...' : 'Get Started'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500 font-medium">
             Already have an account?{' '}
            <Link to="/login" className="text-warmOrange font-bold hover:underline whitespace-nowrap">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
