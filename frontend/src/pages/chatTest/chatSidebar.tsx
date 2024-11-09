import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { useGetMatchProfilesQuery } from '../../slices/apiUserSlice';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';

interface MatchProfile {
  id: string;
  name: string;
  image: string;
}

interface ChatSidebarProps {
  onProfileClick: (partnerUserId: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ onProfileClick }) => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const userId = userInfo?._id;
  const { data: matchProfiles } = useGetMatchProfilesQuery(userId);

  return (
    <div className="w-1/4 bg-gray-100 h-full p-4">
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      <div className="space-y-4">
        {matchProfiles?.map((profile: MatchProfile) => (
          <div
            key={profile.id}
            onClick={() => onProfileClick(profile.id)}
            className="flex items-center p-2 cursor-pointer hover:bg-gray-200 rounded"
          >
            <img src={profile.image} alt={profile.name} className="w-10 h-10 rounded-full" />
            <span className="ml-3 font-semibold">{profile.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;