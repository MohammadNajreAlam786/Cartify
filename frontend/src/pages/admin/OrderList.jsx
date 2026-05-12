import React from 'react';
import { Link } from 'react-router-dom';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import { formatINR } from '../../utils/formatPrice';

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">Orders (Admin)</h1>
      {isLoading ? (
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          {error?.data?.message || error.error}
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USER</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TOTAL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DELIVERED</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order._id.substring(0, 10)}...</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.user && order.user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.createdAt.substring(0, 10)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatINR(order.totalPrice)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-left">
                    {order.isPaid ? <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{order.paidAt.substring(0, 10)}</span> : <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">No</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-left">
                    {order.isDelivered ? <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{order.deliveredAt.substring(0, 10)}</span> : <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">No</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/order/${order._id}`} className="text-primary hover:text-blue-900 bg-gray-100 px-3 py-1 rounded">Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderList;
