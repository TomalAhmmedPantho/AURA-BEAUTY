import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTruck, FiMapPin, FiCheckCircle, FiPhone, FiHome } from 'react-icons/fi';
import { useCart } from '../context/CartContext.jsx';
import api from '../services/api.js';

const CartPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Shipping & Contact State
  const [deliveryLocation, setDeliveryLocation] = useState('inside');
  const [shippingFee, setShippingFee] = useState(80);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setShippingFee(deliveryLocation === 'inside' ? 80 : 120);
  }, [deliveryLocation]);

  const totalWithShipping = cartTotal + shippingFee;

  const handlePlaceOrder = async () => {
    // Basic validation
    if (!address || !phone) {
      alert("Please provide your delivery address and phone number.");
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          product: item._id
        })),
        shippingAddress: {
          address: address,
          city: deliveryLocation === 'inside' ? "Dhaka" : "Outside Dhaka",
          phone: phone, // ✅ Now sending the required phone number
          country: "Bangladesh"
        },
        shippingLocation: deliveryLocation,
        shippingPrice: shippingFee,
        totalPrice: totalWithShipping,
        paymentMethod: 'Cash on Delivery'
      };

      const response = await api.post('/orders', orderData);
      
      if (response.status === 201) {
        alert('Order Placed! Our team will call you for confirmation.');
        clearCart();
        navigate('/my-orders');
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong. Please log in again.");
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) return <div className="text-center py-20 font-serif text-2xl">Your cart is empty</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-8">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Checkout</h1>

        {/* 1. Delivery Details Form */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <FiMapPin className="mr-2 text-pink-500" /> Delivery Details
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Full Address</label>
              <div className="relative">
                <FiHome className="absolute left-4 top-4 text-gray-400" />
                <textarea 
                  required
                  placeholder="House #, Road #, Area..."
                  className="w-full pl-12 p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                  rows="3"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Phone Number (For Delivery Call)</label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="tel"
                  required
                  placeholder="01XXXXXXXXX"
                  className="w-full pl-12 p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Items List (Simplified) */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-700 ml-2">Order Items</h3>
          {cartItems.map(item => (
            <div key={item._id} className="flex items-center bg-white p-4 rounded-2xl border border-gray-50">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
              <div className="ml-4 flex-grow">
                <h4 className="font-bold text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-bold">৳{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Summary & Payment */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <FiTruck className="mr-2 text-pink-500" /> Shipping Area
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setDeliveryLocation('inside')}
              className={`py-4 rounded-2xl text-xs font-bold border transition-all ${deliveryLocation === 'inside' ? 'bg-pink-600 text-white border-pink-600 shadow-lg shadow-pink-200' : 'bg-gray-50 text-gray-500 border-gray-100'}`}
            >
              Inside Dhaka<br/><span className="text-lg">৳80</span>
            </button>
            <button 
              onClick={() => setDeliveryLocation('outside')}
              className={`py-4 rounded-2xl text-xs font-bold border transition-all ${deliveryLocation === 'outside' ? 'bg-pink-600 text-white border-pink-600 shadow-lg shadow-pink-200' : 'bg-gray-50 text-gray-500 border-gray-100'}`}
            >
              Outside Dhaka<br/><span className="text-lg">৳120</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl">
          <h2 className="text-xl font-bold mb-6">Total Bill</h2>
          <div className="space-y-4 text-sm opacity-70">
            <div className="flex justify-between"><span>Subtotal</span><span>৳{cartTotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Delivery Fee</span><span>৳{shippingFee}</span></div>
          </div>
          <div className="border-t border-white/10 my-6 pt-6 flex justify-between items-center">
            <span className="text-lg">Total</span>
            <span className="text-3xl font-bold text-pink-400">৳{totalWithShipping.toLocaleString()}</span>
          </div>
          
          <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center text-xs">
            <FiCheckCircle className="text-green-400 mr-2 shrink-0" />
            <span>Pay on Delivery: <strong>Cash</strong></span>
          </div>

          <button 
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-500 text-white py-5 rounded-2xl font-black text-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "SAVING ORDER..." : "PLACE ORDER"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;