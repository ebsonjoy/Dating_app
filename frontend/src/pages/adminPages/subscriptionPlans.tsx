// src/pages/PlanList.tsx

import React, { useEffect, useState } from "react";
import Navbar from "../../components/admin/adminNavBar";
import Header from "../../components/admin/adminHeader";
import { useNavigate } from "react-router-dom";
import { useGetPlansQuery } from "../../slices/adminApiSlice";
// Mock plan data (replace with actual data from backend later)
interface Plans {
  _id: string;
  planName: string;
  duration: string;
  offerPercentage: number;
  upto: number;
  actualPrice: number;
  offerPrice: number;
  offerName: string;
  status:boolean;
}

const PlanList: React.FC = () => {
  const { data: planList, error, isLoading } = useGetPlansQuery();

  console.log(planList);

  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plans[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const plansPerPage = 3;

  // Pagination calculations
  const indexOfLastPlan = currentPage * plansPerPage;
  const indexOfFirstPlan = indexOfLastPlan - plansPerPage;
  const currentPlans = plans.slice(indexOfFirstPlan, indexOfLastPlan);
  const totalPages = Math.ceil(plans.length / plansPerPage);

  useEffect(() => {
    if (planList && Array.isArray(planList)) {
      setPlans(planList);
    }
  }, [planList]);
  const handleEditPlan = (planId: string) => {
    navigate(`/admin/editPlan/${planId}`);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error loading plans</p>;
  }

  return (
    <div className="flex h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header title="Subscription Plans" />

        {/* Plan List Content */}
        <div className="flex-1 p-6 bg-gray-100">
          <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
            {/* Flexbox for heading and add plan button */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold text-gray-800">
                Subscription Plans
              </h1>
              <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
              onClick={()=>navigate('/admin/addPlans')}
              >
                Add Plan
              </button>
            </div>

            {/* Plans Table */}
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-800 text-white text-left">
                  <th className="p-4">Plan ID</th>
                  <th className="p-4">Plan Name</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Offer Percentage</th>
                  <th className="p-4">Upto</th>
                  <th className="p-4">Actual Price</th>
                  <th className="p-4">Offer Price</th>
                  <th className="p-4">Offer Name</th>
                  <th className="p-4">Hide</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPlans.map((plan: Plans, index) => (
                  <tr key={plan._id} className="border-b">
                    <td className="p-4 text-gray-700">
                      {((currentPage - 1) * plansPerPage + (index + 1))
                        .toString()
                        .padStart(4, "0")}
                    </td>
                    <td className="p-4 text-gray-700">{plan.planName}</td>
                    <td className="p-4 text-gray-700">{plan.duration}</td>
                    <td className="p-4 text-gray-700">
                      {plan.offerPercentage}
                    </td>
                    <td className="p-4 text-gray-700">{plan.upto}</td>
                    <td className="p-4 text-gray-700">{plan.actualPrice}</td>
                    <td className="p-4 text-gray-700">{plan.offerPrice}</td>
                    <td className="p-4 text-gray-700">{plan.offerName}</td>
                    <td className="p-4">
                      <button
                        className={`px-3 py-1 text-white rounded-md ${
                            plan.status ? "bg-red-500" : "bg-green-500"
                        } hover:opacity-80 transition-opacity`}
                        onClick={() =>
                          handleStatusToggle(plan._id, plan.status)
                        }
                      >
                        {plan.status ? "Hide" : "UnHIde"}
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition duration-200"
                        onClick={() => handleEditPlan(plan._id)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              {/* Left Side: Page Numbers */}
              <div className="text-gray-700 text-sm">
                Page {currentPage} of {totalPages}
              </div>

              {/* Right Side: Arrows */}
              <div className="flex items-center space-x-2">
                <button
                  className={`px-2 py-1 rounded-md text-white bg-blue-600 ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  &larr;
                </button>

                <button
                  className={`px-2 py-1 rounded-md text-white bg-blue-600 ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanList;
