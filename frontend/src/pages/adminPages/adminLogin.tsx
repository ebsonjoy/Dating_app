import React, { useEffect, useState } from 'react';
import { useLoginAdminMutation } from '../../slices/adminApiSlice'; 
import { useDispatch, useSelector } from 'react-redux';
import { setAdminCredentials } from '../../slices/adminAuthSlice'; 
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { AppDispatch } from "../../store";
import { RootState } from '../../store'; 
import { IApiError } from '../../types/error.types';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginAdmin, { isLoading, isError }] = useLoginAdminMutation(); 
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { adminInfo } = useSelector((state: RootState) => state.adminAuth);
//responsive
  useEffect(() => {
    if (adminInfo) {
      navigate('/admin/Dashboard');
    }
  }, [navigate, adminInfo]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please fill in both fields.');
      return;
    }

    try {
      const adminInfo = await loginAdmin({ email, password }).unwrap(); 
      dispatch(setAdminCredentials({ ...adminInfo })); 
      navigate('/admin/Dashboard'); 
    } catch (err:unknown) {
      const error = err as IApiError
      console.error('Failed to login:', error);
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-800 relative px-4">
      {/* Branding Section */}
      <div className="absolute top-0 left-0 flex items-center p-6">
        <h1 className="text-xl sm:text-3xl font-bold text-white mr-2">CoupidsCourt</h1>
        <span className="bg-green-500 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full">
          Admin
        </span>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-lg">
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6">Admin Login</h2>

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Enter your email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="email address"
              className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Enter your Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          {/* Show error message */}
          {isError && <p className="text-red-500 text-center mt-4">Login failed. Please try again.</p>}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
