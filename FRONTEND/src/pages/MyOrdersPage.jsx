import React, { useEffect, useState } from 'react';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin } from 'react-icons/fi';
import api from '../services/api.js';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = async () => {
    try {
      const { data } = await api.get('/orders/myorders');
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  // Helper to get status colors and icons
  const getStatusDetails = (status) => {
    switch (status) {
      case 'Pending': return { color: 'text-yellow-600 bg-yellow-50', icon: <FiClock /> };
      case 'Processing': return { color: 'text-blue-600 bg-blue-50', icon: <FiPackage /> };
      case 'Shipped': return { color: 'text-purple-600 bg-purple-50', icon: <FiTruck /> };
      case 'Delivered': return { color: 'text-green-600 bg-green-50', icon: <FiCheckCircle /> };
      default: return { color: 'text-red-600 bg-red-50', icon: <FiPackage /> };
    }
  };

  if (loading) return <div className="flex justify-center py-20 animate-pulse text-pink-500">Loading your orders...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-500">Track your beauty essentials from our door to yours.</p>
      </header>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
          <FiShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-medium">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => {
            const statusStyle = getStatusDetails(order.status);
            return (
              <div key={order._id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Header: Order ID & Status */}
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                    <h2 className="text-lg font-mono font-bold text-gray-800 uppercase">#{order._id.slice(-8)}</h2>
                  </div>
                  
                  <div className={`flex items-center px-5 py-2 rounded-full text-sm font-bold ${statusStyle.color}`}>
                    <span className="mr-2">{statusStyle.icon}</span>
                    {order.status}
                  </div>
                </div>

                {/* Body: Items & Details */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Purchased Items</p>
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl" />
                        <div className="flex-grow">
                          <p className="text-sm font-bold text-gray-800">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 p-6 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Date Placed</span>
                      <span className="font-bold">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Shipping To</span>
                      <span className="font-bold flex items-center text-pink-600">
                        <FiMapPin className="mr-1" /> {order.shippingLocation === 'inside' ? 'Dhaka' : 'Outside Dhaka'}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                      <span className="font-bold text-gray-900 text-lg">Total Bill</span>
                      <span className="text-2xl font-black text-pink-600">৳{order.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;