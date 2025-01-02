import React from 'react';
import Navbar from '../../components/admin/adminNavBar';
import Header from '../../components/admin/adminHeader';
import { useNavigate } from 'react-router-dom';
import { useGetPlansQuery, useUpdatePlanStatusMutation } from '../../slices/adminApiSlice';
import GenericTable, { Column } from '../../components/admin/reusableTable/genericTable';

interface IPlan {
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
  const { data, error, isLoading, refetch } = useGetPlansQuery();
  const [updatePlanStatus] = useUpdatePlanStatusMutation();
  const navigate = useNavigate();

  const planList: IPlan[] = Array.isArray(data) ? data : [];

  const handleUpdatePlanStatus = async (planId: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      const res = await updatePlanStatus({ planId, newStatus }).unwrap();
      console.log('resssss',res)
      if (res) {
        refetch();
      }
    } catch (err) {
      console.error("Failed to update plan status:", err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading plans</div>;

  const planColumns: Column<IPlan>[] = [
    { 
      key: 'planName', 
      label: 'Plan Name' 
    },
    { 
      key: 'duration', 
      label: 'Duration' 
    },
    { 
      key: 'offerPercentage', 
      label: 'Offer %',
      render: (value) => `${value}%`
    },
    { 
      key: 'actualPrice', 
      label: 'Actual Price',
      render: (value) => `₹${value}`
    },
    { 
      key: 'offerPrice', 
      label: 'Offer Price',
      render: (value) => `₹${value}`
    },
    { 
      key: 'offerName', 
      label: 'Offer Name' 
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header title="Subscription Plans" />
        <div className="flex-1 bg-gray-100 p-4">
          <div className="flex justify-end mb-4">
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 mr-2"
              onClick={() => navigate("/admin/paymentDetails")}
            >
              Revenue Details
            </button>
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
              onClick={() => navigate("/admin/addPlans")}
            >
              Add Plan
            </button>
          </div>

          <GenericTable<IPlan>
            data={planList}
            columns={planColumns}
            searchKeys={['planName', 'offerName']}
            actionButtons={(plan) => (
              <>
                <button
                  className={`px-3 py-1 text-white rounded-md mr-2 ${
                    plan.status ? "bg-red-500" : "bg-green-500"
                  } hover:opacity-80 transition-opacity`}
                  onClick={() => handleUpdatePlanStatus(plan._id, plan.status)}
                >
                  {plan.status ? "Hide" : "Unhide"}
                </button>
                <button
                  className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition duration-200"
                  onClick={() => navigate(`/admin/editPlan/${plan._id}`)}
                >
                  Edit
                </button>
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default PlanList;