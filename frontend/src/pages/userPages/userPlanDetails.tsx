import React, { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom"
import Navbar from "../../components/user/Navbar";
import { useGetUserPlanDetailsQuery, useCancelSubscriptionMutation, useGetUserPlanFeaturesQuery } from "../../slices/apiUserSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { toast } from 'react-toastify';
import SkeletonLoader from '../../components/skeletonLoader';
import { IFetchPlanFeatures } from '../../types/subscription.types';

const SubscriptionPage: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const userId = userInfo?._id;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  
  const { data: planFeatures } = useGetUserPlanFeaturesQuery();

  const {
    data: userPlanDetals,
    isLoading,
    error,
    refetch,
  } = useGetUserPlanDetailsQuery(userId!, { skip: !userId });

  const [cancelPlan, { isLoading: isCanceling }] = useCancelSubscriptionMutation();

  useEffect(() => {
    if (searchParams.get('refresh')) {
      refetch();
    }
  }, [searchParams, refetch]);

  // Helper function to get feature details
  const getFeatureDetails = (featureId: string): IFetchPlanFeatures | undefined => {
    return planFeatures?.find((feature: IFetchPlanFeatures) => feature._id === featureId);
  };

  // Handle Modal Operations
  const handleOpenCancelModal = () => {
    setShowCancelModal(true);
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setCancellationReason('');
  };

  // Cancellation Handler
  const handleCancelPlan = async () => {
    if (!userId) return;

    try {
      await cancelPlan(userId).unwrap(); 
      refetch();
      toast.success("Your subscription has been canceled successfully.");
      setShowCancelModal(false);
    } catch (err) {
      console.error("Failed to cancel the subscription plan:", err);
      toast.error("Failed to cancel your plan. Please try again.");
    }
  };

  // Upgrade Plan Handler
  const handleUpgradePlan = () => {
    navigate("/userSubscription"); 
  };

  // Loading and Error States
  if (isLoading) return <SkeletonLoader />;
  if (error) return <div>Failed to load subscription details.</div>;

  // Derive Plan Expiration Status
  const isPremium = userPlanDetals?.subscription.isPremium;
  const planExpiryDate = userPlanDetals?.subscription?.planExpiryDate 
    ? new Date(userPlanDetals.subscription.planExpiryDate) 
    : null;
  const isExpired = planExpiryDate && new Date() > planExpiryDate;

  // Derived Subscription Details
  const planName = userPlanDetals?.subscription?.planId?.planName || "N/A";
  const startDate = userPlanDetals?.subscription?.planStartingDate
    ? new Date(userPlanDetals.subscription.planStartingDate).toLocaleDateString()
    : "N/A";
  const endDate = userPlanDetals?.subscription?.planExpiryDate
    ? new Date(userPlanDetals.subscription.planExpiryDate).toLocaleDateString()
    : "N/A";
  const price = userPlanDetals?.subscription?.planId?.offerPrice
    ? `₹${userPlanDetals.subscription.planId.offerPrice}`
    : "N/A";
  const featureIds = userPlanDetals?.subscription?.planId?.features || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-50 flex flex-col items-center">
      {/* Navbar */}
      <div className="w-full">
        <Navbar />
      </div>

      {/* Subscription Details Section */}
      <div className="flex-grow flex justify-center items-center px-4 py-8 md:px-8 w-full">
        <div className="w-full max-w-4xl bg-white bg-opacity-90 backdrop-blur-md shadow-2xl rounded-3xl border border-purple-300 p-6 md:p-12 flex flex-col md:flex-row gap-8 transition-all duration-300 hover:shadow-3xl transform hover:scale-105">
          {/* Non-Premium User View */}
          {!isPremium  ? (
            <div className="text-center flex-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-indigo-600 animate-pulse">
                No Active Subscription
              </h2>
              <p className="text-gray-600 mt-4">
                You don't have any active subscription plan. Please subscribe to access premium features.
              </p>

              {/* Subscribe Button */}
              <div className="pt-6 md:pt-8">
                <button 
                  onClick={handleUpgradePlan} 
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full font-semibold text-lg sm:text-xl transition transform duration-200 hover:scale-105 hover:shadow-lg shadow-md hover:bg-indigo-500"
                >
                  Subscribe Now
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Left Column - Subscription Details */}
              <div className="flex-1 space-y-6 md:space-y-8 text-center md:text-left">
                <div>
                  <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${isExpired ? 'from-red-500 to-red-700' : 'from-purple-800 to-indigo-600'} animate-pulse`}>
                    {isExpired ? 'Expired Subscription' : 'Subscription Details'}
                  </h2>
                  <p className={`text-sm md:text-base ${isExpired ? 'text-red-500' : 'text-gray-500'} mt-1`}>
                    {isExpired ? 'Your subscription has ended' : 'Your plan benefits and duration'}
                  </p>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <div className={`flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 pb-2 ${isExpired ? 'line-through text-gray-400' : ''}`}>
                    <span className="text-gray-700 font-semibold">Plan:</span>
                    <span className={`${isExpired ? 'text-red-500' : 'text-purple-700'} font-extrabold text-lg`}>
                      {planName}
                    </span>
                  </div>
                  <div className={`flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 pb-2 ${isExpired ? 'line-through text-gray-400' : ''}`}>
                    <span className="text-gray-700 font-semibold">Start Date:</span>
                    <span className="text-gray-600">{startDate}</span>
                  </div>
                  <div className={`flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 pb-2 ${isExpired ? 'line-through text-gray-400' : ''}`}>
                    <span className="text-gray-700 font-semibold">End Date:</span>
                    <span className={isExpired ? 'text-red-500' : 'text-gray-600'}>{endDate}</span>
                  </div>
                  <div className={`flex flex-col sm:flex-row justify-between items-center ${isExpired ? 'line-through text-gray-400' : ''}`}>
                    <span className="text-gray-700 font-semibold">Price:</span>
                    <span className={`${isExpired ? 'text-red-500' : 'text-green-600'} font-bold text-lg sm:text-xl md:text-2xl`}>
                      {price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column - Features and Actions */}
              <div className="flex-1 space-y-6 md:space-y-8">
                <h3 className={`text-xl sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r ${isExpired ? 'from-red-500 to-red-700' : 'from-indigo-700 to-purple-500'} text-center md:text-left`}>
                  Included Features
                </h3>
                <ul className="space-y-3 md:space-y-4">
                  {featureIds.length > 0 ? (
                    featureIds.map((featureId, index) => {
                      const feature = getFeatureDetails(featureId);
                      return feature ? (
                        <li
                          key={index}
                          className={`flex items-center ${isExpired ? 'text-gray-400 line-through' : 'text-gray-700 hover:text-indigo-500'} text-base sm:text-lg transition duration-200`}
                        >
                          <FaCheckCircle className={`mr-2 sm:mr-3 transition duration-200 ${isExpired ? 'text-red-300' : 'text-purple-500 hover:text-indigo-600'}`} />
                          <span>{feature.description}</span>
                        </li>
                      ) : null;
                    })
                  ) : (
                    <li className="text-gray-500">No features available</li>
                  )}
                </ul>
                
                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4 pt-4 md:pt-8">
                  <button
                    onClick={handleUpgradePlan}
                    className="w-full md:w-auto px-5 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full font-semibold text-base sm:text-lg transition transform duration-200 hover:scale-105 hover:shadow-lg shadow-md"
                  >
                    {isExpired ? 'Renew Plan' : 'Upgrade Plan'}
                  </button>
                  <button
                    onClick={handleOpenCancelModal}
                    className={`w-full md:w-auto px-5 py-3 bg-gradient-to-r ${isExpired ? 'from-gray-500 to-gray-600' : 'from-red-500 to-red-600'} text-white rounded-full font-semibold text-base sm:text-lg transition transform duration-200 hover:scale-105 hover:shadow-lg shadow-md`}
                    disabled={!!isCanceling || !!isExpired}
                  >
                    {isCanceling ? "Canceling..." : "Cancel Plan"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Cancellation Confirmation Modal - Unchanged */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6">
            <h2 className="text-2xl font-bold text-center text-red-600">
              Cancel Subscription
            </h2>
            
            <p className="text-gray-600 text-center">
              Are you sure you want to cancel your subscription? 
              You will lose access to premium features at the end of your current billing cycle.
            </p>

            <div className="space-y-4">
              <label className="block text-gray-700 font-semibold">
                Reason for Cancellation (Optional)
              </label>
              <select 
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full text-white p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select a reason</option>
                <option value="price">Price is too high</option>
                <option value="features">Lack of features</option>
                <option value="not_using">Not using frequently</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex space-x-4">
              <button 
                onClick={handleCloseCancelModal}
                className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition"
              >
                Keep Subscription
              </button>
              <button 
                onClick={handleCancelPlan}
                className="flex-1 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
              >
                Cancel Subscription
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Your current billing cycle will complete. You'll retain access until {endDate}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;