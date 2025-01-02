import React, { useState } from 'react';
import Navbar from '../../components/user/Navbar';
import { Gamepad, Heart } from 'lucide-react';
import TicTacToe from '../../components/games/TicTacToe';
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

// ✅ Main GameZonePage Component
const GameZonePage: React.FC = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const userId = userInfo?._id;
  const shortGameId = userId?.slice(-6);

  const handleStartGame = () => {
    setIsGameStarted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-50">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                <Gamepad className="text-pink-500" size={40} />
                <span>Game Zone</span>
              </h1>
              <p className="mt-2 text-gray-600">Play games, make connections, find love!</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
              <p className="text-gray-700">
                Game ID: <span className="font-mono font-bold text-pink-600">{shortGameId || '...'}</span>
              </p>
            </div>
          </div>

          {/* Game Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {!isGameStarted ? (
              <>
                <GameCard
                  title="Tic Tac Toe"
                  icon={Gamepad}
                  description="Challenge your match to a classic game of Tic Tac Toe!"
                  onClick={handleStartGame}
                />
                <GameCard
                  title="Coming Soon"
                  icon={Heart}
                  description="More exciting games are on the way..."
                  isActive={false}
                />
              </>
            ) : (
              <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm">
                <TicTacToe />
                <button
                  onClick={() => setIsGameStarted(false)}
                  className="mt-6 px-6 py-2 text-pink-500 border border-pink-500 rounded-full hover:bg-pink-50 transition-colors"
                >
                  Back to Games
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameZonePage;
