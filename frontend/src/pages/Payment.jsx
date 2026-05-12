import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../slices/cartSlice';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('Stripe');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
          Payment Method
        </h2>
        
        <form onSubmit={submitHandler}>
          <div className="space-y-4 mb-6">
            <div className="flex items-center p-4 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition">
              <input
                id="Stripe"
                name="paymentMethod"
                type="radio"
                value="Stripe"
                className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                checked={paymentMethod === 'Stripe'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="Stripe" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer w-full h-full">
                Stripe or Credit Card
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
