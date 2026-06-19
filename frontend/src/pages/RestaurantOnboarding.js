import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RestaurantOnboarding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    restaurantName: '',
    restaurantAddress: '',
    city: '',
    ownerName: '',
    phone: '',
    email: '',
    fssai: '',
    gstin: '',
    bankAccount: '',
    ifsc: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Connect to the new Express backend
      const response = await fetch('food-delivery-system-xb0m.onrender.com/api/restaurants/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        // Redirect after success
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        alert('Failed to register restaurant. Please try again later.');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      alert('Could not connect to the server. Make sure the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-12 px-4 shadow sm:rounded-3xl sm:px-10 border border-peach-100 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-serif text-warmOrange">Application Submitted!</h2>
            <p className="text-gray-600 mb-8">
              Thank you for choosing to partner with Hungry. Our team will verify your details and get back to you within 24-48 hours.
            </p>
            <p className="text-sm text-gray-500">Redirecting to home page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-900 font-serif text-warmOrange">
            Partner With Hungry
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Join our network of premium pure vegetarian restaurants and grow your business.
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-3xl p-8 border border-peach-50">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Restaurant Details Section */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-5 flex items-center">
                <span className="bg-peach-100 text-warmOrange p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                </span>
                Restaurant Details
              </h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700">Restaurant Name</label>
                  <div className="mt-1">
                    <input required type="text" name="restaurantName" id="restaurantName" value={formData.restaurantName} onChange={handleChange} className="shadow-sm focus:ring-warmOrange focus:border-warmOrange block w-full sm:text-sm border-gray-300 rounded-xl p-3 bg-gray-50 bg-opacity-50" placeholder="e.g. Royal Maharaja Thali" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="restaurantAddress" className="block text-sm font-medium text-gray-700">Complete Address</label>
                  <div className="mt-1">
                    <textarea required id="restaurantAddress" name="restaurantAddress" rows="3" value={formData.restaurantAddress} onChange={handleChange} className="shadow-sm focus:ring-warmOrange focus:border-warmOrange block w-full sm:text-sm border-gray-300 rounded-xl p-3 bg-gray-50 bg-opacity-50" placeholder="Shop number, Street, Landmark"></textarea>
                  </div>
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <div className="mt-1">
                    <input required type="text" name="city" id="city" value={formData.city} onChange={handleChange} className="shadow-sm focus:ring-warmOrange focus:border-warmOrange block w-full sm:text-sm border-gray-300 rounded-xl p-3 bg-gray-50 bg-opacity-50" placeholder="e.g. Ahmedabad" />
                  </div>
                </div>
              </div>
            </div>

            {/* Owner Details Section */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-5 mt-8 flex items-center">
                <span className="bg-peach-100 text-warmOrange p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </span>
                Owner Details
              </h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <div className="mt-1">
                    <input required type="text" name="ownerName" id="ownerName" value={formData.ownerName} onChange={handleChange} className="shadow-sm focus:ring-warmOrange focus:border-warmOrange block w-full sm:text-sm border-gray-300 rounded-xl p-3 bg-gray-50 bg-opacity-50" />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <div className="mt-1">
                    <input required type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="shadow-sm focus:ring-warmOrange focus:border-warmOrange block w-full sm:text-sm border-gray-300 rounded-xl p-3 bg-gray-50 bg-opacity-50" placeholder="+91" />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <div className="mt-1">
                    <input required type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="shadow-sm focus:ring-warmOrange focus:border-warmOrange block w-full sm:text-sm border-gray-300 rounded-xl p-3 bg-gray-50 bg-opacity-50" />
                  </div>
                </div>
              </div>
            </div>

            {/* Legal & Bank Details Section */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-5 mt-8 flex items-center">
                <span className="bg-peach-100 text-warmOrange p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </span>
                Legal & Bank Details
              </h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="fssai" className="block text-sm font-medium text-gray-700">FSSAI License Number</label>
                  <div className="mt-1">
                    <input required type="text" name="fssai" id="fssai" value={formData.fssai} onChange={handleChange} className="shadow-sm focus:ring-warmOrange focus:border-warmOrange block w-full sm:text-sm border-gray-300 rounded-xl p-3 bg-gray-50 bg-opacity-50" placeholder="14-digit FSSAI number" />
                  </div>
                </div>
                <div>
                  <label htmlFor="gstin" className="block text-sm font-medium text-gray-700">GSTIN (Optional)</label>
                  <div className="mt-1">
                    <input type="text" name="gstin" id="gstin" value={formData.gstin} onChange={handleChange} className="shadow-sm focus:ring-warmOrange focus:border-warmOrange block w-full sm:text-sm border-gray-300 rounded-xl p-3 bg-gray-50 bg-opacity-50" placeholder="15-digit GST Number" />
                  </div>
                </div>
                <div>
                  <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700">Bank Account Number</label>
                  <div className="mt-1">
                    <input required type="text" name="bankAccount" id="bankAccount" value={formData.bankAccount} onChange={handleChange} className="shadow-sm focus:ring-warmOrange focus:border-warmOrange block w-full sm:text-sm border-gray-300 rounded-xl p-3 bg-gray-50 bg-opacity-50" />
                  </div>
                </div>
                <div>
                  <label htmlFor="ifsc" className="block text-sm font-medium text-gray-700">IFSC Code</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input required type="text" name="ifsc" id="ifsc" value={formData.ifsc} onChange={handleChange} className="focus:ring-warmOrange focus:border-warmOrange flex-1 block w-full rounded-xl sm:text-sm border-gray-300 p-3 bg-gray-50 bg-opacity-50 uppercase" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
              <Link to="/" className="text-gray-500 hover:text-gray-900 font-medium">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-3 px-8 border border-transparent shadow-md text-base font-bold rounded-full text-white bg-warmOrange hover:bg-peach-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warmOrange transform hover:-translate-y-1 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RestaurantOnboarding;
