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
        upto: '',
        actualPrice: '',
        offerPrice: '',
        offerName: ''
    });

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setPlanDetails({
            ...planDetails,
            [e.target.name]: e.target.value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Call the addPlan mutation and pass the planDetails as the payload
            const response = await addPlan(planDetails).unwrap();
            console.log('Plan added successfully:', response);
            toast.success('Plan added successfully');

            // Reset the form
            setPlanDetails({
                planName: '',
                duration: '',
                offerPercentage: '',
                upto: '',
                actualPrice: '',
                offerPrice: '',
                offerName: ''
            });
            navigate('/admin/subscriptionPlans')

        } catch (error) {
            console.error('Failed to add plan:', error);
            toast.error('Failed to add plan. Please try again.');
        }
    };

    return (
        <div className="flex h-screen">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <Header title="Add Subscription Plan" />

                {/* Add Plan Form */}
                <div className="flex-1 p-6 bg-gray-100">
                    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                        <h1 className="text-xl font-bold mb-4 text-gray-800">Add New Subscription Plan</h1>

                        {/* Form */}
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
                                    className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600 text-white bg-gray-800"
                                    placeholder="Enter plan name"
                                    required
                                />
                            </div>

                            {/* Duration */}
                            <div className="flex flex-col">
                                <label htmlFor="duration" className="mb-1 font-semibold text-gray-700">Duration</label>
                                <input
                                    type="text"
                                    name="duration"
                                    id="duration"
                                    value={planDetails.duration}
                                    onChange={handleChange}
                                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-white bg-gray-800"
                                    placeholder="Enter duration (e.g., 1 month)"
                                    required
                                />
                            </div>

                            {/* Offer Percentage */}
                            <div className="flex flex-col">
                                <label htmlFor="offerPercentage" className="mb-1 font-semibold text-gray-700">Offer Percentage</label>
                                <input
                                    type="number"
                                    name="offerPercentage"
                                    id="offerPercentage"
                                    value={planDetails.offerPercentage}
                                    onChange={handleChange}
                                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-white bg-gray-800"
                                    placeholder="Enter offer percentage"
                                    required
                                />
                            </div>

                            {/* Up To */}
                            <div className="flex flex-col">
                                <label htmlFor="upto" className="mb-1 font-semibold text-gray-700">Up To</label>
                                <input
                                    type="number"
                                    name="upto"
                                    id="upto"
                                    value={planDetails.upto}
                                    onChange={handleChange}
                                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-white bg-gray-800"
                                    placeholder="Enter up to value (e.g., $500)"
                                    required
                                />
                            </div>

                            {/* Actual Price */}
                            <div className="flex flex-col">
                                <label htmlFor="actualPrice" className="mb-1 font-semibold text-gray-700">Actual Price</label>
                                <input
                                    type="number"
                                    name="actualPrice"
                                    id="actualPrice"
                                    value={planDetails.actualPrice}
                                    onChange={handleChange}
                                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-white bg-gray-800"
                                    placeholder="Enter actual price"
                                    required
                                />
                            </div>

                            {/* Offer Price and Offer Name */}
                            <div className="flex flex-col sm:flex-row gap-4 sm:col-span-2">
                                <div className="flex-1">
                                    <label htmlFor="offerPrice" className="mb-1 font-semibold text-gray-700">Offer Price</label>
                                    <input
                                        type="number"
                                        name="offerPrice"
                                        id="offerPrice"
                                        value={planDetails.offerPrice}
                                        onChange={handleChange}
                                        className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600 text-white bg-gray-800"
                                        placeholder="Enter offer price"
                                        required
                                    />
                                </div>

                                <div className="flex-1">
                                    <label htmlFor="offerName" className="mb-1 font-semibold text-gray-700">Offer Name</label>
                                    <input
                                        type="text"
                                        name="offerName"
                                        id="offerName"
                                        value={planDetails.offerName}
                                        onChange={handleChange}
                                        className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600 text-white bg-gray-800"
                                        placeholder="Enter offer name"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex sm:col-span-2 justify-center">
                                <button
                                    type="submit"
                                    className={`w-full sm:w-auto py-2 px-4 font-semibold rounded-md transition duration-200 ${isLoading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
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
