// src/pages/AddPlan.tsx

import React, { useState } from 'react';
import Navbar from '../../components/admin/adminNavBar';
import Header from '../../components/admin/adminHeader';
import { useAddPlanMutation } from '../../slices/adminApiSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddPlan: React.FC = () => {
    const [addPlan, { isLoading }] = useAddPlanMutation();
    const navigate = useNavigate();

    const [planDetails, setPlanDetails] = useState({
        planName: '',
        duration: '',
        offerPercentage: '',
        actualPrice: '',
        offerPrice: '',
        offerName: ''
    });

    const [errors, setErrors] = useState({
        planName: '',
        duration: '',
        offerPercentage: '',
        actualPrice: '',
        offerPrice: '',
        offerName: ''
    });

   
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setPlanDetails({
            ...planDetails,
            [e.target.name]: e.target.value.trim(),
        });
        setErrors({ ...errors, [e.target.name]: '' }); 
    };

 
    const validateFields = () => {
        const newErrors = {
            planName: '',
            duration: '',
            offerPercentage: '',
            actualPrice: '',
            offerPrice: '',
            offerName: ''
        };

        
        if (!planDetails.planName) newErrors.planName = 'Plan Name is required.';
        else if (!/^[A-Za-z\s]+$/.test(planDetails.planName)) newErrors.planName = 'Plan Name must contain only letters.';

        if (!planDetails.duration) newErrors.duration = 'Duration is required.';

        if (!planDetails.offerPercentage) {
            newErrors.offerPercentage = 'Offer Percentage is required.';
        } else if (isNaN(Number(planDetails.offerPercentage)) || Number(planDetails.offerPercentage) < 1 || Number(planDetails.offerPercentage) > 100) {
            newErrors.offerPercentage = 'Offer Percentage must be a number between 1 and 100.';
        }

        if (!planDetails.actualPrice) {
            newErrors.actualPrice = 'Actual Price is required.';
        } else if (isNaN(Number(planDetails.actualPrice)) || Number(planDetails.actualPrice) <= 0) {
            newErrors.actualPrice = 'Actual Price must be a positive number.';
        }

        if (!planDetails.offerPrice) {
            newErrors.offerPrice = 'Offer Price is required.';
        } else if (isNaN(Number(planDetails.offerPrice)) || Number(planDetails.offerPrice) <= 0) {
            newErrors.offerPrice = 'Offer Price must be a positive number.';
        } else if (Number(planDetails.offerPrice) > Number(planDetails.actualPrice)) {
            newErrors.offerPrice = 'Offer Price must be less than or equal to Actual Price.';
        }

        if (!planDetails.offerName) newErrors.offerName = 'Offer Name is required.';
        else if (!/^[A-Za-z\s]+$/.test(planDetails.offerName)) newErrors.offerName = 'Offer Name must contain only letters.';

        setErrors(newErrors);
        return Object.values(newErrors).every(x => x === ''); 
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateFields()) return;

        try {
            const response = await addPlan(planDetails).unwrap();
            console.log('Plan added successfully:', response);
            toast.success('Plan added successfully');

            // Reset the form
            setPlanDetails({
                planName: '',
                duration: '',
                offerPercentage: '',
                actualPrice: '',
                offerPrice: '',
                offerName: ''
            });
            navigate('/admin/subscriptionPlans');

        } catch (error) {
            console.error('Failed to add plan:', error);
            toast.error('Failed to add plan. Please try again.');
        }
    };

    return (
        <div className="flex h-screen">
            {/* Navbar */}
            <Navbar />
            <div className="flex-1 flex flex-col">
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
    
                            {/* Duration */}
                            <div className="sm:col-span-1">
                                <label htmlFor="duration" className="mb-1 font-semibold text-gray-700">Duration</label>
                                <input
                                    type="text"
                                    name="duration"
                                    id="duration"
                                    value={planDetails.duration}
                                    onChange={handleChange}
                                    className={`border ${errors.duration ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-800 text-white`}
                                    placeholder="Enter duration (e.g., 1 month)"
                                    required
                                />
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
        </div>
    );
};

export default AddPlan;
