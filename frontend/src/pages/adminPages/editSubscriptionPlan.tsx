import React, { useState, useEffect } from 'react';
import Navbar from '../../components/admin/adminNavBar';
import Header from '../../components/admin/adminHeader';
import { useParams } from 'react-router-dom';
import { useGetOnePlanQuery, useUpdatePlanMutation } from '../../slices/adminApiSlice';
import { toast } from 'react-toastify'; 
import { useNavigate } from 'react-router-dom';
// responsive
const EditPlan: React.FC = () => {
  const { planId } = useParams<{ planId: string }>(); 
  const navigate = useNavigate();

  const { data: plan, isLoading } = useGetOnePlanQuery(planId);

  const [updatePlan] = useUpdatePlanMutation();

  

  const [formData, setFormData] = useState({
    planName: '',
    duration: '',
    actualPrice: '',
    offerPercentage: '',
    offerPrice: '',
    offerName: '',
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        planName: plan.planName || '',
        duration: plan.duration || '',
        actualPrice: plan.actualPrice || '',
        offerPercentage: plan.offerPercentage || '',
        offerPrice: plan.offerPrice || '',
        offerName: plan.offerName || '',
      });
    }
  }, [plan]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updatePlan({ planId, data: formData });
      toast.success('Plan updated successfully');
      navigate('/admin/subscriptionPlans');
    } catch (error:any) {
      console.error('Failed to add plan:', error);
      if (error?.data?.errors && Array.isArray(error.data.errors)) {
        error.data.errors.forEach((errMsg: string) => {
            toast.error(errMsg, { duration: 4000 }); // Each error displays for 4 seconds
        });
    } else {
        toast.error('Failed to add plan. Please try again.');
    }
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header title="Edit Plan" />
        <div className="flex-1 p-5">
          <div className="bg-gray-800 p-6 sm:p-8 rounded-md shadow-md max-w-3xl mx-auto w-full">
            <form onSubmit={handleSubmit}>
              {/* Plan Name */}
              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-2" htmlFor="planName">
                  Plan Name
                </label>
                <input
                  type="text"
                  name="planName"
                  value={formData.planName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none"
                />
              </div>

              {/* Fields split into two columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Duration */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2" htmlFor="duration">
                    Duration (Months)
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none"
                  />
                </div>

                {/* Actual Price */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2" htmlFor="actualPrice">
                    Actual Price
                  </label>
                  <input
                    type="text"
                    name="actualPrice"
                    value={formData.actualPrice}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none"
                  />
                </div>

                {/* Offer Percentage */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2" htmlFor="offerPercentage">
                    Offer Percentage
                  </label>
                  <input
                    type="text"
                    name="offerPercentage"
                    value={formData.offerPercentage}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none"
                  />
                </div>

                {/* Offer Price */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2" htmlFor="offerPrice">
                    Offer Price
                  </label>
                  <input
                    type="text"
                    name="offerPrice"
                    value={formData.offerPrice}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none"
                  />
                </div>

                {/* Offer Name */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2" htmlFor="offerName">
                    Offer Name
                  </label>
                  <input
                    type="text"
                    name="offerName"
                    value={formData.offerName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6 text-right">
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
                >
                  Update Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPlan;
