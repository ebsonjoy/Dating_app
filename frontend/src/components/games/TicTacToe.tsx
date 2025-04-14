import React, { useState, useEffect } from "react";
import { useSocketContext } from "../../context/SocketContext";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate } from 'react-router-dom';

interface Player {
  p1: {
    p1id: string;
    p1name: string;
    p1value: string;
    p1move: string[];
  };
  p2: {
    p2id: string;
    p2name: string;
    p2value: string;
    p2move: string[];
  };
  sum: number;
  board: string[];
}

const TicTacToe: React.FC = () => {
  const { socket } = useSocketContext();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const userId = userInfo?._id;
  const username = userInfo?.name || userInfo?.name || "Player";
  
  const [opponentId, setOpponentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [opponent, setOpponent] = useState("");
  const [playerValue, setPlayerValue] = useState("");
  const [board, setBoard] = useState(Array(9).fill(""));
  const [currentTurn, setCurrentTurn] = useState("X");
  const [showModal, setShowModal] = useState(false);
  const [gameResult, setGameResult] = useState<{
    winner: string | null;
    reason: string;
  } | null>(null);

  const findPlayer = () => {
    if (!opponentId) {
      alert("Please enter opponent's ID");
      return;
    }
    setIsLoading(true);
    socket?.emit("findByIds", { 
      playerId: userId, 
      playerName: username,
      opponentId: opponentId 
    });
  };

  const handleCellClick = (index: number) => {
    if (board[index] || !gameStarted || currentTurn !== playerValue) return;

    socket?.emit("playing", {
      value: playerValue,
      id: `btn${index + 1}`,
      playerId: userId,
    });
  };

  const resetGame = () => {
    setGameStarted(false);
    setBoard(Array(9).fill(""));
    setCurrentTurn("X");
    setShowModal(false);
    setGameResult(null);
    socket?.emit("resetGame", { playerId: userId });
  };

  const quitGame = () => {
    resetGame();
    navigate('/'); // Redirect to the homepage
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("gameMatched", (data: { allPlayers: Player[] }) => {
      const foundObject = data.allPlayers.find(
        (obj) => obj.p1.p1id === userId || obj.p2.p2id === userId
      );

      if (foundObject) {
        const oppName =
          foundObject.p1.p1id === userId
            ? foundObject.p2.p2name
            : foundObject.p1.p1name;
        const value =
          foundObject.p1.p1id === userId
            ? foundObject.p1.p1value
            : foundObject.p2.p2value;

        setOpponent(oppName);
        setPlayerValue(value);
        setGameStarted(true);
        setIsLoading(false);
      }
    });

    socket.on("playing", (data: { allPlayers: Player[] }) => {
      const foundObject = data.allPlayers.find(
        (obj) => obj.p1.p1id === userId || obj.p2.p2id === userId
      );

      if (foundObject) {
        setBoard([...foundObject.board]);
        setCurrentTurn(foundObject.sum % 2 === 0 ? "X" : "O");
      }
    });

    socket.on("gameOver", (data: { winner: string | null; reason: string }) => {
      setGameResult(data);
      setShowModal(true);
    });

    socket.on("matchError", (data: { message: string }) => {
      alert(data.message);
      setIsLoading(false);
    });

    return () => {
      socket.off("gameMatched");
      socket.off("playing");
      socket.off("gameOver");
      socket.off("matchError");
    };
  }, [socket, userId]);

  return (
    <div className="p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Tic-Tac-Toe</h1>
      {!gameStarted ? (
        <div>
          <input
            type="text"
            placeholder="Enter opponent's ID"
            value={opponentId}
            onChange={(e) => setOpponentId(e.target.value)}
            className="p-2 border rounded mb-4 text-white"
          />
          <button
            onClick={findPlayer}
            className="bg-green-500 text-white p-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Matching..." : "Start Game"}
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <p>You: {username} ({playerValue})</p>
            <p>Opponent: {opponent}</p>
            <p>Current Turn: {currentTurn}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 w-64 mx-auto">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={cell !== "" || currentTurn !== playerValue}
                className={`h-20 text-3xl border ${
                  cell === "" ? "bg-gray-200" : "bg-gray-400"
                }`}
              >
                {cell}
              </button>
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-2xl mb-4">
              {gameResult?.reason === "win"
                ? `${gameResult?.winner} Wins!`
                : "It's a Draw!"}
            </h2>
            <button
              onClick={resetGame}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
            >
              Restart
            </button>
            <button
              onClick={quitGame}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Quit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicTacToe;