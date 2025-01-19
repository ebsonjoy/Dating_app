import React, { useEffect } from "react";
import Navbar from "../../components/admin/adminNavBar";
import Header from "../../components/admin/adminHeader";
import { useGetPaymentQuery } from "../../slices/adminApiSlice";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useNavigate } from 'react-router-dom';
import { IApiError } from '../../types/error.types';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';


interface IPayment {
  paymentId: string;
  userName?: string;
  planName?: string;
  amount: number;
  date?: string | Date;
}



const RevenueDetails: React.FC = () => {

    const navigate = useNavigate();
    const { adminInfo } = useSelector((state: RootState) => state.adminAuth);
  const { data: payments, isLoading, error } = useGetPaymentQuery();
  const typedError = error as IApiError;
     useEffect(() => {
            if (!adminInfo || (typedError && typedError.status ==401)) {
              navigate('/admin/login');
            }
          }, [navigate, adminInfo, typedError])

      if (isLoading) return <div>Loading...</div>;
      if (typedError) return <div>Error loading payments</div>;
  if (!payments || payments.length === 0) {
    return (
      <div className="flex flex-col md:flex-row h-screen">
        <Navbar />
        <div className="flex-1 flex flex-col">
          <Header title="Revenue Details" />
          <div className="flex-1 bg-gray-100 flex items-center justify-center">
            <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-lg text-gray-700">No payment records found.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Function to export data to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      payments.map((payment: IPayment) => ({
        PaymentID: payment.paymentId,
        UserName: payment.userName || 'N/A',
        PlanName: payment.planName || 'N/A',
        Amount: payment.amount,
        Date: payment.date
        ? new Date(payment.date).toLocaleDateString()
        : 'N/A',
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Revenue");
    XLSX.writeFile(wb, "RevenueDetails.xlsx");
  };

   // Function to export data to PDF
   const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Revenue Details", 14, 20);
    doc.setFontSize(12);

    const headers = ["Payment ID", "User Name", "Plan Name", "Amount (₹)", "Date"];
    const rows = payments.map((payment: IPayment) => [
      payment.paymentId,
      payment.userName || 'N/A',
      payment.planName || 'N/A',
      payment.amount,
      payment.date
    ? new Date(payment.date).toLocaleDateString()
    : 'N/A',
    ]);

    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 30,
      theme: "grid",
    });

    doc.save("RevenueDetails.pdf");
  };



  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header title="Revenue Details" />
        <div className="flex-1 bg-gray-100">
          <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4 flex-col md:flex-row">
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 mt-4 md:mt-0"
            onClick={exportToExcel}
          >
            Export to Excel
          </button>
          <button
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 mt-4 md:mt-0"
            onClick={exportToPDF}
          >
            Export to PDF
          </button>
        </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-800 text-white text-left">
                    <th className="p-4">Payment ID</th>
                    <th className="p-4">User Name</th>
                    <th className="p-4">Plan Name</th>
                    <th className="p-4">Amount (₹)</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment:IPayment) => (
                    <tr key={payment.paymentId} className="border-b">
                      <td className="p-4 text-gray-700">{payment.paymentId}</td>
                      <td className="p-4 text-gray-700">{payment.userName || 'N/A'}</td>
                      <td className="p-4 text-gray-700">{payment.planName || 'N/A'}</td>
                      <td className="p-4 text-gray-700">₹{payment.amount}</td>
                      <td className="p-4 text-gray-700">
        {payment.date ? new Date(payment.date).toLocaleDateString() : 'N/A'}
      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 text-gray-700">
              <div className="text-xl font-semibold mb-2">Revenue Summary:</div>
              <p>
                <span className="font-medium">Total Payments:</span> ₹
                {payments.reduce((acc: number, payment: IPayment) => acc + payment.amount, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueDetails;
