import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-peach-100 pt-16 pb-8">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-4xl font-bold text-warmOrange font-serif tracking-tight">Hungry</span>
            </Link>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
              Delicious multi-cuisine food delivered hot and fresh to your doorstep. Experience the joy of eating from the comfort of your home.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 bg-peach-50 rounded-full flex items-center justify-center text-warmOrange hover:bg-warmOrange hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 bg-peach-50 rounded-full flex items-center justify-center text-warmOrange hover:bg-warmOrange hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 bg-peach-50 rounded-full flex items-center justify-center text-warmOrange hover:bg-warmOrange hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-gray-900 font-semibold mb-6 text-lg">Company</h3>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-gray-500 hover:text-warmOrange transition-colors text-sm">About Us</Link></li>
              <li><Link to="/partner" className="text-gray-500 hover:text-warmOrange transition-colors text-sm">Partner with us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-6 text-lg">Help & Support</h3>
            <ul className="space-y-4">
              <li><Link to="/contact" className="text-gray-500 hover:text-warmOrange transition-colors text-sm">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-500 hover:text-warmOrange transition-colors text-sm">FAQ</Link></li>
              <li><Link to="/refunds" className="text-gray-500 hover:text-warmOrange transition-colors text-sm">Cancellations & Refunds</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-6 text-lg">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex flex-start space-x-3">
                <MapPin size={20} className="text-warmOrange flex-shrink-0 mt-0.5" />
                <span className="text-gray-500 text-sm">123 Food Street, Yum Yum City, 456789</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-warmOrange flex-shrink-0" />
                <span className="text-gray-500 text-sm">+1 (234) 567-8900</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-warmOrange flex-shrink-0" />
                <span className="text-gray-500 text-sm">hello@hungry.com</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-peach-100 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Hungry. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/terms" className="text-gray-400 hover:text-warmOrange text-sm transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="text-gray-400 hover:text-warmOrange text-sm transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
