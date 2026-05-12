import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../../slices/usersApiSlice';
import Swal from 'sweetalert2';

const UserEdit = () => {
  const { id: userId } = useParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const { data: user, isLoading, error, refetch } = useGetUserDetailsQuery(userId);
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId, name, email, isAdmin });
      Swal.fire('Success', 'User updated successfully', 'success');
      refetch();
      navigate('/admin/userlist');
    } catch (err) {
      Swal.fire('Error', err?.data?.message || err.error, 'error');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Link to="/admin/userlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <div className="max-w-2xl mx-auto bg-white shadow-sm p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-6">Edit User</h1>
        
        {loadingUpdate && <div className="text-center">Updating...</div>}

        {isLoading ? (
          <div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div></div>
        ) : error ? (
          <div className="bg-red-100 p-4 rounded text-red-700">{error?.data?.message || error.error}</div>
        ) : (
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="flex items-center space-x-3 mt-4">
              <input type="checkbox" id="isadmin" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
              <label htmlFor="isadmin" className="text-sm font-medium text-gray-700">Is Admin</label>
            </div>

            <button type="submit" className="w-full bg-primary text-white font-bold py-2 px-4 rounded hover:bg-blue-600 mt-6" disabled={loadingUpdate}>
              Update User
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserEdit;
