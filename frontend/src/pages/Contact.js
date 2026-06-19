import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      const response = await fetch('food-delivery-system-xb0m.onrender.com/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', msg: 'Message sent successfully! Our team will get back to you soon.' });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({ type: 'error', msg: data.message || 'Something went wrong. Please try again.' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Could not connect to the server. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 py-16 bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <span className="text-warmOrange font-bold tracking-widest text-sm uppercase mb-3">Get in Touch</span>
        <h1 className="text-5xl font-black text-gray-900 mb-4 text-center font-serif tracking-tight">We'd Love to Hear From You</h1>
        <p className="text-gray-500 text-center max-w-2xl mb-12">Whether you have a question about our menu, partnerships, or just want to say hi, we're here for you.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
          
          {/* Contact Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-peach-50 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-peach-50 rounded-2xl flex items-center justify-center text-warmOrange mb-6">
                  <MapPin size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  102, Indiranagar Double Rd, Stage 2,<br />
                  Bangalore, KA 560038
                </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-peach-50 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
                  <Phone size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-600 text-sm font-bold">+91 80 1234 5678</p>
                <p className="text-gray-400 text-xs mt-1">Mon-Sun: 9am - 11pm</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-peach-50 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 mb-6">
                  <Mail size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-600 text-sm font-bold">support@hungry.in</p>
                <p className="text-gray-400 text-xs mt-1">Fast response within 2hr</p>
            </div>
          </div>
          
          {/* Contact Form Content */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-xl border border-peach-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-warmOrange/5 rounded-full -mr-16 -mt-16"></div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-8 font-serif">Send us a Message</h2>
            
            {status.msg && (
              <div className={`mb-8 p-4 rounded-2xl flex items-center space-x-3 animate-in fade-in slide-in-from-top-2 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                {status.type === 'success' ? <CheckCircle size={20} /> : <span className="font-bold text-lg">!</span>}
                <p className="font-bold text-sm tracking-tight">{status.msg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-warmOrange/10 focus:border-warmOrange transition-all bg-gray-50/50 text-gray-900 font-medium" 
                    placeholder="E.g. Rahul Sharma" 
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-warmOrange/10 focus:border-warmOrange transition-all bg-gray-50/50 text-gray-900 font-medium" 
                    placeholder="rahul@example.com" 
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Your Message</label>
                <textarea 
                  id="message" 
                  rows="5" 
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-warmOrange/10 focus:border-warmOrange transition-all bg-gray-50/50 text-gray-900 font-medium resize-none" 
                  placeholder="How can we help you today?"
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-warmOrange to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-black py-4 px-8 rounded-2xl shadow-[0_8px_25px_rgba(249,115,22,0.3)] hover:shadow-[0_12px_35px_rgba(249,115,22,0.4)] transition-all transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center space-x-3 disabled:opacity-70"
              >
                {loading ? (
                   <span className="flex items-center space-x-2">
                     <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                     <span>Sending...</span>
                   </span>
                ) : (
                   <>
                     <Send size={20} />
                     <span>Send Message</span>
                   </>
                )}
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Contact;
