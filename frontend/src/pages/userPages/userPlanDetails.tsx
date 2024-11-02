import React from 'react';
import { FaCheckCircle } from 'react-icons/fa'; 
import Navbar from '../../components/user/Navbar'; 
import { useGetUserPlanDetailsQuery } from '../../slices/apiUserSlice';
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const SubscriptionPage: React.FC = () => {
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const userId = userInfo?._id;

  const { data: userPlanDetals, isLoading,error } = useGetUserPlanDetailsQuery(userId);
  console.log(userPlanDetals)
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load subscription details.</div>;
  const isPremium = userPlanDetals?.subscription.isPremium;
  const planName = userPlanDetals?.subscription?.planId?.planName || "N/A";
  const startDate = userPlanDetals?.subscription?.planStartingDate ? new Date(userPlanDetals.subscription.planStartingDate).toLocaleDateString() : "N/A";
  const endDate = userPlanDetals?.subscription?.planExpiryDate ? new Date(userPlanDetals.subscription.planExpiryDate).toLocaleDateString() : "N/A";
  const price = userPlanDetals?.subscription?.planId?.offerPrice ? `$${userPlanDetals.subscription.planId.offerPrice}` : "N/A";

  const features = [
    "Unlimited Matches",
    "Priority Messaging",
    "Exclusive Offers",
    "Location-Based Matching",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-purple-100 to-pink-100 flex flex-col items-center">
      
      {/* Full-Width Navbar */}
      <div className="w-full">
        <Navbar />
      </div>

      {/* Subscription Details Section */}
      <div className="flex-grow flex justify-center items-center px-4 py-8 md:px-8 w-full">
        <div className="w-full max-w-4xl bg-white bg-opacity-90 backdrop-blur-md shadow-2xl rounded-3xl border border-purple-300 p-6 md:p-12 flex flex-col md:flex-row gap-8 transition-all duration-300 hover:shadow-3xl transform hover:scale-105">
          
           {/* Display for Non-Premium Users */}
           {!isPremium ? (
            <div className="text-center flex-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-indigo-600 animate-pulse">
                No Active Subscription
              </h2>
              <p className="text-gray-600 mt-4">You don’t have any active subscription plan. Please subscribe to access premium features.</p>
              
              {/* Subscribe Button */}
              <div className="pt-6 md:pt-8">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full font-semibold text-lg sm:text-xl transition transform duration-200 hover:scale-105 hover:shadow-lg shadow-md hover:bg-indigo-500">
                  Subscribe Now
                </button>
              </div>
            </div>
          ) : (
            <>
          {/* Left Column */}
          <div className="flex-1 space-y-6 md:space-y-8 text-center md:text-left">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-indigo-600 animate-pulse">
                Subscription Details
              </h2>
              <p className="text-sm md:text-base text-gray-500 mt-1">Your plan benefits and duration</p>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-700 font-semibold">Plan:</span>
                <span className="text-purple-700 font-extrabold text-lg">{planName}</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-700 font-semibold">Start Date:</span>
                <span className="text-gray-600">{startDate}</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-700 font-semibold">End Date:</span>
                <span className="text-gray-600">{endDate}</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <span className="text-gray-700 font-semibold">Price:</span>
                <span className="text-green-600 font-bold text-lg sm:text-xl md:text-2xl">{price}</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 space-y-6 md:space-y-8">
            <h3 className="text-xl sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-500 text-center md:text-left">
              Included Features
            </h3>
            <ul className="space-y-3 md:space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-700 text-base sm:text-lg hover:text-indigo-500 transition duration-200">
                  <FaCheckCircle className="text-purple-500 mr-2 sm:mr-3 hover:text-indigo-600 transition duration-200" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Upgrade Button */}
            <div className="text-center pt-6 md:pt-8">
              <button className="w-full md:w-3/4 px-5 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full font-semibold text-base sm:text-lg transition transform duration-200 hover:scale-105 hover:shadow-lg shadow-md hover:bg-indigo-500">
                Upgrade Plan
              </button>
            </div>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
