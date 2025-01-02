import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FaBriefcase, FaMapMarkerAlt, FaVenusMars, FaSearch, 
  FaGraduationCap, FaWineGlass, FaSmoking, 
  FaArrowLeft, FaArrowRight 
} from 'react-icons/fa';
import { useGetUserDetailsQuery } from '../../slices/apiUserSlice';
import SkeletonLoader from '../../components/skeletonLoader';
import Navbar from '../../components/user/Navbar';

// Typed interfaces for better type safety
interface IUserDetails {
  userId: string;
  name: string;
  age:number
  gender: string;
  lookingFor: string;
  profilePhotos: string[];
  relationship: string;
  interests: string[];
  occupation: string;
  education: string;
  bio: string;
  smoking: string;
  drinking: string;
  place: string;
}

// interface DetailItem {
//   icon?: React.ReactNode;
//   label: string;
//   value: string | undefined;
// }

// Custom Card Component
const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg ${className}`}>
      {children}
    </div>
  );
};

const UserDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [imageIndex, setImageIndex] = useState(0);

  // Extract partnerUserId from navigation state
  const userId = location.state?.partnerUserId;

  // Fetch user details using the query hook
  const { 
    data: userDetails, 
    isLoading, 
    isError 
  } = useGetUserDetailsQuery(userId, {
    skip: !userId // Skip query if no userId
  });

  // Redirect if no user ID is provided
  useEffect(() => {
    if (!userId) {
      navigate('/home');
    }
  }, [userId, navigate]);

  // Loading and error states
  if (isLoading) return <SkeletonLoader />;
  if (isError) return <div>Error loading user details</div>;
  if (!userDetails || userDetails.length === 0) {
    return <div>No user details found</div>;
  }

  // Use the first user in the array (assuming the API returns an array)
  const user = userDetails[0];

  const handleNextImage = () => {
    if (user.profilePhotos && user.profilePhotos.length > 0) {
      setImageIndex((prevIndex) =>
        prevIndex < user.profilePhotos.length - 1 ? prevIndex + 1 : 0
      );
    }
  };

  const handlePreviousImage = () => {
    if (user.profilePhotos && user.profilePhotos.length > 0) {
      setImageIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : user.profilePhotos.length - 1
      );
    }
  };

  const getUserDetailsByImageIndex = (user: IUserDetails, index: number) => {
    
    switch (index) {
      case 0:
        return {
          mainInfo: `${user.name}, ${user.age}`,
          details: [
            { 
              icon: <FaBriefcase className="text-pink-500" />, 
              label: 'Occupation', 
              value: user.occupation || 'Not specified' 
            },
            { 
              icon: <FaMapMarkerAlt className="text-pink-500" />, 
              label: 'Location', 
              value: user.place || 'Not specified' 
            },
            { 
              icon: <FaVenusMars className="text-pink-500" />, 
              label: 'Gender', 
              value: user.gender || 'Not specified' 
            },
            { 
              icon: <FaSearch className="text-pink-500" />, 
              label: 'Looking For', 
              value: user.lookingFor || 'Not specified' 
            }
          ]
        };
      case 1:
        return {
          mainInfo: 'About Me',
          details: [
            { 
              label: 'Bio', 
              value: user.bio || 'No bio provided' 
            },
            { 
              icon: <FaGraduationCap className="text-pink-500" />, 
              label: 'Education', 
              value: user.education || 'Not specified' 
            },
            { 
              label: 'Interests', 
              value: user.interests?.join(', ') || 'No interests specified' 
            }
          ]
        };
      case 2:
        return {
          mainInfo: 'Lifestyle',
          details: [
            { 
              icon: <FaWineGlass className="text-pink-500" />, 
              label: 'Drinking', 
              value: user.drinking || 'Not specified' 
            },
            { 
              icon: <FaSmoking className="text-pink-500" />, 
              label: 'Smoking', 
              value: user.smoking || 'Not specified' 
            },
            { 
              label: 'Relationship Goal', 
              value: user.relationship || 'Not specified' 
            }
          ]
        };
      default:
        return {
          mainInfo: `${user.name}'s Profile`,
          details: [
            { 
              label: 'Bio', 
              value: user.bio || 'No bio provided' 
            },
            { 
              label: 'Interests', 
              value: user.interests?.join(', ') || 'No interests specified' 
            }
          ]
        };
    }
  };

  // Get current section details
  const currentSectionDetails = getUserDetailsByImageIndex(user, imageIndex);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card className="overflow-hidden bg-white/80 backdrop-blur-sm p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image Section */}
            <div className="md:w-1/2 relative group">
              <div className="relative rounded-xl overflow-hidden shadow-xl">
                {user.profilePhotos && user.profilePhotos.length > 0 ? (
                  <>
                    <img
                      src={user.profilePhotos[imageIndex]}
                      alt={`User Profile ${imageIndex + 1}`}
                      className="w-full h-[450px] object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Navigation Buttons */}
                    {user.profilePhotos.length > 1 && (
                      <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={handlePreviousImage}
                          className="p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                        >
                          <FaArrowLeft className="text-pink-500" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                        >
                          <FaArrowRight className="text-pink-500" />
                        </button>
                      </div>
                    )}

                    {/* Image Dots */}
                    {user.profilePhotos.length > 1 && (
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                        {user.profilePhotos.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setImageIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              idx === imageIndex ? 'bg-white w-4' : 'bg-white/60'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-[450px] flex items-center justify-center bg-gray-200">
                    No Profile Photo
                  </div>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="md:w-1/2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text mb-2">
                  {currentSectionDetails.mainInfo}
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" />
              </div>

              <div className="space-y-4">
                {currentSectionDetails.details.map((detail, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start space-x-3 p-3 rounded-lg bg-white/50 hover:bg-white/80 transition-colors duration-300"
                  >
                    {detail.icon && (
                      <span className="mt-1">{detail.icon}</span>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-600">
                        {detail.label}
                      </p>
                      <p className="text-gray-800">
                        {detail.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserDetails;