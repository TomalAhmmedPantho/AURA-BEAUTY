import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { FiPlus } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigating to details page if clicking the button
    addToCart(product);
  };

  return (
    <Link to={`/product/${product._id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 h-full flex flex-col">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img 
            src={product.image || `https://images.unsplash.com/photo-1596462502278-27bf85033e5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80`} 
            alt={product.name} 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          {product.isNew && (
            <span className="absolute top-3 left-3 bg-white text-pink-600 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest shadow-sm">
              New
            </span>
          )}
        </div>
        
        {/* Product Details */}
        <div className="p-5 flex flex-col flex-grow">
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">{product.category}</p>
          <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2 flex-grow leading-snug">{product.name}</h3>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
            {/* Bangladeshi Taka Formatting */}
            <span className="text-lg font-bold text-gray-900">
              ৳{product.price?.toLocaleString('en-IN')}
            </span>
            
            <button 
              onClick={handleAddToCart}
              className="bg-pink-50 hover:bg-pink-600 hover:text-white text-pink-600 p-2.5 rounded-full transition-all duration-300 focus:outline-none active:scale-90"
              aria-label="Add to cart"
            >
              <FiPlus size={20} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;