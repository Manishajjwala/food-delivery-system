import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if(password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userName', data.name);
        navigate('/dashboard');
        window.location.reload();
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      alert('Could not connect to the server');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-lg border border-peach-50 relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 -mt-4 -ml-4 w-24 h-24 bg-peach-100 rounded-full opacity-50"></div>
        <div className="absolute bottom-0 right-0 -mb-4 -mr-4 w-32 h-32 bg-peach-50 rounded-full opacity-50"></div>

        <div className="relative z-10">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 font-serif tracking-tight">Join Hungry</h2>
            <p className="mt-2 text-sm text-gray-600">
              Create an account to start ordering
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSignup}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-warmOrange focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-warmOrange focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-warmOrange focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-warmOrange focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-warmOrange hover:bg-peach-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warmOrange transform transition-transform hover:-translate-y-0.5"
              >
                Sign Up
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
             Already have an account?{' '}
            <Link to="/login" className="font-medium text-warmOrange hover:text-peach-500">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
