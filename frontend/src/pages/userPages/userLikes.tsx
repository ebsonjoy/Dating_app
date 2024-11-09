import React, { useState } from 'react';
import Navbar from '../../components/user/Navbar';
import { Heart, Send, UserCog, Home, Search } from 'lucide-react';
import { useGetSentLikeProfilesQuery, useGetReceivedLikeProfilesQuery } from '../../slices/apiUserSlice';
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';



const LikesPage: React.FC = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const userId = userInfo?._id;

  const { data: dummyLikesData, isLoading, error } = useGetReceivedLikeProfilesQuery(userId);
  const { data: dummySentLikesData } = useGetSentLikeProfilesQuery(userId);

  const [viewMode, setViewMode] = useState<'received' | 'sent'>('received');

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === 'received' ? 'sent' : 'received'));
  };

  const displayedData = viewMode === 'received' ? dummyLikesData : dummySentLikesData;

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load subscription details.</div>;


  const EmptyStateReceived = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6 relative inline-block">
          <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center">
            <Heart className="w-10 h-10 text-pink-500" />
          </div>
          <div className="absolute -bottom-2 -right-2">
            <UserCog className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          No Likes Yet
        </h3>
        <p className="text-gray-600 mb-6">
          You haven't received any likes yet. Complete your profile to increase your chances of getting noticed!
        </p>
        
        <button onClick={() => navigate("/profile")}
          className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-medium hover:from-pink-600 hover:to-rose-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <UserCog className="w-5 h-5" />
          Edit Your Profile
        </button>
      </div>
    </div>
  );

  const EmptyStateSent = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6 relative inline-block">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
            <Send className="w-10 h-10 text-blue-500" />
          </div>
          <div className="absolute -bottom-2 -right-2">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          No Likes Sent
        </h3>
        <p className="text-gray-600 mb-6">
          You haven't liked any profiles yet. Explore our community to find your perfect match!
        </p>
        
        <button onClick={() => navigate("/")}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <Home className="w-5 h-5" />
          Explore Profiles
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {viewMode === 'received' ? (
              <div className="flex items-center gap-2">
                <Heart className="text-pink-500" size={32} />
                <span>Who's Liked My Profile</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="text-blue-500" size={32} />
                <span>Sent Likes</span>
              </div>
            )}
          </h1>
          
          <button
            onClick={toggleViewMode}
            className="px-6 py-2.5 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            {viewMode === 'received' ? (
              <>
                <Send size={18} />
                <span>View Sent Likes</span>
              </>
            ) : (
              <>
                <Heart size={18} />
                <span>View Received Likes</span>
              </>
            )}
          </button>
        </div>

        {displayedData && displayedData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedData.map((profile: any) => (
              <div
                key={profile.id}
                className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="p-6">
                  <div className="mb-4 relative">
                    <img
                      src={profile.image[0]}
                      alt={`${profile.name}'s profile`}
                      className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 right-1/3 transform translate-x-4 translate-y-2">
                      <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{profile.name}</h2>
                    <div className="space-y-1">
                      <p className="text-gray-600">
                        <span className="font-medium">{calculateAge(profile.age)}</span> years old
                      </p>
                      <p className="text-gray-600 flex items-center justify-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        {profile.place}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-full py-2 bg-white/90 rounded-full text-gray-800 font-medium hover:bg-white transition-colors duration-200">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          viewMode === 'received' ? <EmptyStateReceived /> : <EmptyStateSent />
        )}
      </div>
    </div>
  );
};

export default LikesPage;
