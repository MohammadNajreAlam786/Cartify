import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useUpdateProductMutation, useGetProductDetailsQuery, useUploadProductImageMutation } from '../../slices/productsApiSlice';
import Swal from 'sweetalert2';

const ProductEdit = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      }).unwrap();
      Swal.fire('Success', 'Product updated', 'success');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      Swal.fire('Error', err?.data?.message || err.error, 'error');
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      Swal.fire('Success', res.message, 'success');
      setImage(res.image);
    } catch (err) {
      Swal.fire('Error', err?.data?.message || err.error, 'error');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <div className="max-w-2xl mx-auto bg-white shadow-sm p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

        {isLoading ? (
          <div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div></div>
        ) : error ? (
          <div className="bg-red-100 p-4 rounded text-red-700">{error?.data?.message}</div>
        ) : (
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input type="number" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Image</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" value={image} onChange={(e) => setImage(e.target.value)} />
              <input type="file" onChange={uploadFileHandler} className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-blue-600" />
              {loadingUpload && <p>Uploading...</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Brand</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" value={brand} onChange={(e) => setBrand(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Count In Stock</label>
              <input type="number" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" rows="4" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>

            <button type="submit" disabled={loadingUpdate} className="w-full bg-primary text-white font-bold py-2 px-4 rounded hover:bg-blue-600">
              {loadingUpdate ? 'Updating...' : 'Update Product'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductEdit;
