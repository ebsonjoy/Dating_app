import React, { useEffect, useState,ReactNode } from 'react';
import Navbar from '../../components/user/Navbar';
import { FaHeart, FaTimes, FaArrowLeft, FaArrowRight, FaGraduationCap, FaBriefcase, FaMapMarkerAlt, FaVenusMars, FaSearch, FaWineGlass, FaSmoking } from 'react-icons/fa';
import { useGetUsersProfilesQuery,useHandleHomeLikesMutation, useGetMatchProfilesQuery } from '../../slices/apiUserSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import SkeletonLoader from '../../components/skeletonLoader';
import MatchesSection from './matchProfiles';
import { useSocketContext } from "../../context/SocketContext";
import { toast } from 'react-toastify';
import { IUserProfile } from '../../types/user.types';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg ${className}`}>
      {children}
    </div>
  );
};

const Home: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const { socket} = useSocketContext();

  const { userInfo } = useSelector((state: RootState) => state.auth);
  const userId = userInfo?._id;
  const { data: users = [], isLoading, isError } = useGetUsersProfilesQuery(userId!, {
    skip: !userId,
  });
  const [likes] = useHandleHomeLikesMutation();
  const { data: matchProfiles = [] } = useGetMatchProfilesQuery(userId!, {
    skip: !userId,
  });

  console.log('matchProfiles',matchProfiles)


  useEffect(() => {
    if (!userInfo) {
      navigate('/landing');
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      setCurrentIndex(0);
      setImageIndex(0);
    }
  }, [users]);

  if (loading || isLoading) return <SkeletonLoader />;
  if (isError) return <div>Error loading users</div>;

  const currentUser = users[currentIndex];

  const handleNextImage = () => {
    if (currentUser) {
      setImageIndex((prevImageIndex) =>
        prevImageIndex < currentUser.profilePhotos.length - 1 ? prevImageIndex + 1 : 0
      );
    }
  };

  const handlePreviousImage = () => {
    if (currentUser) {
      setImageIndex((prevImageIndex) =>
        prevImageIndex > 0 ? prevImageIndex - 1 : currentUser.profilePhotos.length - 1
      );
    }
  };

  const handleSkip = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < users.length - 1 ? prevIndex + 1 : 0
    );
    setImageIndex(0);
  };

  const handleLike = async () => {
    try {
      if (userId && currentUser?.userId) {
        const name = userInfo.name
        const res = await likes({ likerId: userId, likedUserId: currentUser.userId }).unwrap();
        console.log(res)
        if(res.match){
          socket?.emit("notifyMatch", {
            user1Id:currentUser.userId,
            user2Id:userId,
          });
        }
        socket?.emit("notifyLike", {
          name,
          likedUserId: currentUser.userId,
        });

        console.log('Liker ID:', userId);
        console.log('Liked User ID:', currentUser.userId);
        console.log(res);
        
        setCurrentIndex((prevIndex) => (prevIndex < users.length - 1 ? prevIndex + 1 : 0));
        setImageIndex(0);
      } else {
        console.error("User ID or current user is missing.");
      }
    } catch (error) {
      const err = error as { status?: number; data?: { code?: string; message?: string } };
      if (err?.status === 403 && err?.data?.code === 'SUBSCRIPTION_EXPIRED') {    
        toast.error(err?.data?.message || 'Your subscription has expired. Please subscribe.');
        navigate('/userPlanDetails'); 
    } else {
        console.error("Error while liking the user:", error);
        toast.error('An error occurred. Please try again.');
    }
    }
  };

  const getUserDetailsByImageIndex = (user: IUserProfile, index: number) => {
    switch (index) {
      case 0:
        return {
          mainInfo: `${user.name}, ${user.age}`,
          details: [
            { icon: <FaBriefcase className="text-pink-500" />, label: 'Occupation', value: user.occupation },
            { icon: <FaMapMarkerAlt className="text-pink-500" />, label: 'Location', value: user.place },
            { icon: <FaVenusMars className="text-pink-500" />, label: 'Gender', value: user.gender },
            { icon: <FaSearch className="text-pink-500" />, label: 'Looking For', value: user.lookingFor }
          ]
        };
      case 1:
        return {
          mainInfo: 'About Me',
          details: [
            { label: 'Bio', value: user.bio },
            { icon: <FaGraduationCap className="text-pink-500" />, label: 'Education', value: user.education },
            { label: 'Interests', value: user.interests.join(', ') }
          ]
        };
      case 2:
        return {
          mainInfo: 'Lifestyle',
          details: [
            { icon: <FaWineGlass className="text-pink-500" />, label: 'Drinking', value: user.drinking },
            { icon: <FaSmoking className="text-pink-500" />, label: 'Smoking', value: user.smoking },
            { label: 'Relationship Goal', value: user.relationship }
          ]
        };
      default:
        return {
          mainInfo: `${user.name}'s Profile`,
          details: [
            { label: 'Bio', value: user.bio },
            { label: 'Interests', value: user.interests.join(', ') }
          ]
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Matches Section */}
           <MatchesSection matchProfiles={matchProfiles} />
          {/* Profile Section */}
          <div className="lg:w-3/4 w-full">
            {currentUser ? (
              <div className="space-y-6">
                <Card className="overflow-hidden bg-white/80 backdrop-blur-sm p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image Section */}
                    <div className="md:w-1/2 relative group">
                      <div className="relative rounded-xl overflow-hidden shadow-xl">
                        <img
                          src={currentUser.profilePhotos[imageIndex]}
                          alt={`User Profile ${imageIndex + 1}`}
                          className="w-full h-[450px] object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Navigation Buttons */}
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

                        {/* Image Dots */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                          {currentUser.profilePhotos.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setImageIndex(idx)}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                idx === imageIndex ? 'bg-white w-4' : 'bg-white/60'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="md:w-1/2 space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text mb-2">
                          {getUserDetailsByImageIndex(currentUser, imageIndex).mainInfo}
                        </h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" />
                      </div>

                      <div className="space-y-4">
                        {getUserDetailsByImageIndex(currentUser, imageIndex).details.map((detail, idx) => (
                          <div key={idx} className="flex items-start space-x-3 p-3 rounded-lg bg-white/50 hover:bg-white/80 transition-colors duration-300">
                            {detail.icon && (
                              <span className="mt-1">{detail.icon}</span>
                            )}
                            <div>
                              <p className="text-sm font-semibold text-gray-600">
                                {detail.label}
                              </p>
                              <p className="text-gray-800">
                                {detail.value || 'Not specified'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-6">
                  <button
                    onClick={handleSkip}
                    className="p-4 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <FaTimes className="text-gray-400 text-xl" />
                  </button>
                  <button
                    onClick={handleLike}
                    className="p-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full shadow-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <FaHeart className="text-white text-xl" />
                  </button>
                  
                </div>
              </div>
            ) : (
              <Card className="text-center p-8 bg-white/80 backdrop-blur-sm">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text mb-4">
                  No Profiles Available
                </h2>
                <p className="text-gray-600">
                  Check back soon or update your preferences to find more matches.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;