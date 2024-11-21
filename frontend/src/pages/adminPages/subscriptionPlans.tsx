import React, { useEffect, useState } from "react";
import Navbar from "../../components/admin/adminNavBar";
import Header from "../../components/admin/adminHeader";
import { useNavigate,useSearchParams  } from "react-router-dom";
import { useGetPlansQuery, useUpdatePlanStatusMutation } from "../../slices/adminApiSlice";
// responsive
interface Plans {
  _id: string;
  planName: string;
  duration: string;
  offerPercentage: number;
  actualPrice: number;
  offerPrice: number;
  offerName: string;
  status: boolean;
}

const PlanList: React.FC = () => {
  const { data: planList, error, isLoading, refetch } = useGetPlansQuery();
  const [updatePlanStatus] = useUpdatePlanStatusMutation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [plans, setPlans] = useState<Plans[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const plansPerPage = 3;

  const indexOfLastPlan = currentPage * plansPerPage;
  const indexOfFirstPlan = indexOfLastPlan - plansPerPage;
  const currentPlans = plans.slice(indexOfFirstPlan, indexOfLastPlan);
  const totalPages = Math.ceil(plans.length / plansPerPage);

  useEffect(() => {
    if (planList && Array.isArray(planList)) {
      setPlans(planList);
    }
  }, [planList]);

  useEffect(() => {
    if (searchParams.get('refresh')) {
      refetch();
    }
  }, [searchParams, refetch]);

  const handleEditPlan = (planId: string) => {
    navigate(`/admin/editPlan/${planId}`);
    refetch();
  };

  const handleStatusToggle = async (planId: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      const res = await updatePlanStatus({ planId, newStatus });
      if (res) {
        refetch();
      }
    } catch (err) {
      console.error("Failed to update plan status:", err);
    }
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
    <div className="flex flex-col lg:flex-row h-screen">
      <Navbar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header title="Subscription Plans" />

        <div className="flex-1 bg-gray-100">
          <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4 flex-col md:flex-row">
  <button
    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 mt-4 md:mt-0"
    onClick={() => navigate("/admin/paymentDetails")}
  >
    Revenue Details
  </button>
  <button
    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 mt-4 md:mt-0"
    onClick={() => navigate("/admin/addPlans")}
  >
    Add Plan
  </button>
</div>


            {/* Responsive Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-800 text-white text-left">
                    <th className="p-4">Plan ID</th>
                    <th className="p-4">Plan Name</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4">Offer Percentage %</th>
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
                        {((currentPage - 1) * plansPerPage + (index + 1)).toString().padStart(4, "0")}
                      </td>
                      <td className="p-4 text-gray-700">{plan.planName}</td>
                      <td className="p-4 text-gray-700">{plan.duration}</td>
                      <td className="p-4 text-gray-700">{plan.offerPercentage}%</td>
                      <td className="p-4 text-gray-700">₹{plan.actualPrice}</td>
                      <td className="p-4 text-gray-700">₹{plan.offerPrice}</td>
                      <td className="p-4 text-gray-700">{plan.offerName}</td>
                      <td className="p-4">
                        <button
                          className={`px-3 py-1 text-white rounded-md ${plan.status ? "bg-red-500" : "bg-green-500"} hover:opacity-80 transition-opacity`}
                          onClick={() => handleStatusToggle(plan._id, plan.status)}
                        >
                          {plan.status ? "Hide" : "Unhide"}
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
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 flex-col md:flex-row">
              <div className="text-gray-700 text-sm">Page {currentPage} of {totalPages}</div>
              <div className="flex items-center space-x-2 mt-2 md:mt-0">
                <button
                  className={`px-2 py-1 rounded-md text-white bg-blue-600 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  &larr;
                </button>
                <button
                  className={`px-2 py-1 rounded-md text-white bg-blue-600 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
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
