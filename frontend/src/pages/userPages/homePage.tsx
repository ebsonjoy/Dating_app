
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/user/Navbar';
import '../style/userStyle/homePage.css';
import { FaHeart, FaTimes, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useGetUsersProfilesQuery } from '../../slices/apiUserSlice'; 
import { useSelector } from 'react-redux';
import { RootState } from '../../store'; 
import { useNavigate } from 'react-router-dom';

const PROFILE_IMAGE_DIR_PATH = 'http://localhost:5000/UserProfileImages/';
const Home: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const navigate = useNavigate();

  const { userInfo } = useSelector((state: RootState) => state.auth); 
  useEffect(() => {
    if (!userInfo) {
      navigate('/landing');
    }
  }, [navigate, userInfo]);

  const userId = userInfo?._id;
  const { data: users = [], isLoading, isError } = useGetUsersProfilesQuery(userId);

  console.log(users);

  useEffect(() => {
    if (users.length > 0) {
      setCurrentIndex(0);
      setImageIndex(0); 
    }
  }, [users]);

  if (isLoading) return <div>Loading...</div>;
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

  // Ensure to handle cases when currentUser might be undefined
  const userDetailByImageIndex = currentUser
    ? [
        { label: '', value: `${currentUser.name || 'Unknown'}, ${currentUser.age || 'N/A'}` },
        { label: 'Bio', value: currentUser.bio || 'No bio available' },
        { label: 'Occupation', value: currentUser.occupation || 'No occupation specified' },
        { label: 'Relationship Interest', value: currentUser.relationship || 'Not specified' },
      ]
    : [{ label: 'Error', value: 'No user data available.' }];

  return (
    <div className="vr-dating-home-container">
      <Navbar />
      <div className="vr-dating-home-content">
        <div className="vr-dating-matches">
          <h2>Matches</h2>
          <div className="no-matches">
            {users.length === 0 ? (
              <p>No matches found.</p>
            ) : (
              <p>Get your matches here</p>
            )}
            <span>Start discovering people to get matches.</span>
          </div>
        </div>

        <div className="vr-dating-profile-section">
         {currentUser ? ( 
            <div className="vr-dating-profile-box">
              {/* Dots at the Top */}
              <div className="vr-dating-progress-indicator-top">
                {currentUser.profilePhotos.map((_, index) => (
                  <span
                    key={index}
                    className={`vr-dating-progress-dot ${index === imageIndex ? 'active' : ''}`}
                  ></span>
                ))}
              </div>

              {/* Left Box: Profile Image */}
              <div className="vr-dating-profile-image-box">
                <img
                  src={PROFILE_IMAGE_DIR_PATH + currentUser.profilePhotos[imageIndex]}
                  alt={`User Profile ${imageIndex + 1}`}
                />
              </div>

              {/* Right Box: Profile Details */}
              <div className="vr-dating-profile-details-box">
                <h2>{userDetailByImageIndex[imageIndex].label}</h2>
                <p>{userDetailByImageIndex[imageIndex].value}</p>
              </div>

              {/* Navigation Buttons */}
              <button className="vr-dating-prev-button" onClick={handlePreviousImage}>
                <FaArrowLeft />
              </button>
              <button className="vr-dating-next-button" onClick={handleNextImage}>
                <FaArrowRight />
              </button>
            </div>



          ) : (
            <div className="vr-dating-no-profiles-box bg-gray-100 border border-gray-300 rounded-lg p-12 shadow-md text-center w-full max-w-md mx-auto h-64 flex flex-col justify-center items-center">
            <h2 className="text-2xl font-semibold text-gray-800">No available profiles</h2>
            <p className="text-gray-600 mt-2">Please wait or update your profile to find matches.</p>
          </div>
          
          )}
          {currentUser ? (
          <div className="vr-dating-skip-like-buttons">
            <button className="vr-dating-skip-button" onClick={handleSkip}>
              <FaTimes />
            </button>
            <button className="vr-dating-like-button">
              <FaHeart />
            </button> 
          </div>
          ) : (
            <div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
