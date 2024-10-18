// src/layouts/AdminLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
// import Navbar from '../components/admin/adminNavBar'; // Adjust the path as needed
import './adminLayout.css'; // Import the CSS file

const AdminLayout: React.FC = () => {
  return (
    <div className="admin-layout">
      
      <div className="main-content">
        <Outlet />  {/* Admin content will render here */}
      </div>
    </div>
  );
};

export default AdminLayout;
