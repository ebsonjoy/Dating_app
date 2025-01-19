
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/admin/adminNavBar';
import Header from '../../components/admin/adminHeader';
import { useAddPlanMutation } from '../../slices/adminApiSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IApiError } from '../../types/error.types';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';

const AddPlan: React.FC = () => {
    const [addPlan, { isLoading}] = useAddPlanMutation();
    const navigate = useNavigate();
    const { adminInfo } = useSelector((state: RootState) => state.adminAuth);
    const [planDetails, setPlanDetails] = useState({
        planName: '',
        duration: '',
        offerPercentage: '',
        actualPrice: '',
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

    const [modalOpen, setModalOpen] = useState(false);
    const [currentFeatures, setCurrentFeatures] = useState<string[]>(['', '', '']);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'durationValue' || name === 'durationType') {
            const durationValue = name === 'durationValue' ? value : planDetails.duration.split(' ')[0];
            const durationType = name === 'durationType' ? value : planDetails.duration.split(' ')[1];
            
            setPlanDetails(prev => ({
                ...prev,
                duration: `${durationValue} ${durationType}`.trim()
            }));
        } else {
            setPlanDetails(prev => ({
                ...prev,
                [name]: value.trim()
            }));
        }
        
        setErrors(prev => ({ ...prev, [name]: '' }));
    };
 useEffect(() => {
    if (!adminInfo) {
      navigate('/admin/login');
    }
  }, [navigate, adminInfo]);

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
        if (!planDetails.planName) newErrors.planName = 'Plan Name is required.';
        else if (!/^[A-Za-z\s]+$/.test(planDetails.planName)) newErrors.planName = 'Plan Name must contain only letters.';

        // Validate Duration
        const [durationValue, durationType] = planDetails.duration.split(' ');
        if (!durationValue) {
            newErrors.duration = 'Duration value is required.';
        } else if (isNaN(Number(durationValue)) || Number(durationValue) <= 0) {
            newErrors.duration = 'Duration value must be a positive number.';
        }

        if (!durationType) {
            newErrors.duration = 'Duration type is required.';
        }

        // Validate Offer Percentage
        if (!planDetails.offerPercentage) {
            newErrors.offerPercentage = 'Offer Percentage is required.';
        } else if (isNaN(Number(planDetails.offerPercentage)) || Number(planDetails.offerPercentage) < 1 || Number(planDetails.offerPercentage) > 100) {
            newErrors.offerPercentage = 'Offer Percentage must be a number between 1 and 100.';
        }

        // Validate Actual Price
        if (!planDetails.actualPrice) {
            newErrors.actualPrice = 'Actual Price is required.';
        } else if (isNaN(Number(planDetails.actualPrice)) || Number(planDetails.actualPrice) <= 0) {
            newErrors.actualPrice = 'Actual Price must be a positive number.';
        }

        // Validate Offer Price
        if (!planDetails.offerPrice) {
            newErrors.offerPrice = 'Offer Price is required.';
        } else if (isNaN(Number(planDetails.offerPrice)) || Number(planDetails.offerPrice) <= 0) {
            newErrors.offerPrice = 'Offer Price must be a positive number.';
        } else if (Number(planDetails.offerPrice) > Number(planDetails.actualPrice)) {
            newErrors.offerPrice = 'Offer Price must be less than or equal to Actual Price.';
        }

        // Validate Offer Name
        if (!planDetails.offerName) newErrors.offerName = 'Offer Name is required.';
        else if (!/^[A-Za-z\s]+$/.test(planDetails.offerName)) newErrors.offerName = 'Offer Name must contain only letters.';

        // Validate Features
        if (planDetails.features.length < 3) {
            newErrors.features = 'You must add at least 3 features.';
        }

        setErrors(newErrors);
        return Object.values(newErrors).every(x => x === '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateFields()) return;
        console.log('Plan added successfullyyyyyyyyyyyy:', planDetails);


        try {
            const response = await addPlan({
                ...planDetails,
                offerPercentage: Number(planDetails.offerPercentage),
                actualPrice: Number(planDetails.actualPrice),
                offerPrice: Number(planDetails.offerPrice),
            }).unwrap();
            console.log('Plan added successfully:', response);
            toast.success('Plan added successfully');

            // Reset the form
            setPlanDetails({
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
            console.error('Failed to add plan:', error);
            if(error.status === 401){
                navigate('/admin/login')
            }
            if (error?.data?.errors && Array.isArray(error.data.errors)) {
                error.data.errors.forEach((errMsg: string) => {
                    toast.error(errMsg, { autoClose: 4000 });
                });
            } else {
                toast.error('Failed to add plan. Please try again.');
            }
        }
    };

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const saveFeatures = () => {
        if (currentFeatures.filter(f => f.trim() !== '').length < 3) {
            toast.error('Please add at least 3 features.');
            return;
        }
        setPlanDetails(prev => ({ ...prev, features: currentFeatures.filter(f => f.trim() !== '') }));  
        closeModal();
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen">
            {/* Navbar */}
            <Navbar />
            <div className="flex-1 flex flex-col overflow-y-auto">
                <Header title="Add Subscription Plan" />          
                <div className="flex-1 p-6 bg-gray-100">
                    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                        <h1 className="text-xl font-bold mb-4 text-gray-800">Add New Subscription Plan</h1>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Plan Name */}
                            <div className="sm:col-span-2">
                                <label htmlFor="planName" className="mb-1 font-semibold text-gray-700">Plan Name</label>
                                <input
                                    type="text"
                                    name="planName"
                                    id="planName"
                                    value={planDetails.planName}
                                    onChange={handleChange}
                                    className={`border ${errors.planName ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-800 text-white`}
                                    placeholder="Enter plan name"
                                    required
                                />
                                {errors.planName && <p className="text-red-500 text-sm">{errors.planName}</p>}
                            </div>
    
<div className="sm:col-span-1">
    <label htmlFor="duration" className="mb-1 font-semibold text-gray-700">Duration</label>
    <div className="flex space-x-2">
        <input
            type="number"
            name="durationValue"
            id="durationValue"
            value={planDetails.duration.split(' ')[0] || ''}
            onChange={handleChange}
            className={`border ${errors.duration ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-800 text-white`}
            placeholder="Enter duration value (e.g., 3)"
            required
        />
        <select
            name="durationType"
            id="durationType"
            value={planDetails.duration.split(' ')[1] || ''}
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

    
                            {/* Offer Percentage */}
                            <div className="sm:col-span-1">
                                <label htmlFor="offerPercentage" className="mb-1 font-semibold text-gray-700">Offer Percentage</label>
                                <input
                                    type="number"
                                    name="offerPercentage"
                                    id="offerPercentage"
                                    value={planDetails.offerPercentage}
                                    onChange={handleChange}
                                    className={`border ${errors.offerPercentage ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-800 text-white`}
                                    placeholder="Enter offer percentage"
                                    required
                                />
                                {errors.offerPercentage && <p className="text-red-500 text-sm">{errors.offerPercentage}</p>}
                            </div>
    
                            {/* Actual Price */}
                            <div className="sm:col-span-1">
                                <label htmlFor="actualPrice" className="mb-1 font-semibold text-gray-700">Actual Price</label>
                                <input
                                    type="number"
                                    name="actualPrice"
                                    id="actualPrice"
                                    value={planDetails.actualPrice}
                                    onChange={handleChange}
                                    className={`border ${errors.actualPrice ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-800 text-white`}
                                    placeholder="Enter actual price"
                                    required
                                />
                                {errors.actualPrice && <p className="text-red-500 text-sm">{errors.actualPrice}</p>}
                            </div>
    
                            {/* Offer Price */}
                            <div className="sm:col-span-1">
                                <label htmlFor="offerPrice" className="mb-1 font-semibold text-gray-700">Offer Price</label>
                                <input
                                    type="number"
                                    name="offerPrice"
                                    id="offerPrice"
                                    value={planDetails.offerPrice}
                                    onChange={handleChange}
                                    className={`border ${errors.offerPrice ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-800 text-white`}
                                    placeholder="Enter offer price"
                                    required
                                />
                                {errors.offerPrice && <p className="text-red-500 text-sm">{errors.offerPrice}</p>}
                            </div>
    
                            {/* Offer Name */}
                            <div className="sm:col-span-2">
                                <label htmlFor="offerName" className="mb-1 font-semibold text-gray-700">Offer Name</label>
                                <input
                                    type="text"
                                    name="offerName"
                                    id="offerName"
                                    value={planDetails.offerName}
                                    onChange={handleChange}
                                    className={`border ${errors.offerName ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-800 text-white`}
                                    placeholder="Enter offer name"
                                    required
                                />
                                {errors.offerName && <p className="text-red-500 text-sm">{errors.offerName}</p>}
                            </div>


                            <div className="sm:col-span-2">
                                <label className="mb-1 font-semibold text-gray-700">Features</label>
                                <button
                                    type="button"
                                    onClick={openModal}
                                    className="w-full py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Add Features
                                </button>
                                {errors.features && <p className="text-red-500 text-sm">{errors.features}</p>}
                                <ul className="list-disc pl-5 mt-2 text-gray-700">
                                    {planDetails.features.map((feature, idx) => (
                                        <li key={idx}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
    
                            {/* Submit Button */}
                            <div className="sm:col-span-2">
                                <button
                                    type="submit"
                                    className={`w-full py-2 rounded-md ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Adding...' : 'Add Plan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

             {/* Modal */}
             {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
                            className="w-full py-2 mt-2 bg-gray-300 rounded-md hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}


        </div>
    );
};

export default AddPlan;
