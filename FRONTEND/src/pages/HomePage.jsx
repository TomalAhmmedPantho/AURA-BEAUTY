import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import api from '../services/api.js';

// Mock data for fallback if API fails
const MOCK_PRODUCTS = [
  { id: 1, name: 'Radiance Vitamin C Serum', price: 45.00, category: 'Skincare', isNew: true, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { id: 2, name: 'Hydrating Rosewater Toner', price: 28.00, category: 'Skincare', isNew: false, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { id: 3, name: 'Luminous Silk Foundation', price: 52.00, category: 'Makeup', isNew: false, image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { id: 4, name: 'Velvet Matte Lipstick', price: 24.00, category: 'Makeup', isNew: true, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { id: 5, name: 'Nourishing Hair Oil', price: 35.00, category: 'Haircare', isNew: false, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { id: 6, name: 'Gentle Foaming Cleanser', price: 22.00, category: 'Skincare', isNew: false, image: 'https://images.unsplash.com/photo-1556228720-192a6af4e86e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Calls http://localhost:5000/api/products
      const response = await api.get('/products');
      setProducts(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Could not load products. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-pink-50 h-[500px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1615397323753-156d81b36e8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
            alt="Beauty Products" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 container mx-auto px-8 md:px-16">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 leading-tight mb-6">
              Discover Your Natural Radiance
            </h1>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Clean, cruelty-free beauty essentials crafted to enhance your unique glow. Formulated with skin-loving ingredients.
            </p>
            <button className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-8 rounded-full transition-colors shadow-lg shadow-pink-200">
              Shop the Collection
            </button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Trending Now</h2>
            <p className="text-gray-500">Our most loved beauty essentials</p>
          </div>
        </div>

        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-yellow-700 rounded-r-md">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl p-4 h-80 border border-gray-100 flex flex-col">
                <div className="bg-gray-200 h-48 rounded-xl mb-4 w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="mt-auto flex justify-between">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
      
      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-gray-100">
        <div className="text-center p-6">
          <div className="w-16 h-16 mx-auto bg-pink-50 rounded-full flex items-center justify-center mb-4 text-pink-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Cruelty Free</h3>
          <p className="text-gray-500 text-sm">We never test on animals, and our products are 100% cruelty-free.</p>
        </div>
        <div className="text-center p-6">
          <div className="w-16 h-16 mx-auto bg-pink-50 rounded-full flex items-center justify-center mb-4 text-pink-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Clean Ingredients</h3>
          <p className="text-gray-500 text-sm">Formulated without parabens, sulfates, or artificial fragrances.</p>
        </div>
        <div className="text-center p-6">
          <div className="w-16 h-16 mx-auto bg-pink-50 rounded-full flex items-center justify-center mb-4 text-pink-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Free Shipping</h3>
          <p className="text-gray-500 text-sm">Enjoy free standard shipping on all orders over $50.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
