import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiPackage, FiShoppingBag, FiCalendar, FiPhone, FiMapPin, FiCopy, FiX } from 'react-icons/fi';
import api from '../services/api.js';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // State for Address Popup
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: '', price: '', category: 'Skincare', image: '', description: ''
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (err) { console.error("Fetch failed", err); }
    finally { setLoading(false); }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders');
      setAllOrders(data);
    } catch (err) { console.error("Failed to fetch orders", err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) { alert("Failed to update status"); }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm('Delete this order record?')) {
      try {
        await api.delete(`/orders/${id}`);
        fetchOrders();
      } catch (err) { alert("Delete failed"); }
    }
  };

  const handleCopyAddress = (text) => {
    navigator.clipboard.writeText(text);
    alert("Address copied to clipboard!");
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', newProduct);
      setShowModal(false);
      fetchProducts();
      setNewProduct({ name: '', price: '', category: 'Skincare', image: '', description: '' });
    } catch (err) { alert("Only admins can add products!"); }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) { alert("Delete failed"); }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-900 text-pink-600">Aura Admin</h1>
          <p className="text-gray-500 font-medium">Store Operations & Customer Logistics</p>
        </div>
        
        {activeTab === 'products' && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-pink-600 text-white px-8 py-3 rounded-full hover:bg-pink-700 transition shadow-lg flex items-center font-bold"
          >
            <FiPlus className="mr-2" /> Add Product
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-8 bg-gray-100 p-1 rounded-2xl w-fit">
        <button onClick={() => setActiveTab('products')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          <FiShoppingBag className="inline mr-2" /> Inventory
        </button>
        <button onClick={() => setActiveTab('orders')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          <FiPackage className="inline mr-2" /> Orders
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-pink-500"></div></div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {activeTab === 'products' ? (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b text-gray-400 text-xs uppercase tracking-widest font-bold">
                <tr>
                  <th className="p-6">Product</th>
                  <th className="p-6">Category</th>
                  <th className="p-6">Price</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(p => (
                  <tr key={p._id} className="hover:bg-pink-50/30 transition-colors">
                    <td className="p-6 font-semibold text-gray-900">{p.name}</td>
                    <td className="p-6 text-gray-500">{p.category}</td>
                    <td className="p-6 font-bold text-pink-600">৳{p.price?.toLocaleString('en-IN')}</td>
                    <td className="p-6 text-right">
                      <button onClick={() => handleDeleteProduct(p._id)} className="text-red-400 hover:text-red-600"><FiTrash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b text-gray-400 text-xs uppercase tracking-widest font-bold">
                <tr>
                  <th className="p-6">Customer</th>
                  <th className="p-6">Address</th>
                  <th className="p-6">Total Bill</th>
                  <th className="p-6">Status</th>
                  <th className="p-6">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {allOrders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors text-sm">
                    <td className="p-6">
                      <div className="font-bold text-gray-900">{order.user?.name || 'Customer'}</div>
                      <div className="flex items-center text-pink-600 font-bold mt-1">
                        <FiPhone size={12} className="mr-1" /> {order.shippingAddress?.phone}
                      </div>
                    </td>
                    <td className="p-6">
                      <button 
                        onClick={() => setSelectedAddress(order.shippingAddress)}
                        className="flex items-start text-left group hover:bg-pink-50 p-2 -m-2 rounded-xl transition-all max-w-[180px]"
                      >
                        <FiMapPin size={14} className="mr-2 mt-1 shrink-0 text-gray-400 group-hover:text-pink-500" />
                        <span className="text-gray-500 line-clamp-2">{order.shippingAddress?.address}</span>
                      </button>
                    </td>
                    <td className="p-6 font-bold text-gray-900">৳{order.totalPrice?.toLocaleString('en-IN')}</td>
                    <td className="p-6">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-[10px] font-black uppercase px-3 py-2 rounded-xl border-none outline-none cursor-pointer
                          ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 
                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                            'bg-red-100 text-red-700'}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-6">
                      <button onClick={() => handleDeleteOrder(order._id)} className="text-gray-300 hover:text-red-500"><FiTrash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* --- Full Address Modal --- */}
      {selectedAddress && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-serif font-bold text-gray-900">Shipping Info</h3>
              <button onClick={() => setSelectedAddress(null)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><FiX /></button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-pink-50 p-6 rounded-3xl border border-pink-100 relative group">
                <p className="text-gray-800 font-medium text-lg leading-relaxed">
                  {selectedAddress.address}, {selectedAddress.city}
                </p>
                <button 
                  onClick={() => handleCopyAddress(`${selectedAddress.address}, ${selectedAddress.city}`)}
                  className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-sm text-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Copy Address"
                >
                  <FiCopy />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center text-gray-600 font-bold">
                  <FiPhone className="mr-2" /> {selectedAddress.phone}
                </div>
                <button 
                  onClick={() => handleCopyAddress(selectedAddress.phone)}
                  className="text-pink-600 text-sm font-bold"
                >
                  Copy Phone
                </button>
              </div>
            </div>

            <button onClick={() => setSelectedAddress(null)} className="w-full mt-8 bg-gray-900 text-white py-4 rounded-2xl font-bold">Close</button>
          </div>
        </div>
      )}

      {/* Product Modal remains the same */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] p-10 max-w-md w-full shadow-2xl">
            <h2 className="text-3xl font-serif font-bold mb-2 text-pink-600">New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4 mt-6">
              <input type="text" placeholder="Name" required className="w-full border-gray-100 border p-4 rounded-2xl bg-gray-50" onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="৳" required className="w-full border-gray-100 border p-4 rounded-2xl bg-gray-50" onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                <select className="w-full border-gray-100 border p-4 rounded-2xl bg-gray-50" onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                  <option value="Skincare">Skincare</option>
                  <option value="Makeup">Makeup</option>
                  <option value="Haircare">Haircare</option>
                </select>
              </div>
              <input type="text" placeholder="Image URL" className="w-full border-gray-100 border p-4 rounded-2xl bg-gray-50" onChange={e => setNewProduct({...newProduct, image: e.target.value})} />
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-pink-600 text-white py-4 rounded-2xl font-bold">Save</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-bold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;