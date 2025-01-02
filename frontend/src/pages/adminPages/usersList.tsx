import React, { useEffect } from 'react';
import Navbar from '../../components/admin/adminNavBar';
import Header from '../../components/admin/adminHeader';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useGetAllUsersQuery, useUpdateUserStatusMutation } from '../../slices/adminApiSlice';
import GenericTable, { Column } from '../../components/admin/reusableTable/genericTable';

interface ISubscription {
  isPremium: boolean;
  planId: string;
  planExpiryDate: string;
  planStartingDate: string;
}

interface IUser {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
  subscription?: ISubscription;
  matches: number;
  status: boolean;
}

const UsersList: React.FC = () => {
  const { data, error, isLoading, refetch } = useGetAllUsersQuery();
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const navigate = useNavigate();
  const { adminInfo } = useSelector((state: RootState) => state.adminAuth);

  const usersList: IUser[] = Array.isArray(data) ? data : [];

  useEffect(() => {
    if (!adminInfo) {
      navigate('/admin/login');
    }
  }, [navigate, adminInfo]);

  const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      const res = await updateUserStatus({ userId, newStatus }).unwrap();
      console.log('res',res)
      if (res) {
        refetch();
      }
    } catch (err) {
      console.error('Failed to update user status:', err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  const userColumns: Column<IUser>[] = [
    {
      key: 'name',
      label: 'Name'
    },
    {
      key: 'email',
      label: 'Email'
    },
    {
      key: 'mobileNumber',
      label: 'Phone'
    },
    {
      key: 'subscription',
      label: 'Premium/Free',
      render: (value) => (value as ISubscription)?.isPremium ? 'Premium' : 'Free'
    },
    {
      key: 'matches',
      label: 'Matches'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => value ? 'Active' : 'Blocked'
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header title="Users" />
        <div className="flex-1 p-3 bg-gray-100">
          <GenericTable<IUser>
            data={usersList}
            columns={userColumns}
            searchKeys={['name', 'email']}
            actionButtons={(user) => (
              <button
                className={`px-4 py-2 text-white rounded-md ${
                  user.status ? 'bg-red-500' : 'bg-green-500'
                } hover:opacity-80 transition-opacity`}
                onClick={() => handleStatusToggle(user._id, user.status)}
              >
                {user.status ? 'Block' : 'Unblock'}
              </button>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default UsersList;