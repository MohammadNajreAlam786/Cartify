import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
} from '../slices/ordersApiSlice';
import { useSelector } from 'react-redux';
import { FileText } from 'lucide-react';
import Swal from 'sweetalert2';
import { formatINR } from '../utils/formatPrice';

const Order = () => {
  const { id: orderId } = useParams();

  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const simulatePayment = async () => {
    try {
      await payOrder({ orderId, details: { id: 'TEST_PAY', status: 'COMPLETED', update_time: new Date().toISOString(), payer: { email_address: userInfo.email } } });
      refetch();
      Swal.fire({
        icon: 'success',
        title: 'Payment Successful',
        text: 'Your order has been paid simulating a test card.',
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: err?.data?.message || err.message,
      });
    }
  };

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      Swal.fire('Success', 'Order marked as delivered', 'success');
    } catch (err) {
      Swal.fire('Error', err?.data?.message || err.message, 'error');
    }
  };

  const downloadInvoice = () => {
    const link = document.createElement('a');
    link.href = `/api/orders/${orderId}/invoice`;
    link.target = '_blank';
    link.download = `invoice-${orderId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return isLoading ? (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  ) : error ? (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-8">
      <p>{error?.data?.message || error.error}</p>
    </div>
  ) : (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 break-all">Order {order._id}</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping</h2>
            <p className="text-gray-700 mb-4">
              <strong className="font-semibold">Name: </strong> {order.user.name} <br/>
              <strong className="font-semibold">Email: </strong> <a href={`mailto:${order.user.email}`} className="text-primary">{order.user.email}</a> <br/>
              <strong className="font-semibold">Address: </strong>
              {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <div className="bg-green-100 text-green-700 p-3 rounded">Delivered on {order.deliveredAt.substring(0, 10)}</div>
            ) : (
              <div className="bg-red-100 text-red-700 p-3 rounded">Not Delivered</div>
            )}
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Method</h2>
            <p className="text-gray-700 mb-4">
              <strong className="font-semibold">Method: </strong> {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <div className="bg-green-100 text-green-700 p-3 rounded">Paid on {order.paidAt.substring(0, 10)}</div>
            ) : (
              <div className="bg-red-100 text-red-700 p-3 rounded">Not Paid</div>
            )}
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Items</h2>
            <ul className="divide-y divide-gray-200">
              {order.orderItems.map((item, index) => (
                <li key={index} className="py-4 flex">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-contain rounded-md border border-gray-200 p-1" onError={(e) => { e.target.onerror = null; e.target.src = '/images/sample.jpg'; }} />
                  <div className="ml-4 flex-1">
                    <Link to={`/product/${item.product}`} className="font-medium text-gray-900 hover:text-primary transition">{item.name}</Link>
                    <p className="text-gray-500 mt-1">{item.qty} x {formatINR(item.price)} = {formatINR(item.qty * item.price)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Order Summary</h2>
            <div className="space-y-4 text-gray-700 mb-6">
              <div className="flex justify-between"><span>Items</span><span>{formatINR(order.itemsPrice)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{formatINR(order.shippingPrice)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>{formatINR(order.taxPrice)}</span></div>
              <div className="flex justify-between font-bold text-lg text-gray-900 pt-4 border-t"><span>Total</span><span>{formatINR(order.totalPrice)}</span></div>
            </div>

            <button
              type="button"
              className="w-full flex justify-center items-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded mb-4"
              onClick={downloadInvoice}
            >
              <FileText className="w-5 h-5 mr-2" /> Download Invoice (PDF)
            </button>

            {!order.isPaid && (
              <button
                type="button"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded mb-4 disabled:opacity-50"
                onClick={simulatePayment}
                disabled={loadingPay}
              >
                {loadingPay ? 'Processing...' : 'Simulate Payment'}
              </button>
            )}

            {loadingDeliver && <div className="text-center my-2">Loading...</div>}
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <button
                type="button"
                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 px-4 rounded"
                onClick={deliverHandler}
              >
                Mark As Delivered
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
