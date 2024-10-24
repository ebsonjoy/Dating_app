// import React, { useEffect, useState } from 'react';
// import Navbar from "../../components/user/Navbar";
// import { useSelector } from "react-redux";
// import { RootState } from "../../store";
// // Dummy data based on your PlanSchema

// const features= [
//     "Unlimited messaging",
//     "Profile visibility",
//     "Match suggestions based on preferences",
//     "Access to exclusive game zone",
// ]
// const planDetails = {
//     planName: "Gold Plan",
//     duration: "1 Month",
//     offerPercentage: 20,
//     actualPrice: 24.99,
//     offerPrice: 19.99,
//     offerName: "Special Discount!",
//     startDate: "October 1, 2024",
//     expirationDate: "October 31, 2024",
    
// };

// const SubscriptionPlanDetails: React.FC = () => {
//     const { userInfo } = useSelector((state: RootState) => state.auth);
//     const userId = userInfo?.id
//     const { data: plans, error, isLoading } = useGetUserPlansQuery();

//     return (
//         <div className="bg-gray-50 min-h-screen">
//             <Navbar /> {/* Include the Navbar component here */}

//             <div className="flex items-center justify-center mt-10 p-6">
//                 <div className="max-w-lg w-full bg-white rounded-lg shadow-2xl overflow-hidden">
//                     {/* Header Section */}
//                     <div className="bg-blue-500 text-white text-center p-4">
//                         <h1 className="text-4xl font-bold">{planDetails.planName}</h1>
//                         <p className="text-lg">{planDetails.offerName}</p>
//                     </div>

//                     {/* Plan Details Section */}
//                     <div className="p-6">
//                         <div className="text-center mb-4">
//                             <span className="text-2xl font-bold text-gray-700">
//                                 ${planDetails.offerPrice.toFixed(2)}
//                             </span>
//                             <span className="line-through text-red-500 ml-2">
//                                 ${planDetails.actualPrice.toFixed(2)}
//                             </span>
//                             <p className="text-md text-gray-600">Save {planDetails.offerPercentage}%</p>
//                         </div>
                        
//                         <div className="border-b border-gray-300 pb-4 mb-4">
//                             <p className="text-md"><strong>Duration:</strong> {planDetails.duration}</p>
//                             <p className="text-md"><strong>Start Date:</strong> {planDetails.startDate}</p>
//                             <p className="text-md"><strong>Expiration Date:</strong> {planDetails.expirationDate}</p>
//                         </div>

//                         {/* Features List */}
//                         <h3 className="text-lg font-semibold mb-2 text-blue-500">Features:</h3>
//                         <ul className="list-disc list-inside mb-4 text-md text-gray-800">
//                             {features.map((feature, index) => (
//                                 <li key={index} className="mb-1">{feature}</li>
//                             ))}
//                         </ul>

//                         <div className="mt-4">
//                             <h4 className="text-md font-semibold">Additional Information:</h4>
//                             <p className="text-sm text-gray-600">For any queries regarding your subscription, please visit our FAQ section or contact support.</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SubscriptionPlanDetails;
