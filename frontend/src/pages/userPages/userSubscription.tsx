import React, { useState } from 'react';
import Navbar from '../../components/user/Navbar';
import { useGetUserPlansQuery } from '../../slices/apiUserSlice';
import { useUpdateUserSubscriptionMutation } from '../../slices/apiUserSlice';
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import SkeletonLoader from '../../components/skeletonLoader';
import { Sparkles, Crown, Clock, Check } from 'lucide-react';

interface Subscription {
    _id: string; 
    planName: string;
    duration: string;
    actualPrice: number;
    offerPrice: number;
    offerName: string;
    offerPercentage: number;
    status: boolean;
}

interface paymentData {
    isPremium: boolean;
    planId: string;
    planExpiryDate: Date;
}

const SubscriptionPage: React.FC = () => {
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const userId = userInfo?._id;
    const { data: plans, error, isLoading } = useGetUserPlansQuery();
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
    const [updateUserSubscription, { isLoading: isUpdating }] = useUpdateUserSubscriptionMutation();

    // Existing functionality remains the same...
    const handleSubscriptionSelect = (subscription: Subscription) => {
        setSelectedSubscription(subscription);
    };

    const getDurationInMonths = (duration: string): number => {
        const matches = duration.match(/(\d+)\s*months?/i);
        return matches ? parseInt(matches[1], 10) : 0;
    };

    const calculateExpiryDate = (duration: string) => {
        const durationInMonths = getDurationInMonths(duration);
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + durationInMonths);
        return expiryDate.toISOString();
    };

    const handlePayment = (subscription: Subscription) => {
        if (!subscription) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof (window as any).Razorpay !== "function") {
            console.error("Razorpay SDK not loaded");
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
                console.log(response);
                
                const subscriptionData: paymentData = {
                    isPremium: true,
                    planId: subscription._id,
                    planExpiryDate: calculateExpiryDate(subscription.duration),
                    planStartingDate: new Date(),
                };
                
                const updateResult = await updateUserSubscription({
                    data: subscriptionData,
                    userId
                });

                if (updateResult.error) {
                    console.error('Failed to update user subscription:', updateResult.error);
                    setPaymentStatus("Failed to update subscription after payment.");
                } else {
                    setPaymentStatus("Payment Successful!");
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
            setPaymentStatus("Payment Failed! Please try again.");
        });
    };

    if (isLoading || isUpdating) {
        return <SkeletonLoader />;
    }

    if (error) {
        return <div>Error fetching plans: {error.message}</div>;
    }

    const subscriptions: Subscription[] = plans || [];

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
            <Navbar />
            <div className="flex-grow container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        Unlock Premium Features
                    </h1>
                    <p className="text-gray-600 text-xl max-w-2xl mx-auto">
                        Choose the perfect plan and elevate your dating experience
                    </p>
                </div>

                {paymentStatus && (
                    <div className="max-w-md mx-auto mb-8 p-4 rounded-lg bg-white shadow-lg">
                        <p className={`text-center font-semibold ${
                            paymentStatus.includes('Successful') ? 'text-green-600' : 'text-red-500'
                        }`}>
                            {paymentStatus}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {subscriptions.map((subscription) => (
                        <div
                            key={subscription._id}
                            className={`relative group cursor-pointer ${
                                selectedSubscription?._id === subscription._id 
                                    ? 'transform scale-105' 
                                    : 'hover:transform hover:scale-102'
                            }`}
                        >
                            <div className={`h-full rounded-2xl overflow-hidden transition-all duration-300 ${
                                selectedSubscription?._id === subscription._id
                                    ? 'bg-white shadow-2xl ring-4 ring-purple-500'
                                    : 'bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl'
                            }`}>
                                {/* Popular tag */}
                                {subscription.offerPercentage > 20 && (
                                    <div className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-1 rounded-full transform rotate-12 shadow-lg">
                                        <Sparkles className="inline-block w-4 h-4 mr-1" />
                                        Popular
                                    </div>
                                )}

                                <div className="p-8">
                                    {/* Header */}
                                    <div className="text-center mb-8">
                                        <Crown className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                            {subscription.planName}
                                        </h2>
                                        <p className="text-gray-500">{subscription.duration}</p>
                                    </div>

                                    {/* Pricing */}
                                    <div className="text-center mb-8">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <span className="text-gray-400 line-through text-lg">
                                                ₹{subscription.actualPrice.toFixed(2)}
                                            </span>
                                            <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                ₹{subscription.offerPrice.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                                            Save {subscription.offerPercentage}%
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center gap-2">
                                            <Check className="w-5 h-5 text-green-500" />
                                            <span className="text-gray-600">Unlimited Matches</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="w-5 h-5 text-green-500" />
                                            <span className="text-gray-600">Priority Support</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-green-500" />
                                            <span className="text-gray-600">{subscription.duration} Access</span>
                                        </div>
                                    </div>

                                    {/* Button */}
                                    <button
                                        className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
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
        </div>
    );
};

export default SubscriptionPage;