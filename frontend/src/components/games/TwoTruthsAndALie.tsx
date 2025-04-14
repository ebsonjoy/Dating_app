import React, { useState, useEffect } from "react";
import { useSocketContext } from "../../context/SocketContext";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate } from 'react-router-dom';
import { Lightbulb, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from "react-toastify";

interface TwoTruthsGame {
  player1: {
    id: string;
    name: string;
    statements: string[];
    lieIndex: number | null;
  };
  player2: {
    id: string;
    name: string;
    statements: string[];
    lieIndex: number | null;
  };
  currentTurn: string;
  gameState: 'waiting' | 'statements_submitted' | 'guessing' | 'completed';
  round: number;
  scores: {
    [playerId: string]: number;
  };
}

const TwoTruthsAndALie: React.FC = () => {
  const { socket } = useSocketContext();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const userId = userInfo?._id;
  const username = userInfo?.name || "Player";

  const [opponentId, setOpponentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [opponent, setOpponent] = useState("");
  const [statements, setStatements] = useState(["", "", ""]);
  const [lieIndex, setLieIndex] = useState<number | null>(null);
  const [guessIndex, setGuessIndex] = useState<number | null>(null);
  const [opponentStatements, setOpponentStatements] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'waiting' | 'statements_submitted' | 'guessing' | 'completed'>('waiting');
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [round, setRound] = useState(1);
  const [scores, setScores] = useState<{[key: string]: number}>({});
  const [guessResult, setGuessResult] = useState<{
    isCorrect: boolean;
    lieIndex: number;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [gameResult, setGameResult] = useState<{
    winner: string | null;
    reason: string;
  } | null>(null);

  const findPlayer = () => {
    if (!opponentId) {
        toast.error("Please enter opponent's ID");
      return;
    }
    setIsLoading(true);
    socket?.emit("findByIds", { 
      playerId: userId, 
      playerName: username,
      opponentId: opponentId,
      gameType: "twoTruths" 
    });
  };

  const handleStatementChange = (index: number, value: string) => {
    const newStatements = [...statements];
    newStatements[index] = value;
    setStatements(newStatements);
  };

  const selectLie = (index: number) => {
    setLieIndex(index);
  };

  const submitStatements = () => {
    if (statements.some(s => !s) || lieIndex === null) {
        toast.error("Please fill in all statements and select which one is the lie");
      return;
    }

    socket?.emit("submitStatements", {
      playerId: userId,
      statements,
      lieIndex
    });
  };

  if (!userId) {
    navigate('/')
    throw new Error("User ID is undefined")
  }

  const makeGuess = (index: number) => {
    setGuessIndex(index);
    
    socket?.emit("makeGuess", {
      playerId: userId,
      guessIndex: index
    });
  };

  const resetGame = () => {
    setGameStarted(false);
    setStatements(["", "", ""]);
    setLieIndex(null);
    setGuessIndex(null);
    setOpponentStatements([]);
    setGameState('waiting');
    setIsMyTurn(false);
    setRound(1);
    setScores({});
    setGuessResult(null);
    setShowModal(false);
    setGameResult(null);
    socket?.emit("resetTwoTruthsGame", { playerId: userId });
  };

  const quitGame = () => {
    resetGame();
    navigate('/gamezone');
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("twoTruthsGameMatched", (data: { allGames: TwoTruthsGame[] }) => {
      const foundGame = data.allGames.find(
        (game) => game.player1.id === userId || game.player2.id === userId
      );

      if (foundGame) {
        // const oppId = foundGame.player1.id === userId ? foundGame.player2.id : foundGame.player1.id;
        const oppName = foundGame.player1.id === userId ? foundGame.player2.name : foundGame.player1.name;

        setOpponent(oppName);
        setGameStarted(true);
        setIsLoading(false);
        setGameState(foundGame.gameState);
        setRound(foundGame.round);
        setScores(foundGame.scores);
        setIsMyTurn(foundGame.currentTurn === userId);
      }
    });

    socket.on("twoTruthsGameUpdated", (data: { allGames: TwoTruthsGame[] }) => {
      const foundGame = data.allGames.find(
        (game) => game.player1.id === userId || game.player2.id === userId
      );

      if (foundGame) {
        // Determine if I'm player1 or player2
        const isPlayer1 = foundGame.player1.id === userId;
        // const me = isPlayer1 ? foundGame.player1 : foundGame.player2;
        // const other = isPlayer1 ? foundGame.player2 : foundGame.player1;

        setGameState(foundGame.gameState);
        setRound(foundGame.round);
        setScores(foundGame.scores);
        setIsMyTurn(foundGame.currentTurn === userId);

        // If other player has submitted statements and I need to guess
        if (foundGame.gameState === 'guessing' && foundGame.currentTurn === userId) {
          setOpponentStatements(isPlayer1 ? foundGame.player2.statements : foundGame.player1.statements);
        }
        
        // Reset for new round
        if (foundGame.gameState === 'waiting' && foundGame.round > 1) {
          setStatements(["", "", ""]);
          setLieIndex(null);
          setGuessIndex(null);
          setOpponentStatements([]);
          setGuessResult(null);
        }

        // Game completed
        if (foundGame.gameState === 'completed') {
          // Determine winner
          const myScore = foundGame.scores[userId] || 0;
          const oppScore = foundGame.scores[isPlayer1 ? foundGame.player2.id : foundGame.player1.id] || 0;
          
          let winner = null;
          let reason = "";
          
          if (myScore > oppScore) {
            winner = username;
            reason = "win";
          } else if (oppScore > myScore) {
            winner = opponent;
            reason = "win";
          } else {
            winner = null;
            reason = "draw";
          }
          
          setGameResult({winner, reason});
          setShowModal(true);
        }
      }
    });

    socket.on("guessResult", (data: { gameId: number, playerId: string, isCorrect: boolean, lieIndex: number }) => {
      if (data.playerId === userId) {
        setGuessResult({
          isCorrect: data.isCorrect,
          lieIndex: data.lieIndex
        });
      }
    });

    socket.on("matchError", (data: { message: string }) => {
      alert(data.message);
      setIsLoading(false);
    });

    return () => {
      socket.off("twoTruthsGameMatched");
      socket.off("twoTruthsGameUpdated");
      socket.off("guessResult");
      socket.off("matchError");
    };
  }, [socket, userId, username, opponent]);

  return (
    <div className="p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Two Truths & A Lie</h1>
      {!gameStarted ? (
        <div>
          <p className="text-gray-600 mb-4">
            Share 3 statements about yourself - 2 truths and 1 lie. Your opponent will try to guess which one is the lie!
          </p>
          <input
            type="text"
            placeholder="Enter opponent's ID"
            value={opponentId}
            onChange={(e) => setOpponentId(e.target.value)}
            className="p-2 border rounded mb-4 w-full max-w-md text-white"
          />
          <button
            onClick={findPlayer}
            className="bg-pink-500 text-white p-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Matching..." : "Start Game"}
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-4 bg-pink-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <p>You: {username}</p>
              <p>Opponent: {opponent}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Round: {round}/2</p>
              <p>Scores: You {scores[userId] || 0} - {scores[Object.keys(scores).find(id => id !== userId) || ""] || 0} {opponent}</p>
            </div>
          </div>

          {gameState === 'waiting' && (
            <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
              <h2 className="text-2xl mb-4">Enter Your Statements</h2>
              <p className="text-gray-600 mb-4">Enter 2 true statements and 1 lie about yourself</p>
              
              {statements.map((statement, index) => (
                <div key={index} className="mb-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder={`Statement ${index + 1}`}
                      value={statement}
                      onChange={(e) => handleStatementChange(index, e.target.value)}
                      className="p-2 border rounded flex-grow text-white"
                    />
                    <button
                      onClick={() => selectLie(index)}
                      className={`px-4 py-2 rounded ${
                        lieIndex === index 
                          ? 'bg-red-500 text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {lieIndex === index ? "This is my lie" : "Mark as lie"}
                    </button>
                  </div>
                </div>
              ))}
              
              <button
                onClick={submitStatements}
                className="bg-pink-500 text-white px-6 py-2 rounded mt-4"
                disabled={statements.some(s => !s) || lieIndex === null}
              >
                Submit Statements
              </button>
            </div>
          )}

          {gameState === 'guessing' && isMyTurn && opponentStatements.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
              <h2 className="text-2xl mb-4">Guess The Lie</h2>
              <p className="text-gray-600 mb-4">{opponent} has shared 3 statements. Can you guess which one is the lie?</p>
              
              {opponentStatements.map((statement, index) => (
                <div key={index} className="mb-4">
                  <button
                    onClick={() => makeGuess(index)}
                    className={`w-full p-4 border rounded text-left ${
                      guessIndex === index 
                        ? 'bg-blue-100 border-blue-500' 
                        : 'hover:bg-gray-50'
                    }`}
                    disabled={guessResult !== null}
                  >
                    <span className="font-bold mr-2">{index + 1}.</span> {statement}
                  </button>
                </div>
              ))}
              
              {guessResult && (
                <div className={`mt-4 p-4 rounded ${
                  guessResult.isCorrect 
                    ? 'bg-green-100 border border-green-500' 
                    : 'bg-red-100 border border-red-500'
                }`}>
                  <div className="flex items-center">
                    {guessResult.isCorrect 
                      ? <ThumbsUp className="mr-2 text-green-500" /> 
                      : <ThumbsDown className="mr-2 text-red-500" />}
                    <p>
                      {guessResult.isCorrect 
                        ? "You guessed correctly! That was the lie." 
                        : `Incorrect! Statement ${guessResult.lieIndex + 1} was the lie.`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {gameState === 'guessing' && !isMyTurn && (
            <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
              <h2 className="text-2xl mb-4">Waiting for {opponent}</h2>
              <p className="text-gray-600">
                {round === 1 
                  ? `${opponent} is trying to guess which of your statements is a lie.` 
                  : `You've submitted your guess. Waiting for ${opponent} to guess.`}
              </p>
              <div className="mt-4 flex justify-center">
                <div className="animate-pulse flex items-center">
                  <Lightbulb className="text-yellow-500 mr-2" />
                  <p>Thinking...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg text-center max-w-md w-full">
            <h2 className="text-2xl mb-4">
              {gameResult?.reason === "win"
                ? `${gameResult?.winner} Wins!`
                : "It's a Draw!"}
            </h2>
            <p className="mb-4">
              Final Score: {username} {scores[userId] || 0} - {scores[Object.keys(scores).find(id => id !== userId) || ""] || 0} {opponent}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={resetGame}
                className="bg-pink-500 text-white px-6 py-2 rounded"
              >
                Play Again
              </button>
              <button
                onClick={quitGame}
                className="bg-gray-500 text-white px-6 py-2 rounded"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwoTruthsAndALie;