import React, { useState, useEffect } from "react";
import { useSocketContext } from "../../context/SocketContext";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface Player {
  p1: {
    p1name: string;
    p1value: string;
    p1move: string[];
  };
  p2: {
    p2name: string;
    p2value: string;
    p2move: string[];
  };
  sum: number;
  board: string[];
}

const TicTacToe: React.FC = () => {
  const { socket } = useSocketContext();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [opponent, setOpponent] = useState("");
  const [playerValue, setPlayerValue] = useState("");
  const [board, setBoard] = useState(Array(9).fill(""));
  const [currentTurn, setCurrentTurn] = useState("X");

  const findPlayer = () => {
    if (!name) {
      alert("Please enter your name");
      return;
    }
    setIsLoading(true);
    socket?.emit("find", { name });
  };

  const handleCellClick = (index: number) => {
    if (board[index] || !gameStarted || currentTurn !== playerValue) return;

    socket?.emit("playing", {
      value: playerValue,
      id: `btn${index + 1}`,
      name,
    });
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("find", (data: { allPlayers: Player[] }) => {
      const foundObject = data.allPlayers.find(
        (obj) => obj.p1.p1name === name || obj.p2.p2name === name
      );

      if (foundObject) {
        const oppName =
          foundObject.p1.p1name === name
            ? foundObject.p2.p2name
            : foundObject.p1.p1name;
        const value =
          foundObject.p1.p1name === name
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
        (obj) => obj.p1.p1name === name || obj.p2.p2name === name
      );

      if (foundObject) {
        setBoard([...foundObject.board]);
        setCurrentTurn(foundObject.sum % 2 === 0 ? "X" : "O");
      }
    });

    socket.on("gameOver", (data: { winner: string | null; reason: string }) => {
      if (data.reason === "win") {
        alert(`${data.winner} wins the game!`);
      } else if (data.reason === "draw") {
        alert("The game is a draw!");
      }
      setGameStarted(false);
      setBoard(Array(9).fill(""));
      setCurrentTurn("X");
    });

    return () => {
      socket.off("find");
      socket.off("playing");
      socket.off("gameOver");
    };
  }, [socket, name]);

  return (
    <div className="p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Tic-Tac-Toe</h1>
      {!gameStarted ? (
        <div>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border rounded mb-4"
          />
          <button
            onClick={findPlayer}
            className="bg-green-500 text-white p-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Find Player"}
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <p>You: {name} ({playerValue})</p>
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
    </div>
  );
};

export default TicTacToe;
