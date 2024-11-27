import { Server, Socket } from "socket.io";
import http from "http";

const userSocketMap: Record<string, string> = {}; 

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

    socket.on("sendMessage", ({ receiverId, message }) => {
      const receiverSocketId = userSocketMap[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", {
          senderId: userId,
          message,
          createdAt: new Date().toISOString(),
        });
      }
    });


//888888888888888888888888888888888888888888888


    // Add these event listeners inside your socket.on("connection") handler:
// server/socket/socket.ts
socket.on("call-user", ({ to, offer, from }) => {
  const receiverSocketId = userSocketMap[to];
  if (receiverSocketId) {
    console.log('Emitting incoming call to:', to);
    io.to(receiverSocketId).emit("incoming-call", {
      offer,
      from
    });
  }
});



socket.on("call-accepted", ({ to, answer, from }) => {
  const receiverSocketId = userSocketMap[to];
  if (receiverSocketId) {
    console.log('Emitting call accepted to:', to);
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
//888888888888888888888888888888888888888888888

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
