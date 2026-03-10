import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-serif font-bold text-pink-600 mb-4 block">
              Aura Beauty
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Elevating your natural beauty with premium, cruelty-free products designed for every skin type.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors"><FiInstagram className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors"><FiTwitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors"><FiFacebook className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-4 uppercase text-sm tracking-wider">Shop</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-pink-600 transition-colors">Skincare</Link></li>
              <li><Link to="/" className="hover:text-pink-600 transition-colors">Makeup</Link></li>
              <li><Link to="/" className="hover:text-pink-600 transition-colors">Haircare</Link></li>
              <li><Link to="/" className="hover:text-pink-600 transition-colors">Best Sellers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-4 uppercase text-sm tracking-wider">About</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-pink-600 transition-colors">Our Story</Link></li>
              <li><Link to="/" className="hover:text-pink-600 transition-colors">Ingredients</Link></li>
              <li><Link to="/" className="hover:text-pink-600 transition-colors">Sustainability</Link></li>
              <li><Link to="/" className="hover:text-pink-600 transition-colors">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-4 uppercase text-sm tracking-wider">Help</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-pink-600 transition-colors">FAQ</Link></li>
              <li><Link to="/" className="hover:text-pink-600 transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/" className="hover:text-pink-600 transition-colors">Contact Us</Link></li>
              <li><Link to="/" className="hover:text-pink-600 transition-colors">Track Order</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Aura Beauty. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <Link to="/" className="hover:text-pink-600 transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-pink-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
