import React, { useState } from 'react';
import Navbar from '../../components/user/Navbar'; 
import { Gamepad } from 'lucide-react'; 
import TicTacToe from '../../components/games/TicTacToe';

const GameZonePage: React.FC = () => {

  const [isGameStarted, setIsGameStarted] = useState(false);

  const handleStartGame = () => {
    setIsGameStarted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            <div className="flex items-center gap-2">
              <Gamepad className="text-blue-500" size={32} />
              <span>Game Zone</span>
            </div>
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {!isGameStarted ? (
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Tic Tac Toe</h2>
              <p className="text-gray-600 mb-4">Click the button below to start playing Tic Tac Toe!</p>
              <button
                onClick={handleStartGame}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
              >
                Start Game
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <TicTacToe />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameZonePage;
