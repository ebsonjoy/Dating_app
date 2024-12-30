import { Server, Socket } from "socket.io";
import http from "http";
import Notification from "../models/Notifications";


interface PlayerOne {
  p1name: string;
  p1value: string;
  p1move: string[];
}

interface PlayerTwo {
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


const userSocketMap: Record<string, string> = {}; 
const arr: string[] = [];
let playingArray: PlayerPair[] = [];

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

    // Existing online users functionality
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Handle message read status
    socket.on("markMessageRead", ({ messageId, senderId, readerId }) => {
      const senderSocketId = userSocketMap[senderId];
      if (senderSocketId) {
        io.to(senderSocketId).emit("messageRead", {
          messageId,
          readerId
        });
      }
    });

    // Existing messaging functionality
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

    //Notification

  socket.on("notifyLike", async ({ name, likedUserId }) => {
    const receiverSocketId = getReceiverSocketId(likedUserId);
    const notification = {
      userId: likedUserId,
      type: "like",
      message: `${name} liked your profile.`,
    };
    await Notification.create(notification);
  
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("notification", notification);
    }
  });

  socket.on("notifyMessage",async ({name,likedUserId }) => {
    const receiverSocketId = getReceiverSocketId(likedUserId);
         const notification = {
      userId: likedUserId,
      type: "message",
      message:`${name} sent you a message:`,
    };
    await Notification.create(notification);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("notification", notification);
    }
  });

  socket.on("notifyMatch",async ({ user1Id, user2Id }) => {
    [user1Id, user2Id].forEach(async (userId) => {
      const receiverSocketId = getReceiverSocketId(userId);
      const notification = {
        userId,
        type: "match",
        message:`"You have a new match!"`,
      };
      await Notification.create(notification);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("notification", notification);
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

  

    // Tic-Tac-Toe functionality
socket.on("find", (e: { name: string,userId : string }) => {
  console.log('uuuuuuuuuuu',e.userId)
  if (e.name) {
    arr.push(e.name);

    if (arr.length >= 2) {
      const p1obj: PlayerOne = {
        p1name: arr[0],
        p1value: "X",
        p1move: [],
      };
      const p2obj: PlayerTwo = {
        p2name: arr[1],
        p2value: "O",
        p2move: [],
      };

      const obj: PlayerPair = {
        p1: p1obj,
        p2: p2obj,
        sum: 0,
        board: Array(9).fill(""),
      };
      playingArray.push(obj);

      arr.splice(0, 2);

      io.emit("find", { allPlayers: playingArray });
    }
  }
});
 

socket.on("playing", (e: { value: string; id: string; name: string }) => {
  const objToCheck = playingArray.find(
    (obj) => obj.p1.p1name === e.name || obj.p2.p2name === e.name
  );

  if (objToCheck) {
    const index = parseInt(e.id.replace("btn", "")) - 1;
    if (objToCheck.board[index] === "") {
      objToCheck.board[index] = e.value; 
      objToCheck.sum++; 
    }
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
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
      io.emit("gameOver", {
        winner: winner === "X" ? objToCheck.p1.p1name : objToCheck.p2.p2name,
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

socket.on("resetGame", (e: { name: string }) => {
  playingArray = playingArray.filter(
    (obj) => obj.p1.p1name !== e.name && obj.p2.p2name !== e.name
  );
  io.emit("playing", { allPlayers: playingArray });
});


socket.on("gameOver", (e: { name: string }) => {
  playingArray = playingArray.filter((obj) => obj.p1.p1name !== e.name);
});

   
      socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
        if (userId) {
          delete userSocketMap[userId];
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      });
    });
  };

  export const getReceiverSocketId = (receiverId: string): string | undefined => {
    return userSocketMap[receiverId];
    
  };