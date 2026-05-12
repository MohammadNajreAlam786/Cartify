import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import Swal from 'sweetalert2';
import { formatINR } from '../utils/formatPrice';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Order Failed',
        text: err?.data?.message || err.error,
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping</h2>
            <p className="text-gray-700">
              <strong className="font-semibold">Address:</strong>{' '}
              {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
              {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
            </p>
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Method</h2>
            <p className="text-gray-700">
              <strong className="font-semibold">Method:</strong> {cart.paymentMethod}
            </p>
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Items</h2>
            {cart.cartItems.length === 0 ? (
              <p className="text-gray-500">Your cart is empty</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {cart.cartItems.map((item, index) => (
                  <li key={index} className="py-4 flex">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-contain rounded-md border border-gray-200 p-1"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/images/sample.jpg'; }}
                    />
                    <div className="ml-4 flex-1">
                      <Link to={`/product/${item.product}`} className="font-medium text-gray-900 hover:text-primary transition line-clamp-1">
                        {item.name}
                      </Link>
                      <p className="text-gray-500 mt-1">
                        {item.qty} x {formatINR(item.price)} = {formatINR(item.qty * item.price)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Order Summary</h2>
            
            <div className="space-y-4 text-gray-700 mb-6">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{formatINR(cart.itemsPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatINR(cart.shippingPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatINR(cart.taxPrice)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-900 pt-4 border-t">
                <span>Total</span>
                <span>{formatINR(cart.totalPrice)}</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={cart.cartItems.length === 0 || isLoading}
              onClick={placeOrderHandler}
            >
              {isLoading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
