// src/components/Navbar.tsx

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiUsers, FiHeart, FiDollarSign, FiLogOut, FiGrid,FiBookOpen } from 'react-icons/fi';
import { useLogoutAdminMutation } from '../../slices/adminApiSlice';
import { useDispatch } from 'react-redux';
import { logoutAdmin } from '../../slices/adminAuthSlice';
import { AppDispatch } from "../../store";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutAdminApi] = useLogoutAdminMutation()
  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = async () => {
    try{
      await logoutAdminApi().unwrap()
      dispatch(logoutAdmin())
      navigate('/admin/Login');
    }catch(err){
      console.log(err);
      
    }
    // localStorage.removeItem('authToken');
    
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/Dashboard', icon: FiGrid },
    { name: 'Users', path: '/admin/usersList', icon: FiUsers },
    { name: 'Matches', path: '/admin/matches', icon: FiHeart },
    { name: 'Advice', path: '/admin/matches', icon: FiBookOpen },
    { name: 'Subscription', path: '/admin/subscriptionPlans', icon: FiDollarSign },
    
  ];

  return (
    <div className="bg-gray-900 text-white w-64 flex flex-col justify-center items-center p-5 h-screen">
      <ul className="space-y-3">
        {navItems.map((item) => (
          <li
            key={item.name}
            className={`flex flex-col items-center cursor-pointer w-full py-3 rounded-lg text-center
            ${location.pathname === item.path ? 'bg-gray- 700 text-yellow-300' : 'hover:bg-gray-700'}`}
            onClick={() => navigate(item.path)}
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
  );
};

export default Navbar;
