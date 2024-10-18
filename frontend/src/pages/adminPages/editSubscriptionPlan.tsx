import React, { useState, useEffect } from 'react';
import Navbar from '../../components/admin/adminNavBar';
import Header from '../../components/admin/adminHeader';
import { useParams } from 'react-router-dom';
import { useGetOnePlanQuery, useUpdatePlanMutation } from '../../slices/adminApiSlice';
import { toast } from 'react-toastify'; 
import { useNavigate } from 'react-router-dom';

const EditPlan: React.FC = () => {
  const { planId } = useParams<{ planId: string }>(); // planId from URL params
  const navigate = useNavigate();

  // Fetch plan data using planId
  const { data: plan, isLoading } = useGetOnePlanQuery(planId);

  // Update mutation
  const [updatePlan] = useUpdatePlanMutation();

  // Form state to store the plan data
  const [formData, setFormData] = useState({
    planName: '',
    duration: '',
    actualPrice: '',
    offerPercentage: '',
    offerPrice: '',
    upto: '',
    offerName: '',
  });

  // Populate the form with plan data once it is fetched
  useEffect(() => {
    if (plan) {
      setFormData({
        planName: plan.planName || '',
        duration: plan.duration || '',
        actualPrice: plan.actualPrice || '',
        offerPercentage: plan.offerPercentage || '',
        offerPrice: plan.offerPrice || '',
        upto: plan.upto || '',
        offerName: plan.offerName || '',
      });
    }
  }, [plan]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission to update the plan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Call the updatePlan mutation with the planId and updated formData
      await updatePlan({ planId, data: formData });
      console.log('Plan updated successfully');
      toast.success('Plan updated successfully');
      navigate('/admin/subscriptionPlans')
      // Optionally, redirect or display success message

    } catch (error) {
      console.error('Error updating plan:', error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Header title="Edit Plan" />
        <div className="flex-1 p-5">
          <div className="bg-gray-800 p-8 rounded-md shadow-md">
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

                {/* Upto */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2" htmlFor="upto">
                    Upto
                  </label>
                  <input
                    type="text"
                    name="upto"
                    value={formData.upto}
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
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
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
