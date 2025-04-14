import React, { useState } from 'react';
import Navbar from '../../components/user/Navbar';
import { Gamepad, Heart, Copy, Check } from 'lucide-react';
import TicTacToe from '../../components/games/TicTacToe';
import TwoTruthsAndALie from '../../components/games/TwoTruthsAndALie';
import { RootState } from "../../store";
import { useSelector } from 'react-redux';

interface GameCardProps {
  title: string;
  icon: React.ElementType;
  description: string;
  onClick?: () => void;
  isActive?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ title, icon: Icon, description, onClick, isActive = false }) => (
  <div 
    className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:shadow-xl ${
      isActive ? 'bg-gradient-to-br from-pink-500 via-red-500 to-orange-500' : 'bg-white'
    }`}
    onClick={onClick}
  >
    <div className={`flex flex-col gap-4 ${isActive ? 'text-white' : 'text-gray-800'}`}>
      <div className="flex items-center gap-3">
        <Icon size={24} className={isActive ? 'text-white' : 'text-pink-500'} />
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <p className={isActive ? 'text-white/90' : 'text-gray-600'}>{description}</p>
    </div>
    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full opacity-20" />
  </div>
);

const GameZonePage: React.FC = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const userId = userInfo?._id;
  
  const gameId = userId || '';

  const handleStartGame = (game: string) => {
    setActiveGame(game);
  };

  const copyIdToClipboard = () => {
    navigator.clipboard.writeText(gameId).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-8">Game Zone</h1>
        
        {!activeGame ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GameCard
              title="Tic-Tac-Toe"
              icon={Gamepad}
              description="Classic X and O game. Challenge a friend and see who wins!"
              onClick={() => handleStartGame('ticTacToe')}
            />
            <GameCard
              title="Two Truths & A Lie"
              icon={Heart}
              description="Share truths and a lie. Can your friend guess the lie?"
              onClick={() => handleStartGame('twoTruths')}
            />
            <GameCard
                  title="Coming Soon"
                  icon={Heart}
                  description="More exciting games are on the way..."
                  isActive={false}
                />
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {activeGame === 'ticTacToe' ? 'Tic-Tac-Toe' : 'Two Truths & A Lie'}
              </h2>
              <button
                onClick={() => setActiveGame(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Back to Games
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-2">Your Game ID:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={gameId}
                  readOnly
                  className="p-2 border rounded flex-grow text-white"
                />
                <button
                  onClick={copyIdToClipboard}
                  className="bg-pink-500 text-white p-2 rounded"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            {activeGame === 'ticTacToe' && <TicTacToe />}
            {activeGame === 'twoTruths' && <TwoTruthsAndALie />}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameZonePage;