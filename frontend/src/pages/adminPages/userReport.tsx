import React, { useEffect, useState } from 'react';
import Navbar from "../../components/admin/adminNavBar";
import Header from "../../components/admin/adminHeader";
import { useGetUserReportsQuery,useUpdateReportStatusMutation } from '../../slices/adminApiSlice';
import { IApiError } from '../../types/error.types';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface Reporter {
  _id: string;
  name: string;
  email: string;
}

interface Reported {
  _id: string;
  name: string;
  email: string;
}

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface BlockedUser {
  _id: string;
  reporterId: Reporter;
  reportedId: Reported;
  reason: string;
  additionalDetails: string;
  status: 'Pending' | 'Reviewed' | 'Resolved';
  messages: Message[];
}


const UserReportDetails: React.FC = () => {
   const navigate = useNavigate();
  const { adminInfo } = useSelector((state: RootState) => state.adminAuth);
  const { data: reportData,refetch,error } = useGetUserReportsQuery();
  const typedError = error as IApiError;
  const [updateReportStatus] = useUpdateReportStatusMutation();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<BlockedUser | null>(null);
  const handleStatusChange = async(userId: string, newStatus: 'Pending' | 'Reviewed' | 'Resolved') => {
    console.log('newStatus',newStatus,userId)
    try {
      const status = newStatus;
      const updated = await updateReportStatus({reportId: userId, status });
      if (updated) {
        refetch();
      }
    } catch (err) {
      console.error("Failed to block category:", err);
    }
  };
      useEffect(() => {
        if (!adminInfo || (typedError&& typedError.status == 401)) {
            navigate('/admin/login');
        }
      }, [navigate, adminInfo, typedError]);
  
  useEffect(() => {
    if (reportData?.data) {
      setBlockedUsers(reportData.data);
    }
  }, [reportData])

  if (!blockedUsers || blockedUsers.length === 0) {
    return (
      <div className="flex flex-col lg:flex-row h-screen">
        <Navbar />
        <div className="flex-1 flex flex-col overflow-y-auto">
          <Header title="User Reports" />
          <div className="flex-1 bg-gray-100 flex items-center justify-center">
            <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-lg text-gray-700">No report found.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Navbar */}
      <Navbar />
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header title="User Reports" />
        <div className="flex-1 bg-gray-100 p-6">
          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="p-4">Reporter Name</th>
                  <th className="p-4">Reporter Email</th>
                  <th className="p-4">Reported Name</th>
                  <th className="p-4">Reported Email</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blockedUsers.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="p-4">{user.reporterId.name}</td>
                    <td className="p-4">{user.reporterId.email}</td>
                    <td className="p-4">{user.reportedId.name}</td>
                    <td className="p-4">{user.reportedId.email}</td>
                    {/* Status Dropdown */}
                    <td className="p-4">
                      <select
                        value={user.status}
                        onChange={(e) =>
                          handleStatusChange(user._id, e.target.value as 'Pending' | 'Reviewed' | 'Resolved')
                        }
                        className={`
                          p-2 border rounded-md text-white 
                          ${user.status === 'Pending' ? 'bg-yellow-500' : ''} 
                          ${user.status === 'Reviewed' ? 'bg-blue-500' : ''} 
                          ${user.status === 'Resolved' ? 'bg-green-500' : ''}
                        `}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                    {/* Details Button */}
                    <td className="p-4">
                      <button
                        className="bg-blue-600 text-white py-1 px-2 rounded-md hover:bg-blue-700"
                        onClick={() => setSelectedUser(user)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* User Details Modal */}
          {selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
                <h2 className="text-xl font-semibold mb-4">Blocked User Details</h2>
                <p><strong>Reporter:</strong> {selectedUser.reporterId.name} ({selectedUser.reporterId.email})</p>
                <p><strong>Reported:</strong> {selectedUser.reportedId.name} ({selectedUser.reportedId.email})</p>
                <p><strong>Reason:</strong> {selectedUser.reason}</p>
                <p><strong>Additional Details:</strong> {selectedUser.additionalDetails}</p>

                {/* Messages */}
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Messages:</h3>
                  <div className="max-h-40 overflow-y-auto border p-2 rounded-md">
                    {selectedUser.messages.map((msg) => (
                      <div key={msg._id} className="p-2 border-b last:border-b-0">
                        <p><strong>From:</strong> {msg.senderId}</p>
                        <p><strong>Message:</strong> {msg.message}</p>
                        <p className="text-sm text-gray-500">Sent at: {new Date(msg.createdAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Close Button */}
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                    onClick={() => setSelectedUser(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserReportDetails;
