import React, { useState } from 'react';
import Navbar from '../../components/user/Navbar';
import { useGetUserPlansQuery } from '../../slices/apiUserSlice';
import { useUpdateUserSubscriptionMutation } from '../../slices/apiUserSlice';
import { useSelector } from "react-redux";
import { RootState } from "../../store";

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
interface paymentData{
    isPremium: boolean;
    planId:string;
    expiryDate:Date;
  }

const SubscriptionPage: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const userId = userInfo?._id;


    const { data: plans, error, isLoading } = useGetUserPlansQuery();
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
    const [updateUserSubscription, { isLoading: isUpdating }] = useUpdateUserSubscriptionMutation();

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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handler: async function (response: any) {
                console.log(response);
                
                const subscriptionData: paymentData = {
                    isPremium: true, 
                    planId: subscription._id,
                    planExpiryDate: calculateExpiryDate(subscription.duration),
                    planStartingDate: new Date(),
                };
                console.log('Sending subscription data:', subscriptionData);
                
                const updateResult = await updateUserSubscription({
                    data: subscriptionData,userId
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
            // On payment failure
            setPaymentStatus("Payment Failed! Please try again.");
        });
    };

   

    if (isLoading || isUpdating) {
        return <div>Loading...</div>; // Loading state
    }

    if (error) {
        return <div>Error fetching plans: {error.message}</div>; 
    }

    const subscriptions: Subscription[] = plans || [];

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-50 to-gray-200">
                <h1 className="text-5xl font-extrabold text-gray-800 mb-10">Choose Your Subscription</h1>
                {paymentStatus && <p className="text-red-500">{paymentStatus}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {subscriptions.map((subscription) => (
                        <div
                            key={subscription._id}
                            className={`bg-white border border-gray-300 rounded-lg shadow-xl p-6 transition-transform duration-300 transform hover:scale-105 relative overflow-hidden ${
                                selectedSubscription?._id === subscription._id ? 'ring-4 ring-green-500' : ''
                            }`}
                            onClick={() => handleSubscriptionSelect(subscription)}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-500 opacity-25 rounded-lg" />
                            <h2 className="text-3xl font-semibold text-center mb-2 relative z-10 text-gray-800">{subscription.planName}</h2>
                            <div className="text-center mb-4 relative z-10">
                                <span className="text-gray-500 line-through text-lg">₹{subscription.actualPrice.toFixed(2)}</span>
                                <span className="text-4xl font-bold text-green-600 mx-2">₹{subscription.offerPrice.toFixed(2)}</span>
                            </div>
                            <p className="text-center text-green-600 mb-4 font-semibold relative z-10">{subscription.offerName} {subscription.offerPercentage} %</p>
                            <p className="text-center text-gray-500 mb-6 relative z-10">{subscription.duration}</p>
                            <button
                                className={`mt-4 w-full py-3 text-white font-semibold rounded-lg transition duration-300 ${
                                    selectedSubscription?._id === subscription._id ? 'bg-green-600' : 'bg-black hover:bg-gray-800'
                                } relative z-10`}
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    handleSubscriptionSelect(subscription);
                                    if (selectedSubscription?._id === subscription._id) {
                                        handlePayment(subscription);
                                    }
                                }}
                            >
                                {selectedSubscription?._id === subscription._id ? 'Payment' : 'Select'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage;
