import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext.jsx';
import api from '../services/api.js';



const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // This 'id' comes from the URL via useParams()
        // It matches the MongoDB _id
        const response = await api.get(`/products/${id}`);
        
        // Mongoose returns the actual object from the database
        setProduct(response.data); 
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Product not found or database connection failed.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // This ensures it refreshes if you click a related product

  const handleQuantityChange = (type) => {
    if (type === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    } else if (type === 'increase' && (!product.stockCount || quantity < product.stockCount)) {
      setQuantity(quantity + 1);
    }
  };

const handleAddToCart = () => {
    // Ensure we are passing the object that has the _id from MongoDB
    if (product) {
      addToCart(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
        <button onClick={() => navigate('/')} className="text-pink-600 hover:underline">
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-500 hover:text-pink-600 mb-8 transition-colors"
      >
        <FiArrowLeft className="mr-2" /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-gray-50 rounded-3xl overflow-hidden aspect-square border border-gray-100 relative">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          {product.isNew && (
            <span className="absolute top-6 left-6 bg-white text-pink-600 text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              New Arrival
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <p className="text-sm text-pink-600 uppercase tracking-widest font-semibold mb-2">
            {product.category}
          </p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            {product.name}
          </h1>
          <p className="text-2xl text-gray-900 mb-6 font-medium">
            ৳ {product.price.toLocaleString('en-IN')}
          </p>

          <div className="prose prose-pink text-gray-600 mb-8">
            <p className="leading-relaxed">{product.description}</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className={`w-3 h-3 rounded-full mr-2 ${product.inStock !== false ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium text-gray-700">
                {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-full bg-white">
                <button 
                  onClick={() => handleQuantityChange('decrease')}
                  className="p-3 text-gray-500 hover:text-pink-600 disabled:opacity-50 transition-colors"
                  disabled={quantity <= 1}
                >
                  <FiMinus />
                </button>
                <span className="w-10 text-center font-medium text-gray-900">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange('increase')}
                  className="p-3 text-gray-500 hover:text-pink-600 disabled:opacity-50 transition-colors"
                  disabled={product.stockCount && quantity >= product.stockCount}
                >
                  <FiPlus />
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={product.inStock === false}
                className={`flex-1 py-3 px-6 rounded-full font-medium text-white transition-all flex justify-center items-center ${
                  added 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md shadow-pink-200'
                }`}
              >
                {added ? (
                  <><FiCheck className="mr-2" /> Added to Cart</>
                ) : (
                  'Add to Cart'
                )}
              </button>
            </div>
          </div>

          {/* Additional Info Accordion style */}
          <div className="border-t border-gray-200 pt-6 mt-auto">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Key Ingredients</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.ingredients || 'Clean, cruelty-free ingredients suitable for all skin types.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
