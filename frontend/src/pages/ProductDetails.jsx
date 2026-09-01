import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import { Star, ArrowLeft } from 'lucide-react';
import { formatINR } from '../utils/formatPrice';
import { BASE_URL } from '../utils/constants';

const ProductDetails = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);

  const { data: product, isLoading, error } =
    useGetProductDetailsQuery(productId);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
        role="alert"
      >
        <p>{error?.data?.message || 'Something went wrong'}</p>
      </div>
    );
  }

  const imageUrl = product.image?.startsWith('http')
    ? product.image
    : `${BASE_URL}${product.image}`;

  return (
    <div className="container mx-auto py-8">
      <Link
        to="/"
        className="inline-flex items-center text-gray-600 hover:text-primary mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Go Back
      </Link>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row p-6 gap-8">
        <div className="md:w-1/2 flex justify-center items-center bg-gray-50 p-8 rounded-lg">
          <img
            src={imageUrl}
            alt={product.name}
            className="max-h-96 object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `${BASE_URL}/images/tshirt.jpg`;
            }}
          />
        </div>

        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>

            <div className="flex items-center mb-4">
              <div className="flex bg-green-600 text-white px-2 py-1 rounded items-center text-sm">
                <span className="font-bold mr-1">{product.rating}</span>
                <Star className="w-4 h-4 fill-current" />
              </div>

              <span className="text-gray-500 ml-3">
                {product.numReviews} Reviews
              </span>
            </div>

            <p className="text-3xl text-gray-900 font-bold mb-6">
              {formatINR(product.price)}
            </p>

            <p className="text-gray-700 mb-6 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <div className="flex justify-between mb-4 border-b pb-4 border-gray-200">
              <span className="text-gray-600 font-medium">Status</span>

              <span
                className={`font-bold ${
                  product.countInStock > 0
                    ? 'text-green-600'
                    : 'text-red-500'
                }`}
              >
                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {product.countInStock > 0 && (
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600 font-medium">Quantity</span>

                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="block w-24 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;