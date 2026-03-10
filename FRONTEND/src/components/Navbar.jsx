import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiPackage, FiChevronDown, FiSettings } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAdmin = user?.role === 'admin';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-pink-50">
      <div className="container mx-auto px-4 h-20 flex justify-between items-center">
        
        {/* 1. Logo */}
        <Link to="/" className="text-2xl md:text-3xl font-serif font-bold text-pink-600 hover:opacity-80 transition-opacity">
          Aura Beauty
        </Link>

        {/* 2. Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-10">
          <Link to="/" className={`font-medium transition-colors ${location.pathname === '/' ? 'text-pink-600' : 'text-gray-600 hover:text-pink-500'}`}>
            Shop
          </Link>
          
          {/* CART: Hidden for Admins */}
          {!isAdmin && (
            <Link to="/cart" className="relative group text-gray-600 hover:text-pink-600 transition-colors">
              <FiShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 font-semibold focus:outline-none py-2"
              >
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 border border-pink-200">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span>Hi, {user.name.split(' ')[0]}</span>
                <FiChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl py-3 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-2 border-b border-gray-50 mb-2">
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Account</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                    </div>

                    {/* Show My Orders ONLY for Customers */}
                    {!isAdmin ? (
                      <Link to="/my-orders" onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors">
                        <FiPackage className="mr-3 w-4 h-4" /> My Orders
                      </Link>
                    ) : (
                      <Link to="/admin" onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors">
                        <FiSettings className="mr-3 w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    
                    <div className="mt-2 pt-2 border-t border-gray-50">
                      <button onClick={handleLogout} className="w-full flex items-center px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-semibold">
                        <FiLogOut className="mr-3 w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="bg-pink-600 text-white px-7 py-2.5 rounded-full text-sm font-bold hover:bg-pink-700 hover:shadow-lg hover:shadow-pink-200 transition-all active:scale-95">
              Sign In
            </Link>
          )}
        </div>

        {/* 3. Mobile Header Icons */}
        <div className="md:hidden flex items-center space-x-5">
            {!isAdmin && (
              <Link to="/cart" className="relative text-gray-600">
                <FiShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 p-1 focus:bg-pink-50 rounded-lg">
              {isMenuOpen ? <FiX className="w-7 h-7 text-pink-600" /> : <FiMenu className="w-7 h-7" />}
            </button>
        </div>
      </div>

      {/* 4. Mobile Side Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-[80%] bg-white shadow-2xl z-50 md:hidden p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-10">
              <span className="font-serif font-bold text-pink-600 text-xl">Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-100 rounded-full"><FiX /></button>
            </div>

            <div className="flex flex-col space-y-6">
              <Link to="/" className="text-lg font-medium text-gray-800 border-b border-gray-50 pb-2">Shop All</Link>
              {user ? (
                <>
                  {!isAdmin ? (
                    <Link to="/my-orders" className="text-lg font-medium text-gray-800 border-b border-gray-50 pb-2">My Orders</Link>
                  ) : (
                    <Link to="/admin" className="text-lg font-medium text-gray-800 border-b border-gray-50 pb-2 text-pink-600">Admin Dashboard</Link>
                  )}
                  <button onClick={handleLogout} className="text-lg font-bold text-red-500 text-left">Logout</button>
                </>
              ) : (
                <Link to="/login" className="bg-pink-600 text-white py-3 rounded-xl text-center font-bold">Sign In</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;