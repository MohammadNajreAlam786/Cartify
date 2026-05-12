import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword') || '';

  const [category, setCategory] = useState('All');
  
  const categories = ['All', 'Clothing', 'Footwear', 'Toys', 'Electronics'];

  const { data, isLoading, error } = useGetProductsQuery({ 
    keyword, 
    category: category === 'All' ? '' : category, 
    pageNumber: 1 
  });

  return (
    <div className="container mx-auto">
      {keyword && (
        <div className="mb-4">
          <Link to="/" className="text-gray-600 hover:text-primary mb-3 inline-block">
            &larr; Go Back
          </Link>
          <h2 className="text-xl text-gray-800">Showing results for: "{keyword}"</h2>
        </div>
      )}

      {!keyword && (
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-gray-600 font-medium mr-2">Filter By:</span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === c 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {keyword ? 'Search Results' : category === 'All' ? 'Latest Products' : `${category} Products`}
      </h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p>{error?.data?.message || error.error}</p>
        </div>
      ) : data.products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">No products found</h2>
          <p className="text-gray-500">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
