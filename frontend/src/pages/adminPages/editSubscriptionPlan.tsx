import React, { useState, useEffect } from 'react';
import Navbar from '../../components/admin/adminNavBar';
import Header from '../../components/admin/adminHeader';
import { useParams } from 'react-router-dom';
import { useGetOnePlanQuery, useUpdatePlanMutation } from '../../slices/adminApiSlice';
import { toast } from 'react-toastify'; 
import { useNavigate } from 'react-router-dom';
import { IApiError } from '../../types/error.types';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';

const EditPlan: React.FC = () => {
  const { planId } = useParams<{ planId: string }>(); 
  const navigate = useNavigate();
  const { adminInfo } = useSelector((state: RootState) => state.adminAuth);

  const { data: plan, isLoading } = useGetOnePlanQuery(planId!,{skip:!planId});

  const [updatePlan] = useUpdatePlanMutation();

  const [formData, setFormData] = useState({
    planName: '',
    duration: '',
    actualPrice: '',
    offerPercentage: '',
    offerPrice: '',
    offerName: '',
    features: [] as string[],
  });

  const [errors, setErrors] = useState({
    planName: '',
    duration: '',
    offerPercentage: '',
    actualPrice: '',
    offerPrice: '',
    offerName: '',
    features: '',
  });

    useEffect(() => {
        if (!adminInfo) {
          navigate('/admin/login');
        }
      }, [navigate, adminInfo]);

  useEffect(() => {
    if (plan) {
      setFormData({
        planName: plan.planName || '',
        duration: plan.duration || '',
        actualPrice: plan.actualPrice ? String(plan.actualPrice) : '',
        offerPercentage: plan.offerPercentage ? String(plan.offerPercentage) : '',
        offerPrice: plan.offerPrice ? String(plan.offerPrice) : '',
        offerName: plan.offerName || '',
        features: plan.features || [],
      });
      // Initialize currentFeatures with plan features
      if (plan.features && plan.features.length > 0) {
        const features = [...plan.features];
        while (features.length < 3) {
          features.push('');
        }
        setCurrentFeatures(features);
      }
    }
  }, [plan]);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentFeatures, setCurrentFeatures] = useState<string[]>(['', '', '']);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'durationValue' || name === 'durationType') {
      const durationValue = name === 'durationValue' ? value : formData.duration.split(' ')[0];
      const durationType = name === 'durationType' ? value : formData.duration.split(' ')[1];
      
      setFormData(prev => ({
        ...prev,
        duration: `${durationValue} ${durationType}`.trim()
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value.trim()
      }));
    }
    
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateFields = () => {
    const newErrors = {
      planName: '',
      duration: '',
      offerPercentage: '',
      actualPrice: '',
      offerPrice: '',
      offerName: '',
      features: '',
    };

    // Validate Plan Name
    if (!formData.planName) newErrors.planName = 'Plan Name is required.';
    else if (!/^[A-Za-z\s]+$/.test(formData.planName)) newErrors.planName = 'Plan Name must contain only letters.';

    // Validate Duration
    const [durationValue, durationType] = formData.duration.split(' ');
    if (!durationValue) {
      newErrors.duration = 'Duration value is required.';
    } else if (isNaN(Number(durationValue)) || Number(durationValue) <= 0) {
      newErrors.duration = 'Duration value must be a positive number.';
    }

    if (!durationType) {
      newErrors.duration = 'Duration type is required.';
    }

    // Validate Offer Percentage
    if (!formData.offerPercentage) {
      newErrors.offerPercentage = 'Offer Percentage is required.';
    } else if (isNaN(Number(formData.offerPercentage)) || Number(formData.offerPercentage) < 1 || Number(formData.offerPercentage) > 100) {
      newErrors.offerPercentage = 'Offer Percentage must be a number between 1 and 100.';
    }

    // Validate Actual Price
    if (!formData.actualPrice) {
      newErrors.actualPrice = 'Actual Price is required.';
    } else if (isNaN(Number(formData.actualPrice)) || Number(formData.actualPrice) <= 0) {
      newErrors.actualPrice = 'Actual Price must be a positive number.';
    }

    // Validate Offer Price
    if (!formData.offerPrice) {
      newErrors.offerPrice = 'Offer Price is required.';
    } else if (isNaN(Number(formData.offerPrice)) || Number(formData.offerPrice) <= 0) {
      newErrors.offerPrice = 'Offer Price must be a positive number.';
    } else if (Number(formData.offerPrice) > Number(formData.actualPrice)) {
      newErrors.offerPrice = 'Offer Price must be less than or equal to Actual Price.';
    }

    // Validate Offer Name
    if (!formData.offerName) newErrors.offerName = 'Offer Name is required.';
    else if (!/^[A-Za-z\s]+$/.test(formData.offerName)) newErrors.offerName = 'Offer Name must contain only letters.';

    // Validate Features
    if (formData.features.length < 3) {
      newErrors.features = 'You must add at least 3 features.';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(x => x === '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      await updatePlan({ planId: String(planId), data: {
        ...formData,
        status: true,
        actualPrice: Number(formData.actualPrice) || 0,
        offerPercentage: Number(formData.offerPercentage) || 0,
        offerPrice: Number(formData.offerPrice) || 0,
      }, }).unwrap();
      toast.success('Plan updated successfully');
      setFormData({
        planName: '',
        duration: '',
        offerPercentage: '',
        actualPrice: '',
        offerPrice: '',
        offerName: '',
        features: [],
      });
      navigate('/admin/subscriptionPlans?refresh=true');
    } catch (err: unknown) {
      const error = err as IApiError
      if(error.status){
        navigate('admin/login')
      }
      console.error('Failed to update plan:', error);
      if (error?.data?.errors && Array.isArray(error.data.errors)) {
        error.data.errors.forEach((errMsg: string) => {
          toast.error(errMsg, { autoClose: 4000 });
        });
      } else {
        toast.error('Failed to update plan. Please try again.');
      }
    }
  };

  const openModal = () => {
    // If there are no features yet, initialize with empty strings
    if (formData.features.length === 0) {
      setCurrentFeatures(['', '', '']);
    } else {
      // Use existing features, padded with empty strings if needed
      const features = [...formData.features];
      while (features.length < 3) {
        features.push('');
      }
      setCurrentFeatures(features);
    }
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const saveFeatures = () => {
    const nonEmptyFeatures = currentFeatures.filter(f => f.trim() !== '');
    if (nonEmptyFeatures.length < 3) {
      toast.error('Please add at least 3 features.');
      return;
    }
    setFormData(prev => ({ ...prev, features: nonEmptyFeatures }));
    closeModal();
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
                {errors.planName && <p className="text-red-500 text-sm mt-1">{errors.planName}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Edit Plan Duration */}
<div className="sm:col-span-1">
    <label htmlFor="duration" className="mb-1 font-semibold text-gray-700">Duration</label>
    <div className="flex space-x-2">
        <input
            type="number"
            name="durationValue"
            id="durationValue"
            value={formData.duration.split(' ')[0] || ''}
            onChange={handleChange}
            className={`border ${errors.duration ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-800 text-white`}
            placeholder="Enter duration value (e.g., 3)" 
            required
        />
        <select
            name="durationType"
            id="durationType"
            value={formData.duration.split(' ')[1] || ''}
            onChange={handleChange}
            className={`border ${errors.duration ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-800 text-white`}
        >
            <option value="">Select Duration Type</option>
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
            <option value="years">Years</option>
        </select>
    </div>
    {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
</div>


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
                  {errors.actualPrice && <p className="text-red-500 text-sm mt-1">{errors.actualPrice}</p>}
                </div>

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
                  {errors.offerPercentage && <p className="text-red-500 text-sm mt-1">{errors.offerPercentage}</p>}
                </div>

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
                  {errors.offerPrice && <p className="text-red-500 text-sm mt-1">{errors.offerPrice}</p>}
                </div>

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
                  {errors.offerName && <p className="text-red-500 text-sm mt-1">{errors.offerName}</p>}
                </div>
              </div>

              <div className="sm:col-span-2 mt-4">
                <label className="block text-white text-sm font-medium mb-2">Features</label>
                <button
                  type="button"
                  onClick={openModal}
                  className="w-full py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Add Features
                </button>
                {errors.features && <p className="text-red-500 text-sm mt-1">{errors.features}</p>}
                <ul className="list-disc pl-5 mt-2 text-white">
                  {formData.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>

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

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4">Add Features</h2>
            {currentFeatures.map((feature, idx) => (
              <div key={idx} className="mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => {
                    const updatedFeatures = [...currentFeatures];
                    updatedFeatures[idx] = e.target.value;
                    setCurrentFeatures(updatedFeatures);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder={`Feature ${idx + 1}`}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={saveFeatures}
              className="w-full py-2 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Features
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="w-full py-2 mt-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPlan;