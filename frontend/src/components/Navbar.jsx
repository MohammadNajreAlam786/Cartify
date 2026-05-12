import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';

const Navbar = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="bg-primary text-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 font-bold text-2xl tracking-tight mr-6">
              Cartify
            </Link>
            <div className="hidden md:block">
              <SearchBox />
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/cart" className="flex items-center hover:text-gray-200 transition">
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </span>
                )}
              </div>
              <span className="font-medium ml-2 hidden sm:block">Cart</span>
            </Link>
            
            {userInfo ? (
               <div className="relative flex items-center space-x-4">
                 {/* Profile Dropdown */}
                 <div className="relative">
                   <button 
                     onClick={() => setIsProfileOpen(!isProfileOpen)}
                     className="flex items-center hover:text-gray-200 transition focus:outline-none"
                   >
                     <User className="h-6 w-6" />
                     <span className="font-medium ml-2 hidden sm:block">{userInfo.name}</span>
                     <ChevronDown className="h-4 w-4 ml-1" />
                   </button>
                   {isProfileOpen && (
                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-700">
                       <Link 
                         to="/profile" 
                         onClick={() => setIsProfileOpen(false)}
                         className="block px-4 py-2 hover:bg-gray-100 transition"
                       >
                         Profile
                       </Link>
                       <button 
                         onClick={() => { setIsProfileOpen(false); logoutHandler(); }}
                         className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition transition-colors"
                       >
                         Logout
                       </button>
                     </div>
                   )}
                 </div>

                 {/* Admin Dropdown */}
                 {userInfo.isAdmin && (
                   <div className="relative">
                     <button 
                       onClick={() => setIsAdminOpen(!isAdminOpen)}
                       className="flex items-center text-yellow-300 hover:text-yellow-100 transition focus:outline-none"
                     >
                       <Settings className="h-6 w-6" />
                       <span className="font-medium ml-2 hidden sm:block">Admin</span>
                       <ChevronDown className="h-4 w-4 ml-1" />
                     </button>
                     {isAdminOpen && (
                       <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-700">
                         <Link 
                           to="/admin/productlist" 
                           onClick={() => setIsAdminOpen(false)}
                           className="block px-4 py-2 hover:bg-gray-100 transition"
                         >
                           Products
                         </Link>
                         <Link 
                           to="/admin/userlist" 
                           onClick={() => setIsAdminOpen(false)}
                           className="block px-4 py-2 hover:bg-gray-100 transition"
                         >
                           Users
                         </Link>
                         <Link 
                           to="/admin/orderlist" 
                           onClick={() => setIsAdminOpen(false)}
                           className="block px-4 py-2 hover:bg-gray-100 transition"
                         >
                           Orders
                         </Link>
                       </div>
                     )}
                   </div>
                 )}
               </div>
            ) : (
               <Link to="/login" className="flex items-center hover:text-gray-200 transition">
                 <User className="h-6 w-6" />
                 <span className="font-medium ml-2 hidden sm:block">Login</span>
               </Link>
            )}
           
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
