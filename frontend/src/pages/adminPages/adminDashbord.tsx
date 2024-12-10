import React, { useEffect } from 'react';
import Navbar from '../../components/admin/adminNavBar';
import Header from '../../components/admin/adminHeader';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetDashBoardMasterDataQuery } from '../../slices/adminApiSlice';
import DashboardChart from './dashboardChart';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { adminInfo } = useSelector((state: RootState) => state.adminAuth);
  const { data: masterData } = useGetDashBoardMasterDataQuery();

  useEffect(() => {
    if (!adminInfo) {
      navigate('/admin/login');
    }
  }, [navigate, adminInfo]);

  // Prepare data for the chart
  const chartData = {
    labels: ['Users', 'Premium Users', 'Revenue', 'Matches'],
    datasets: [
      {
        label: 'Statistics',
        data: [
          masterData?.userCount || 0,
          masterData?.premiumUsers || 0,
          masterData?.totalRevanue || 0,
          masterData?.matchesCount || 0,
        ],
        backgroundColor: ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c'],
      },
    ],
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header title="Dashboard" />
        <div className="flex-1 p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Users */}
            <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center">
              <h3 className="text-lg font-semibold">Total Users</h3>
              <p className="text-3xl mt-2">{masterData?.userCount}</p>
            </div>

            {/* Premium Users */}
            <div className="bg-green-600 text-white p-6 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center">
              <h3 className="text-lg font-semibold">Premium Users</h3>
              <p className="text-3xl mt-2">{masterData?.premiumUsers}</p>
            </div>

            {/* Total Revenue */}
            <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center">
              <h3 className="text-lg font-semibold">Total Revenue</h3>
              <p className="text-3xl mt-2">₹{masterData?.totalRevanue}</p>
            </div>

            {/* Matches */}
            <div className="bg-red-600 text-white p-6 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center">
              <h3 className="text-lg font-semibold">Matches</h3>
              <p className="text-3xl mt-2">{masterData?.matchesCount}</p>
            </div>
          </div>

          {/* Chart Section */}
          <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Graphical Representation</h2>
            {masterData && <DashboardChart data={chartData} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
