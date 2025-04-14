import { Server, Socket } from "socket.io";
import http from "http";
import Notification from "../models/Notifications";

interface PlayerOne {
  p1id: string;
  p1name: string;
  p1value: string;
  p1move: string[];
}

interface PlayerTwo {
  p2id: string;
  p2name: string;
  p2value: string;
  p2move: string[];
}

interface PlayerPair {
  p1: PlayerOne;
  p2: PlayerTwo;
  sum: number;
  board: string[];
}

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

const userSocketMap: Record<string, string> = {}; 

interface GameRequest {
  playerId: string;
  playerName: string;
  opponentId: string;
  gameType?: string;
}

const pendingGameRequests: Record<string, GameRequest> = {};
let playingArray: PlayerPair[] = [];
let twoTruthsGames: TwoTruthsGame[] = [];

export let io: Server;

export const initializeSocket = (server: http.Server): void => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:3001"], 
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId as string;
    if (userId && userId !== "undefined") {
      userSocketMap[userId] = socket.id;
    }


    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("markMessageRead", ({ messageId, senderId, readerId }) => {
      const senderSocketId = userSocketMap[senderId];
      if (senderSocketId) {
        io.to(senderSocketId).emit("messageRead", {
          messageId,
          readerId
        });
      }
    });

    socket.on("sendMessage", ({ receiverId, message }) => {
      const receiverSocketId = userSocketMap[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", {
          senderId: userId,
          receiverId: receiverId,
          message,
          createdAt: new Date().toISOString(),
        });
      }
    });

    // Handle user blocking
    socket.on("userBlocked", ({ blockedUserId, blockedByUserId }) => {
      console.log(blockedByUserId)
      const blockedUserSocketId = userSocketMap[blockedUserId];
      if (blockedUserSocketId) {
        io.to(blockedUserSocketId).emit("userWasBlocked", { blockedUserId });
      }
    });

    // Handle user unblocking
    socket.on("userUnblocked", ({ unblockedUserId, unblockedByUserId }) => {
      const unblockedUserSocketId = userSocketMap[unblockedUserId];
      if (unblockedUserSocketId) {
        io.to(unblockedUserSocketId).emit("userWasUnblocked", { unblockedByUserId });
      }
    });
    //Notification

    socket.on("notificationForLike",async ({ likedUserId,name }) => {
      const receiverSocketId = userSocketMap[likedUserId];
      const notification = {
        userId: likedUserId,
        type: "like",
        message: `${name} liked your profile.`,
      };
      await Notification.create(notification);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("OneUserLiked", { likedUserId,name });
      }
    });

  socket.on("notifyForMessage",async ({name,receivedUserId }) => {
    const receiverSocketId = userSocketMap[receivedUserId];
         const notification = {
      userId: receivedUserId,
      type: "message",
      message:`${name} sent a message:`,
    };
    await Notification.create(notification);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("OneMessage", { receivedUserId,name });
    }
  });

  socket.on("notifyForMatch",async ({ user1Id, user2Id }) => {
    [user1Id, user2Id].forEach(async (userID) => {
      const receiverSocketId = userSocketMap[userID];
      const notification = {
        userID,
        type: "match",
        message:`"You have a new match!"`,
      };
      await Notification.create(notification);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("OneMatch", { userID});
      }
    });
  });

  socket.on("call-user", ({ to, offer, from }) => {
    const receiverSocketId = userSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("incoming-call", {
        offer,
        from
      });
    }
  });

    socket.on("call-accepted", ({ to, answer, from }) => {
      const receiverSocketId = userSocketMap[to];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("call-accepted", {
          answer,
          from
        });
      }
    });

    socket.on("call-rejected", ({ to }) => {
      const receiverSocketId = userSocketMap[to];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("call-rejected");
      }
    });

    socket.on("ice-candidate", ({ to, candidate }) => {
      const receiverSocketId = userSocketMap[to];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("ice-candidate", {
          candidate,
          from: socket.handshake.query.userId
        });
      }
    });

    socket.on("end-call", ({ to }) => {
      const receiverSocketId = userSocketMap[to];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("call-ended");
      }
    });

  // Tic-Tac-Toe
  socket.on("findByIds", (request: GameRequest) => {
    console.log("Game request received:", request);
    
    if (!userSocketMap[request.opponentId]) {
      socket.emit("matchError", { message: "Opponent is not online" });
      return;
    }
    
    const pendingRequest = pendingGameRequests[request.playerId];
    
    if (pendingRequest && pendingRequest.playerId === request.opponentId) {
      console.log("Match found between", request.playerId, "and", request.opponentId);
      
      if (request.gameType === "twoTruths" || pendingRequest.gameType === "twoTruths") {
        const newGame: TwoTruthsGame = {
          player1: {
            id: pendingRequest.playerId,
            name: pendingRequest.playerName,
            statements: [],
            lieIndex: null
          },
          player2: {
            id: request.playerId,
            name: request.playerName,
            statements: [],
            lieIndex: null
          },
          currentTurn: pendingRequest.playerId,
          gameState: 'waiting',
          round: 1,
          scores: {
            [pendingRequest.playerId]: 0,
            [request.playerId]: 0
          }
        };
        
        twoTruthsGames.push(newGame);
        
        delete pendingGameRequests[request.playerId];
        
        io.emit("twoTruthsGameMatched", { allGames: twoTruthsGames });
      } else {
        // Default to Tic-Tac-Toe
        // Create player objects
        const p1obj: PlayerOne = {
          p1id: pendingRequest.playerId,
          p1name: pendingRequest.playerName,
          p1value: "X",
          p1move: [],
        };
        
        const p2obj: PlayerTwo = {
          p2id: request.playerId,
          p2name: request.playerName,
          p2value: "O",
          p2move: [],
        };
        
        const gameObj: PlayerPair = {
          p1: p1obj,
          p2: p2obj,
          sum: 0,
          board: Array(9).fill(""),
        };
        
        playingArray.push(gameObj);
        
        delete pendingGameRequests[request.playerId];
        
        io.emit("gameMatched", { allPlayers: playingArray });
      }
    } else {
      pendingGameRequests[request.opponentId] = request;
      console.log("Game request stored for", request.opponentId);
      const opponentSocketId = userSocketMap[request.opponentId];
      if (opponentSocketId) {
        io.to(opponentSocketId).emit("gameRequest", {
          requesterId: request.playerId,
          requesterName: request.playerName,
          gameType: request.gameType
        });
      }
    }
  });

  // Two Truths & A Lie game handlers
  socket.on("submitStatements", ({ playerId, statements, lieIndex }) => {
    const game = twoTruthsGames.find(
      game => game.player1.id === playerId || game.player2.id === playerId
    );

    if (game) {
      if (game.player1.id === playerId) {
        game.player1.statements = statements;
        game.player1.lieIndex = lieIndex;
      } else {
        game.player2.statements = statements;
        game.player2.lieIndex = lieIndex;
      }

      if (game.player1.statements.length > 0 && game.player2.statements.length > 0) {
        game.gameState = 'statements_submitted';
        
        game.currentTurn = game.player2.id;
        game.gameState = 'guessing';
      }

      io.emit("twoTruthsGameUpdated", { allGames: twoTruthsGames });
    }
  });

  socket.on("makeGuess", ({ playerId, guessIndex }) => {
    const game = twoTruthsGames.find(
      game => game.player1.id === playerId || game.player2.id === playerId
    );

    if (game && game.gameState === 'guessing') {
      let isCorrect = false;
      let lieIndex = -1;
      
      if (game.currentTurn === game.player1.id) {
        isCorrect = guessIndex === game.player2.lieIndex;
        lieIndex = game.player2.lieIndex as number;
        
        if (isCorrect) {
          game.scores[game.player1.id]++;
        }
        
        if (game.round === 1) {
          game.round = 2;
          game.gameState = 'waiting';
          game.player1.statements = [];
          game.player2.statements = [];
          game.player1.lieIndex = null;
          game.player2.lieIndex = null;
        } else {
          game.gameState = 'completed';
        }
      } else {
        isCorrect = guessIndex === game.player1.lieIndex;
        lieIndex = game.player1.lieIndex as number;
        
        if (isCorrect) {
          game.scores[game.player2.id]++;
        }
        
        game.currentTurn = game.player1.id;
      }
      
      io.emit("guessResult", { 
        gameId: twoTruthsGames.indexOf(game),
        playerId,
        isCorrect,
        lieIndex
      });
      
      io.emit("twoTruthsGameUpdated", { allGames: twoTruthsGames });
    }
  });

  socket.on("resetTwoTruthsGame", ({ playerId }) => {
    twoTruthsGames = twoTruthsGames.filter(
      game => game.player1.id !== playerId && game.player2.id !== playerId
    );
    io.emit("twoTruthsGameUpdated", { allGames: twoTruthsGames });
  });

  socket.on("playing", (e: { value: string; id: string; playerId: string }) => {
    const objToCheck = playingArray.find(
      (obj) => obj.p1.p1id === e.playerId || obj.p2.p2id === e.playerId
    );

    if (objToCheck) {
      const index = parseInt(e.id.replace("btn", "")) - 1;
      if (objToCheck.board[index] === "") {
        objToCheck.board[index] = e.value; 
        objToCheck.sum++; 
      }
      
      const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
      ];

      let winner = null;
      for (const [a, b, c] of winConditions) {
        if (
          objToCheck.board[a] &&
          objToCheck.board[a] === objToCheck.board[b] &&
          objToCheck.board[a] === objToCheck.board[c]
        ) {
          winner = objToCheck.board[a];
          break;
        }
      }

      if (winner) {
        const winnerName = winner === "X" ? objToCheck.p1.p1name : objToCheck.p2.p2name;
        io.emit("gameOver", {
          winner: winnerName,
          reason: "win",
        });
        playingArray = playingArray.filter((obj) => obj !== objToCheck);
      } else if (objToCheck.sum === 9) {
        io.emit("gameOver", {
          winner: null,
          reason: "draw",
        });
        playingArray = playingArray.filter((obj) => obj !== objToCheck);
      } else {
        io.emit("playing", { allPlayers: playingArray });
      }
    }
  });

  socket.on("resetGame", (e: { playerId: string }) => {
    playingArray = playingArray.filter(
      (obj) => obj.p1.p1id !== e.playerId && obj.p2.p2id !== e.playerId
    );
    io.emit("playing", { allPlayers: playingArray });
  });
   
      socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
        if (userId) {
          delete pendingGameRequests[userId];
          delete userSocketMap[userId];
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      });
    });
  };

  export const getReceiverSocketId = (receiverId: string): string | undefined => {
    return userSocketMap[receiverId];
    
  };