import { AlertCircle, PackageOpen, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IApiError } from '../../types/error.types';

interface ErrorDisplayProps {
    error: IApiError
  }

const ErrorDisplay = ({ error }:ErrorDisplayProps) => {
  const navigate = useNavigate();
  const isFeatureRestricted = error?.status === 403 && error?.data?.code === 'FEATURE_NOT_INCLUDED';
  const isSubscriptionExpired = error?.status === 403 && error?.data?.code === 'SUBSCRIPTION_EXPIRED';

  if (isFeatureRestricted || isSubscriptionExpired) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
              <PackageOpen className="w-10 h-10 text-amber-500" />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            {isFeatureRestricted ? 'Feature Not Available' : 'Subscription Expired'}
          </h3>
          
          <p className="text-gray-600 mb-6">
            {error?.data?.message || 'Please upgrade your plan to access this feature'}
          </p>
          
          <button 
            onClick={() => navigate('/userPlanDetails')}
            className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center gap-2"
          >
            View Plans
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full mt-3 px-6 py-3 border border-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Generic error display
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          Something Went Wrong
        </h3>
        
        <p className="text-gray-600 mb-6">
          {error?.data?.message || 'Failed to load like details. Please try again later.'}
        </p>
        
        <button 
          onClick={() => window.location.reload()}
          className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-full font-medium hover:from-red-600 hover:to-rose-600 transition-all duration-300 flex items-center justify-center gap-2"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;