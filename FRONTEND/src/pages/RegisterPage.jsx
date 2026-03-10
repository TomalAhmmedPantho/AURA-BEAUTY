import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', formData);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-3xl font-serif font-bold text-center mb-8">Create Account</h2>
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3.5 text-gray-400" />
              <input type="text" required className="w-full pl-10 pr-3 py-2.5 border rounded-xl" placeholder="Tomal Ahmed"
                onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3.5 text-gray-400" />
              <input type="email" required className="w-full pl-10 pr-3 py-2.5 border rounded-xl" placeholder="tomal@example.com"
                onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3.5 text-gray-400" />
              <input type="password" required className="w-full pl-10 pr-3 py-2.5 border rounded-xl" placeholder="••••••••"
                onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
          </div>
          <button disabled={loading} className="w-full bg-pink-600 text-white py-3 rounded-full font-bold hover:bg-pink-700 transition disabled:opacity-50">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account? <Link to="/login" className="text-pink-600 font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;