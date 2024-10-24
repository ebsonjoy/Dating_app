import React, { useEffect } from 'react';
import Navbar from '../../components/admin/adminNavBar';
import Header from '../../components/admin/adminHeader';
import { RootState } from '../../store'; 
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
//responsive
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { adminInfo } = useSelector((state: RootState) => state.adminAuth);

  useEffect(() => {
    if (!adminInfo) {
      navigate('/admin/login');
    }
  }, [navigate, adminInfo]);

  return (
    <div className="flex flex-col sm:flex-row h-screen">
      {/* Sidebar (Navbar) */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header title="Dashboard" />

        {/* Stats Section */}
        <div className="flex-1 p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Users */}
            <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center">
              <h3 className="text-lg font-semibold">Total Users</h3>
              <p className="text-3xl mt-2">150</p>
            </div>

            {/* Premium Users */}
            <div className="bg-green-600 text-white p-6 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center">
              <h3 className="text-lg font-semibold">Premium Users</h3>
              <p className="text-3xl mt-2">30</p>
            </div>

            {/* Total Revenue */}
            <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center">
              <h3 className="text-lg font-semibold">Total Revenue</h3>
              <p className="text-3xl mt-2">$5000</p>
            </div>

            {/* Matches */}
            <div className="bg-red-600 text-white p-6 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center">
              <h3 className="text-lg font-semibold">Matches</h3>
              <p className="text-3xl mt-2">75</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
