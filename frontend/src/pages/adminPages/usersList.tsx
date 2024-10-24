import React, { useEffect, useState } from 'react';
import Navbar from '../../components/admin/adminNavBar';
import Header from '../../components/admin/adminHeader';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store'; 
import { useGetAllUsersQuery } from '../../slices/adminApiSlice';
import {useUpdateUserStatusMutation} from '../../slices/adminApiSlice';
//responsive
interface User {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
  isPremium: boolean;
  status: boolean;
  matches: number;
}

const UsersList: React.FC = () => {
  const { data: usersList, error, isLoading, refetch } = useGetAllUsersQuery();
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const navigate = useNavigate();
  const { adminInfo } = useSelector((state: RootState) => state.adminAuth);

  const usersPerPage = 5;
  const [search, setSearch] = useState('');
  const [nameSort, setNameSort] = useState('ascending');
  const [premiumFilter, setPremiumFilter] = useState<'all' | 'premium' | 'free'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!adminInfo) {
      navigate('/admin/login');
    }
  }, [navigate, adminInfo]);

  const filteredUsers = usersList
    ?.filter((user: User) => user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase()))
    .filter((user: User) => premiumFilter === 'all' || (premiumFilter === 'premium' ? user.isPremium : !user.isPremium))
    .sort((a: User, b: User) => (nameSort === 'ascending' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name))) || [];

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleNameSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNameSort(e.target.value);
  };

  const handlePremiumFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPremiumFilter(e.target.value as 'all' | 'premium' | 'free');
  };

  const resetFilters = () => {
    setSearch('');
    setNameSort('ascending');
    setPremiumFilter('all');
  };

  const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      const res = await updateUserStatus({ userId, newStatus });
      if (res) {
        refetch();
      }
    } catch (err) {
      console.error('Failed to update user status:', err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Header title="Users" />
        <div className="flex-1 p-3 bg-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <div>
                <label className="mr-2 text-gray-700">Filter by Name:</label>
                <select
                  value={nameSort}
                  onChange={handleNameSortChange}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 text-white"
                >
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </select>
              </div>
              <div>
                <label className="mr-2 text-gray-700">Premium:</label>
                <select
                  value={premiumFilter}
                  onChange={handlePremiumFilterChange}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 text-white"
                >
                  <option value="all">All</option>
                  <option value="premium">Premium</option>
                  <option value="free">Free</option>
                </select>
              </div>
              <button
                onClick={resetFilters}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Reset Filters
              </button>
            </div>
            <div className="w-full md:w-auto">
              <input
                type="text"
                placeholder="Search by name or email"
                value={search}
                onChange={handleSearchChange}
                className="px-3 py-2 border rounded-md w-full md:w-72 focus:outline-none focus:border-blue-500 text-white"
              />
            </div>
          </div>

          {/* Table for larger screens, Card layout for smaller screens */}
          <div className="overflow-x-auto">
            <table className="hidden md:table w-full table-auto bg-white shadow-md rounded-md">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Phone</th>
                  <th className="py-3 px-4 text-left">Premium/Free</th>
                  <th className="py-3 px-4 text-left">Matches</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user: User, index) => (
                  <tr key={user._id} className="border-b hover:bg-gray-100">
                    <td className="py-3 px-4">{((currentPage - 1) * usersPerPage + (index + 1)).toString().padStart(4, '0')}</td>
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.mobileNumber}</td>
                    <td className="py-3 px-4">{user.isPremium ? 'Premium' : 'Free'}</td>
                    <td className="py-3 px-4">{user.matches}</td>
                    <td className="py-3 px-4">{user.status ? 'Active' : 'Blocked'}</td>
                    <td className="py-3 px-4">
                      <button
                        className={`px-4 py-2 text-white rounded-md ${user.status ? 'bg-red-500' : 'bg-green-500'} hover:opacity-80 transition-opacity`}
                        onClick={() => handleStatusToggle(user._id, user.status)}
                      >
                        {user.status ? 'Block' : 'Unblock'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Card layout for smaller screens */}
            <div className="block md:hidden">
              {currentUsers.map((user: User, index) => (
                <div key={user._id} className="bg-white shadow-md rounded-md mb-4 p-4">
                  <div className="mb-2">
                    <strong>ID: </strong>{((currentPage - 1) * usersPerPage + (index + 1)).toString().padStart(4, '0')}
                  </div>
                  <div className="mb-2">
                    <strong>Name: </strong>{user.name}
                  </div>
                  <div className="mb-2">
                    <strong>Email: </strong>{user.email}
                  </div>
                  <div className="mb-2">
                    <strong>Phone: </strong>{user.mobileNumber}
                  </div>
                  <div className="mb-2">
                    <strong>Premium: </strong>{user.isPremium ? 'Premium' : 'Free'}
                  </div>
                  <div className="mb-2">
                    <strong>Matches: </strong>{user.matches}
                  </div>
                  <div className="mb-2">
                    <strong>Status: </strong>{user.status ? 'Active' : 'Blocked'}
                  </div>
                  <div>
                    <button
                      className={`px-4 py-2 text-white rounded-md ${user.status ? 'bg-red-500' : 'bg-green-500'} hover:opacity-80 transition-opacity`}
                      onClick={() => handleStatusToggle(user._id, user.status)}
                    >
                      {user.status ? 'Block' : 'Unblock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <div className="space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 rounded-md border ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-black'} hover:bg-blue-500 hover:text-white transition-colors`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersList;
