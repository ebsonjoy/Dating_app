
import { useNavigate } from 'react-router-dom';
import { IMatchProfile } from "../../types/like.types";


// Props for MatchCard
interface MatchCardProps {
  match: IMatchProfile;
  onClick: () => void;
}

// Props for MatchesSection
interface MatchesSectionProps {
  matchProfiles: IMatchProfile[];
}

const MatchCard: React.FC<MatchCardProps>  = ({ match, onClick }) => {
  // Calculate age from birthdate
  const calculateAge = (birthDate: string | number | Date) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div 
      onClick={onClick}
      className="flex items-center p-3 rounded-lg hover:bg-pink-50 transition-all cursor-pointer"
    >
      <img 
        src={match.image[0]} 
        alt={match.name} 
        className="w-12 h-12 rounded-full object-cover border-2 border-pink-500"
      />
      <div className="ml-3">
        <h3 className="font-semibold text-gray-800">{match.name}</h3>
        <p className="text-sm text-gray-600">{calculateAge(match.age)} years • {match.place}</p>
      </div>
    </div>
  );
};

// Update the Card component in the matches section
const MatchesSection: React.FC<MatchesSectionProps> = ({ matchProfiles = [] }) => {
  const navigate = useNavigate();

  const handleMatchClick = (partnerUserId: string) => {
    navigate("/userDetails", { state: { partnerUserId } });
  }

  return (
    <div className="lg:w-1/4 w-full bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
        Your Matches
      </h2>
      
      <div className="mt-4">
        {matchProfiles.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600">No matches yet</p>
            <div className="mt-4">
              <p className="text-gray-700 font-medium">Keep Exploring!</p>
              <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full mt-2"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {matchProfiles.map((match, index) => (
              <MatchCard
                key={index}
                match={match}
                onClick={() => handleMatchClick(match.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchesSection;