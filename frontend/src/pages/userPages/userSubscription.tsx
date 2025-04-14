/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Navbar from '../../components/user/Navbar';
import { useGetUserPlansQuery } from '../../slices/apiUserSlice';
import { useUpdateUserSubscriptionMutation, useGetUserPlanFeaturesQuery } from '../../slices/apiUserSlice';
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import SkeletonLoader from '../../components/skeletonLoader';
import { Sparkles, Crown, Check, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { IFetchPlanFeatures } from '../../types/subscription.types';

interface Subscription {
    _id: string; 
    planName: string;
    duration: string;
    actualPrice: number;
    offerPrice: number;
    offerName: string;
    offerPercentage: number;
    status: boolean;
    features: string[]
}

interface paymentData {
    isPremium: boolean;
    planId: string;
    planExpiryDate: Date;
    planStartingDate: Date;
}

const SubscriptionPage: React.FC = () => {
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const userId = userInfo?._id;
    const { data: plans, error, isLoading } = useGetUserPlansQuery(userId!, {skip: !userId});
    const { data: planFeatures } = useGetUserPlanFeaturesQuery();
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
    const [updateUserSubscription, { isLoading: isUpdating }] = useUpdateUserSubscriptionMutation();
    const navigate = useNavigate();
    
    // State for feature popup
    const [showFeaturesPopup, setShowFeaturesPopup] = useState(false);
    const [currentPlanFeatures, setCurrentPlanFeatures] = useState<{id: string, description: string}[]>([]);
    const [currentPlanName, setCurrentPlanName] = useState('');

    const getFeatureDetails = (featureId: string): IFetchPlanFeatures | undefined => {
        return planFeatures?.find((feature: IFetchPlanFeatures) => feature._id === featureId);
    };

    const handleSubscriptionSelect = (subscription: Subscription) => {
        setSelectedSubscription(subscription);
    };

    const showAllFeatures = (e: React.MouseEvent, subscription: Subscription) => {
        e.stopPropagation()
        
        // Prepare all features for this plan
        const allFeatures = subscription.features.map(featureId => {
            const feature = getFeatureDetails(featureId);
            return { 
                id: featureId, 
                description: feature?.description || 'Feature not available' 
            };
        });
        
        setCurrentPlanFeatures(allFeatures);
        setCurrentPlanName(subscription.planName);
        setShowFeaturesPopup(true);
    };

    const closePopup = () => {
        setShowFeaturesPopup(false);
    };

    const getDurationInDays = (duration: string): number => {
        const dayMatches = duration.match(/(\d+)\s*days?/i);
        const weekMatches = duration.match(/(\d+)\s*weeks?/i);
        const monthMatches = duration.match(/(\d+)\s*months?/i);
        const yearMatches = duration.match(/(\d+)\s*years?/i);
    
        if (dayMatches) return parseInt(dayMatches[1], 10);
        if (weekMatches) return parseInt(weekMatches[1], 10) * 7;
        if (monthMatches) return parseInt(monthMatches[1], 10) * 30;
        if (yearMatches) return parseInt(yearMatches[1], 10) * 365;
    
        return 0;
    };
    
    const calculateExpiryDate = (duration: string): Date => {
        const durationInDays = getDurationInDays(duration);
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + durationInDays);
        return expiryDate;
    };

    const handlePayment = (subscription: Subscription) => {
        if (!subscription) return;
        if (typeof (window as any).Razorpay !== "function") {
            setPaymentStatus("Payment gateway is not available. Please try again later.");
            return;
        }
        const options = {
            key: "rzp_test_ngn67c7xYOEohE",
            amount: subscription.offerPrice * 100,
            currency: "INR",
            name: "Dating",
            description: subscription.planName,
            image: "https://yourapp.com/logo.png",
            handler: async function (response: any) {
                console.log(response)
                const subscriptionData: paymentData = {
                    isPremium: true,
                    planId: subscription._id,
                    planExpiryDate: calculateExpiryDate(subscription.duration),
                    planStartingDate: new Date(),
                };
                
                const updateResult = await updateUserSubscription({
                    data: subscriptionData,
                    userId: userId || ''
                });
                
                if (updateResult.error) {
                    console.error('Failed to update user subscription:', updateResult.error);
                    setPaymentStatus("Failed to update subscription after payment.");
                } else {
                    toast.success("Payment Successful!");
                    setPaymentStatus("Payment Successful!");
                    navigate('/');
                }
            },
            prefill: {
                name: userInfo?.name,
                email: userInfo?.email,
                contact: "9999999999",
            },
            theme: {
                color: "#F37254"
            }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        rzp.on('payment.failed', function (response: any) {
            console.log(response)
            setPaymentStatus("Payment Failed! Please try again.");
        });
    };

    if (isLoading || isUpdating) {
        return <SkeletonLoader />;
    }

    if (error) {
        return <div>Error fetching plans</div>;
    }

    const subscriptions: Subscription[] = plans || [];

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-rose-50 to-pink-50">
            <Navbar />
            <div className="flex-grow container mx-auto px-4 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                        Unlock Premium Features
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Choose the perfect plan and elevate your dating experience
                    </p>
                </div>

                {paymentStatus && (
                    <div className="max-w-md mx-auto mb-6 p-3 rounded-lg bg-white shadow-lg">
                        <p className={`text-center font-semibold ${
                            paymentStatus.includes('Successful') ? 'text-green-600' : 'text-red-500'
                        }`}>
                            {paymentStatus}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {subscriptions.map((subscription) => (
                        <div
                            key={subscription._id}
                            className={`relative group cursor-pointer ${
                                selectedSubscription?._id === subscription._id 
                                    ? 'transform scale-105' 
                                    : 'hover:transform hover:scale-102'
                            }`}
                            onClick={() => handleSubscriptionSelect(subscription)}
                        >
                            <div className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                                selectedSubscription?._id === subscription._id
                                    ? 'bg-white shadow-2xl ring-4 ring-purple-500'
                                    : 'bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl'
                            }`}>
                                {/* Popular tag */}
                                {subscription.offerPercentage > 20 && (
                                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-1 rounded-full transform rotate-12 shadow-lg">
                                        <Sparkles className="inline-block w-4 h-4 mr-1" />
                                        Popular
                                    </div>
                                )}

                                <div className="p-6 flex flex-col">
                                    <div className="text-center mb-4">
                                        <Crown className="w-10 h-10 mx-auto mb-3 text-purple-500" />
                                        <h2 className="text-xl font-bold text-gray-800 mb-1">
                                            {subscription.planName}
                                        </h2>
                                        <p className="text-gray-500 text-sm">{subscription.duration}</p>
                                    </div>

                                    {/* Pricing */}
                                    <div className="text-center mb-4">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                            <span className="text-gray-400 line-through text-lg">
                                                ₹{subscription.actualPrice.toFixed(2)}
                                            </span>
                                            <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                ₹{subscription.offerPrice.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                                            Save {subscription.offerPercentage}%
                                        </div>
                                    </div>

                                    {/* Features with "more" button */}
                                    <div className="mb-2">
                                        {subscription.features.slice(0, 2).map((featureId, index) => {
                                            const feature = getFeatureDetails(featureId);
                                            return feature ? (
                                                <div key={index} className="flex items-center gap-2 mb-2">
                                                    <Check className="w-5 h-5 flex-shrink-0 text-green-500" />
                                                    <span className="text-gray-600 text-sm">{feature.description}</span>
                                                </div>
                                            ) : null;
                                        })}
                                        
                                        {subscription.features.length > 2 && (
                                            <button 
                                                onClick={(e) => showAllFeatures(e, subscription)}
                                                className="flex items-center justify-center gap-1 w-full py-1 mt-2 text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors duration-200"
                                            >
                                                + {subscription.features.length - 2} more features
                                            </button>
                                        )}
                                    </div>

                                    {/* Button */}
                                    <button
                                        className={`w-full py-3 mt-2 rounded-xl font-semibold transition-all duration-300 ${
                                            selectedSubscription?._id === subscription._id
                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl'
                                                : 'bg-gray-900 text-white hover:bg-gray-800'
                                        }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSubscriptionSelect(subscription);
                                            if (selectedSubscription?._id === subscription._id) {
                                                handlePayment(subscription);
                                            }
                                        }}
                                    >
                                        {selectedSubscription?._id === subscription._id ? 'Proceed to Payment' : 'Select Plan'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features Popup Modal */}
            {showFeaturesPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" onClick={closePopup}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">
                                    {currentPlanName} Features
                                </h3>
                                <button 
                                    onClick={closePopup}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="space-y-3">
                                {currentPlanFeatures.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <Check className="w-5 h-5 flex-shrink-0 text-green-500 mt-0.5" />
                                        <span className="text-gray-600">{feature.description}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <button
                                onClick={closePopup}
                                className="w-full py-3 mt-6 rounded-xl font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionPage;