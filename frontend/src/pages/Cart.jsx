import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import { Trash2 } from 'lucide-react';
import { formatINR } from '../utils/formatPrice';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="text-gray-500 mb-4">Your cart is empty</div>
          <Link to="/" className="text-primary font-medium hover:underline">
            Go Back
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item._id} className="p-6 flex flex-col sm:flex-row sm:items-center">
                    <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-md overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" onError={(e) => { e.target.onerror = null; e.target.src = '/images/sample.jpg'; }} />
                    </div>
                    
                    <div className="mt-4 sm:flex-1 sm:mt-0 sm:ml-6 flex flex-col justify-between h-full">
                      <div className="flex justify-between w-full mb-2">
                        <Link to={`/product/${item._id}`} className="text-lg font-medium text-gray-900 hover:text-primary transition line-clamp-2 pr-4">{item.name}</Link>
                        <p className="text-lg font-bold text-gray-900 whitespace-nowrap">{formatINR(item.price)}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-4 w-32">
                           <select
                              value={item.qty}
                              onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            >
                              {[...Array(item.countInStock).keys()].map((x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              ))}
                            </select>
                        </div>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-red-500 transition-colors p-2"
                          onClick={() => removeFromCartHandler(item._id)}
                        >
                          <Trash2 className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) Items
              </h2>
              
              <div className="flex justify-between text-gray-900 font-bold text-2xl mb-8">
                <span>Total</span>
                <span>
                  {formatINR(cartItems.reduce((acc, item) => acc + item.qty * item.price, 0))}
                </span>
              </div>
              
              <button
                type="button"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
