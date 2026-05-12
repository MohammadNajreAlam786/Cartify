import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { formatINR } from '../utils/formatPrice';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      <Link to={`/product/${product._id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100 p-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.onerror = null; e.target.src = '/images/sample.jpg'; }}
          />
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-700 px-2 py-1 rounded shadow-sm">
            {product.category}
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-gray-800 font-semibold text-lg line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-2 flex items-center">
          <div className="flex bg-green-600 text-white text-xs px-1.5 py-0.5 rounded items-center">
            <span className="font-bold mr-1">{product.rating}</span>
            <Star className="w-3 h-3 fill-current" />
          </div>
          <span className="text-gray-500 text-sm ml-2">({product.numReviews})</span>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">{formatINR(product.price)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
