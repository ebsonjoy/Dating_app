import React, { useEffect, useState } from 'react';
import Navbar from '../../components/admin/adminNavBar';
import Header from '../../components/admin/adminHeader';
import { useAddPlanMutation, useFetchPlanFeaturesQuery } from '../../slices/adminApiSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IApiError } from '../../types/error.types';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { FaPlus, FaTimes } from "react-icons/fa";
import { IFetchPlanFeatures } from '../../types/subscription.types';

type PlanDetailFields = keyof IPlanDetails;
interface IPlanDetails {
    planName: string;
    duration: string;
    offerPercentage: string;
    actualPrice: string;
    offerPrice: string;
    offerName: string;
    features: string[];
}
const AddPlan: React.FC = () => {
    const [addPlan, { isLoading }] = useAddPlanMutation();
    const { data: planFeatures } = useFetchPlanFeaturesQuery();
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

    // Feature selection state
    const [selectedFeatures, setSelectedFeatures] = useState<IFetchPlanFeatures[]>([]);
    const [showOptions, setShowOptions] = useState<boolean[]>([]);

    useEffect(() => {
        if (!adminInfo) {
            navigate('/admin/login');
        }
    }, [navigate, adminInfo]);

    const addFeature = () => {
        setShowOptions([...showOptions, true]);
    };

    const selectFeature = (feature: IFetchPlanFeatures, index: number) => {
        if (!selectedFeatures.some((f) => f._id === feature._id)) {
            const updatedSelected = [...selectedFeatures, feature];
            setSelectedFeatures(updatedSelected);
            setPlanDetails(prev => ({
                ...prev,
                features: updatedSelected.map(f => f._id)
            }));

            const updatedShowOptions = [...showOptions];
            updatedShowOptions[index] = false;
            setShowOptions(updatedShowOptions);
        }
    };

    const removeFeature = (index: number) => {
        const updatedSelected = selectedFeatures.filter((_, i) => i !== index);
        setSelectedFeatures(updatedSelected);
        setPlanDetails(prev => ({
            ...prev,
            features: updatedSelected.map(f => f._id)
        }));
        
        setShowOptions(showOptions.slice(0, -1));
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'durationValue' || name === 'durationType') {
            const durationValue = name === 'durationValue' ? value : planDetails.duration.split(' ')[0];
            const durationType = name === 'durationType' ? value : planDetails.duration.split(' ')[1];
            
            setPlanDetails(prev => ({
                ...prev,
                duration: `${durationValue} ${durationType}`.trim()
            }));
            return;
        }
        const isValidField = (fieldName: string): fieldName is PlanDetailFields => {
            return [
                'planName',
                'duration',
                'offerPercentage',
                'actualPrice',
                'offerPrice',
                'offerName',
                'features'
            ].includes(fieldName);
        };
    
        if (!isValidField(name)) {
            return;
        }
    
        setPlanDetails(prev => ({
            ...prev,
            [name]: value.trim()
        }));
    
        if (name === 'actualPrice' || name === 'offerPercentage') {
            const actualPrice = name === 'actualPrice' ? Number(value) : Number(planDetails.actualPrice);
            const offerPercentage = name === 'offerPercentage' ? Number(value) : Number(planDetails.offerPercentage);
    
            if (!isNaN(actualPrice) && !isNaN(offerPercentage)) {
                const discount = (actualPrice * offerPercentage) / 100;
                const calculatedOfferPrice = actualPrice - discount;
                setPlanDetails(prev => ({
                    ...prev,
                    offerPrice: calculatedOfferPrice.toFixed(2)
                }));
            }
        }
        
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    //     const { name, value } = e.target;
        
    //     if (name === 'durationValue' || name === 'durationType') {
    //         const durationValue = name === 'durationValue' ? value : planDetails.duration.split(' ')[0];
    //         const durationType = name === 'durationType' ? value : planDetails.duration.split(' ')[1];
            
    //         setPlanDetails(prev => ({
    //             ...prev,
    //             duration: `${durationValue} ${durationType}`.trim()
    //         }));
    //     } else {
    //         setPlanDetails(prev => ({
    //             ...prev,
    //             [name]: value.trim()
    //         }));
    //     }
        
    //     setErrors(prev => ({ ...prev, [name]: '' }));
    // };

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
        if (!planDetails.planName) {
            newErrors.planName = 'Plan Name is required.';
        } else if (!/^[A-Za-z\s]+$/.test(planDetails.planName)) {
            newErrors.planName = 'Plan Name must contain only letters.';
        }

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
        if (!planDetails.offerName) {
            newErrors.offerName = 'Offer Name is required.';
        } else if (!/^[A-Za-z\s]+$/.test(planDetails.offerName)) {
            newErrors.offerName = 'Offer Name must contain only letters.';
        }

        // Validate Features
        if (selectedFeatures.length < 1) {
            newErrors.features = 'You must add at least 3 features.';
        }

        setErrors(newErrors);
        return Object.values(newErrors).every(x => x === '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateFields()) return;

        try {
            await addPlan({
                ...planDetails,
                offerPercentage: Number(planDetails.offerPercentage),
                actualPrice: Number(planDetails.actualPrice),
                offerPrice: Number(planDetails.offerPrice),
                features: selectedFeatures.map(feature => feature._id)
            }).unwrap();
            
            toast.success('Plan added successfully');
            navigate('/admin/subscriptionPlans?refresh=true');

        } catch (err: unknown) {
            const error = err as IApiError;
            if(error.status === 401) {
                navigate('/admin/login');
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

    return (
        <div className="flex flex-col lg:flex-row h-screen">
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
                                />
                                {errors.planName && <p className="text-red-500 text-sm">{errors.planName}</p>}
                            </div>

                            {/* Duration */}
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
                                        placeholder="Enter duration value"
                                    />
                                    <select
                                        name="durationType"
                                        id="durationType"
                                        value={planDetails.duration.split(' ')[1] || ''}
                                        onChange={handleChange}
                                        className={`border ${errors.duration ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-800 text-white`}
                                    >
                                        <option value="">Select Type</option>
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
                                    readOnly
                                    className={`border ${errors.offerPrice ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-800 text-white`}
                                    placeholder="Enter offer price"
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
                                />
                                {errors.offerName && <p className="text-red-500 text-sm">{errors.offerName}</p>}
                            </div>

                            {/* Features Section */}
                            <div className="sm:col-span-2 p-4 border rounded-lg">
                            <h2 className="text-xl font-semibold mb-2">Add Features</h2>
                                
                                {selectedFeatures.map((feature, index) => (
                                    <div key={feature._id} className="flex items-center gap-2 mb-2">
                                        <span className="text-gray-700">{feature.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ))}

                                {showOptions.map((isVisible, index) => 
                                    isVisible && (
                                        <div key={index} className="relative mb-2">
                                            <select
                                                onChange={(e) => {
                                                    const selected = planFeatures?.find(
                                                        (feature) => feature.code === e.target.value
                                                    );
                                                    if (selected) selectFeature(selected, index);
                                                }}
                                                className="border p-2 w-full rounded-md bg-gray-800 text-white"
                                            >
                                                <option value="">Select a feature</option>
                                                {planFeatures?.filter(
                                                    (f) => !selectedFeatures.some((s) => s._id === f._id)
                                                ).map((feature) => (
                                                    <option key={feature._id} value={feature.code}>
                                                        {feature.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )
                                )}

                                <button
                                    type="button"
                                    onClick={addFeature}
                                    className="flex items-center gap-1 text-blue-500 hover:text-blue-700 mt-2"
                                >
                                    <FaPlus />
                                    Add Feature
                                </button>
                                {errors.features && (
                                    <p className="text-red-500 text-sm mt-1">{errors.features}</p>
                                )}
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