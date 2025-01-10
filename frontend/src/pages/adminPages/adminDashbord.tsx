import React, { useState, useEffect } from 'react';
import Navbar from '../../components/admin/adminNavBar';
import Header from '../../components/admin/adminHeader';
import DashboardCharts from './dashboardChart';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  useGetDashBoardMasterDataQuery, 
  useGetUserChartDataQuery,
  useGetPaymentChartDataQuery 
} from '../../slices/adminApiSlice';
import LoadingSpinner from '../../components/admin/Loader';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { adminInfo } = useSelector((state: RootState) => state.adminAuth);
    const [loading, setLoading] = useState<boolean>(true);
  
  // Time range state
  const [timeRange, setTimeRange] = useState<'day' | 'month' | 'year'>('month');

  

  // Queries
  const { data: masterData,isLoading: isMasterDataLoading, error: masterDataError } = useGetDashBoardMasterDataQuery();
  const { 
    data: userChartData, 
    isLoading: isUserChartLoading, 
    error: userChartError 
  } = useGetUserChartDataQuery({ timeRange });
  const { 
    data: paymentChartData, 
    isLoading: isPaymentChartLoading, 
    error: paymentChartError 
  } = useGetPaymentChartDataQuery({ timeRange });

  useEffect(() => {
    if (!adminInfo) {
      navigate('/admin/login');
    }
  }, [navigate, adminInfo]);


  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Combined loading and error states
  const isLoading = isMasterDataLoading || isUserChartLoading || isPaymentChartLoading || loading;
  const hasError = masterDataError || userChartError || paymentChartError;

  if (isLoading) return <LoadingSpinner />;
  if (hasError) return <div className="text-red-500 text-center mt-10">Failed to load data. Please try again later.</div>;

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header title="Dashboard" />
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-5">
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

          {/* Dashboard Charts */}
          <DashboardCharts 
            userChartData={userChartData?.userGrowthData || []}
            paymentChartData={paymentChartData?.paymentGrowthData || []}
            totalUsers={masterData?.userCount}
            totalPayments={masterData?.totalRevanue}
            onTimeRangeChange={setTimeRange}
            currentTimeRange={timeRange}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;