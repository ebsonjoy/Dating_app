import React from "react";
import Navbar from "../../components/admin/adminNavBar";
import Header from "../../components/admin/adminHeader";

const RevenueDetails: React.FC = () => {
  const payments = [
    {
      id: "0001",
      userName: "John Doe",
      planName: "Premium",
      amount: 999,
      date: "2024-11-01",
      status: "Success",
    },
    {
      id: "0002",
      userName: "Jane Smith",
      planName: "Basic",
      amount: 499,
      date: "2024-11-03",
      status: "Success",
    },
    {
      id: "0003",
      userName: "Mark Johnson",
      planName: "Standard",
      amount: 699,
      date: "2024-11-05",
      status: "Failed",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Navbar />

      <div className="flex-1 flex flex-col">
        <Header title="Revenue Details" />

        <div className="flex-1 bg-gray-100">
          <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4 flex-col md:flex-row">
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 mt-4 md:mt-0"
                onClick={() => alert("Exporting to Excel...")}
              >
                Export to Excel
              </button>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-800 text-white text-left">
                    <th className="p-4">Payment ID</th>
                    <th className="p-4">User Name</th>
                    <th className="p-4">Plan Name</th>
                    <th className="p-4">Amount (₹)</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b">
                      <td className="p-4 text-gray-700">{payment.id}</td>
                      <td className="p-4 text-gray-700">{payment.userName}</td>
                      <td className="p-4 text-gray-700">{payment.planName}</td>
                      <td className="p-4 text-gray-700">₹{payment.amount}</td>
                      <td className="p-4 text-gray-700">{payment.date}</td>
                      <td
                        className={`p-4 text-white rounded-md ${
                          payment.status === "Success"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {payment.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Section */}
            <div className="mt-6 text-gray-700">
              <div className="text-xl font-semibold mb-2">Revenue Summary:</div>
              <p>
                <span className="font-medium">Total Successful Payments:</span>{" "}
                ₹{payments
                  .filter((payment) => payment.status === "Success")
                  .reduce((acc, payment) => acc + payment.amount, 0)}
              </p>
              <p>
                <span className="font-medium">Total Failed Payments:</span>{" "}
                {payments.filter((payment) => payment.status === "Failed")
                  .length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueDetails;
