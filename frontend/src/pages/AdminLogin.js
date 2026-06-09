import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('isAdminAuthenticated', 'true');
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminName', data.name);
        localStorage.setItem('adminEmail', data.email);
        localStorage.setItem('userRole', 'admin');
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Access Denied');
      }
    } catch (err) {
      setError('Connection to server failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-warmOrange/10 rounded-2xl mb-4 text-warmOrange">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Login</h1>
          <p className="text-gray-400 font-medium text-sm mt-1">Secure access to Hungry management</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-xs font-bold text-center animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-warmOrange transition-all">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@hungry.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-warmOrange/20 focus:border-warmOrange focus:bg-white transition-all text-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">Passcode</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-warmOrange transition-all">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Admin Passcode"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-warmOrange/20 focus:border-warmOrange focus:bg-white transition-all text-gray-800 font-bold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-warmOrange transition-all"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-warmOrange/20 text-sm font-black text-white bg-warmOrange hover:bg-orange-600 transition-all active:scale-[0.98] disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? 'Verifying...' : 'Authenticate'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <Link to="/" className="text-xs font-bold text-gray-400 hover:text-warmOrange flex items-center justify-center gap-2 transition-all">
             <ArrowLeft size={14} /> Return to Site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
