import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiUsers, FiBarChart2 , FiLogOut, FiGrid, FiBookOpen, FiMenu } from 'react-icons/fi';
import { BiRupee } from 'react-icons/bi';
import { useLogoutAdminMutation } from '../../slices/adminApiSlice';
import { useDispatch } from 'react-redux';
import { logoutAdmin } from '../../slices/adminAuthSlice';
import { AppDispatch } from "../../store";

//Tailwind

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoutAdminApi] = useLogoutAdminMutation();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    try {
      await logoutAdminApi().unwrap();
      dispatch(logoutAdmin());
      navigate('/admin/Login');
    } catch (err) {
      console.log(err);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/Dashboard', icon: FiGrid },
    { name: 'Users', path: '/admin/usersList', icon: FiUsers },
    { name: 'Revenue', path: '/admin/paymentDetails', icon: FiBarChart2  },
    { name: 'Advice', path: '/admin/adviceCatergory', icon: FiBookOpen },
    { name: 'Subscription', path: '/admin/subscriptionPlans', icon: BiRupee },
  ];

  return (
    <div className="bg-gray-900 text-white flex flex-col h-screen">
      {/* Mobile Menu Button */}
      <div className="flex justify-between items-center p-4 lg:hidden">
        <h1 className="text-2xl">Admin</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <FiMenu className="text-3xl text-white" />
        </button>
      </div>

      {/* Sidebar for larger screens */}
      <div className={`w-64 bg-gray-900 lg:flex lg:flex-col lg:justify-center lg:items-center lg:p-5 h-full ${isMobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
        <ul className="space-y-3">
          {navItems.map((item) => (
            <li
              key={item.name}
              className={`flex flex-col items-center cursor-pointer w-full py-3 rounded-lg text-center
              ${location.pathname === item.path ? 'bg-gray-700 text-yellow-300' : 'hover:bg-gray-700'}`}
              onClick={() => {
                navigate(item.path);
                setIsMobileMenuOpen(false);  // Close mobile menu on click
              }}
            >
              <item.icon className="mb-2 text-2xl" />
              <span>{item.name}</span>
            </li>
          ))}
          <li
            className="flex flex-col items-center cursor-pointer hover:bg-red-600 w-full py-3 rounded-lg text-center text-red-500"
            onClick={handleLogout}
          >
            <FiLogOut className="mb-2 text-2xl" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
