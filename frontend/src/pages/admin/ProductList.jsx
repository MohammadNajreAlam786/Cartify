import React from 'react';
import { Link } from 'react-router-dom';
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from '../../slices/productsApiSlice';
import { Edit, Trash, Plus } from 'lucide-react';
import Swal from 'sweetalert2';
import { formatINR } from '../../utils/formatPrice';

const ProductList = () => {
  const { data, isLoading, error, refetch } = useGetProductsQuery({ keyword: '', pageNumber: 1 });
  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new sample product?')) {
      try {
        await createProduct();
        refetch();
        Swal.fire('Success', 'Product Created', 'success');
      } catch (err) {
        Swal.fire('Error', err?.data?.message || err.error, 'error');
      }
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        refetch();
        Swal.fire('Success', 'Product Deleted', 'success');
      } catch (err) {
        Swal.fire('Error', err?.data?.message || err.error, 'error');
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Products (Admin)</h1>
        <button
          className="flex items-center bg-primary hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={createProductHandler}
          disabled={loadingCreate}
        >
          <Plus className="w-5 h-5 mr-1" /> Create Product
        </button>
      </div>

      {(isLoading || loadingDelete || loadingCreate) ? (
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRICE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CATEGORY</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BRAND</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product._id.substring(0, 10)}...</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatINR(product.price)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                       <Link to={`/admin/product/${product._id}/edit`} className="text-primary hover:text-blue-900 bg-gray-100 p-2 rounded">
                         <Edit className="w-4 h-4" />
                       </Link>
                       <button onClick={() => deleteHandler(product._id)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded">
                         <Trash className="w-4 h-4" />
                       </button>
                    </div>
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

export default ProductList;
