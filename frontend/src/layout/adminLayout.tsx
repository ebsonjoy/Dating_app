
import React from 'react';
import { Outlet } from 'react-router-dom';
// import Navbar from '../components/admin/adminNavBar';
import './adminLayout.css'; 

const AdminLayout: React.FC = () => {
  return (
    <div className="admin-layout">
      
      <div className="main-content">
        <Outlet />  
      </div>
    </div>
  );
};

export default AdminLayout;
