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

    
    // socket.on("sendMessage", ({ receiverId, message }) => {
    //   const receiverSocketId = userSocketMap[receiverId];
    //   if (receiverSocketId) {
    //     io.to(receiverSocketId).emit("receiveMessage", { senderId: userId, message });
    //   }
    // });

    socket.on("sendMessage", ({ receiverId, message }) => {
      const receiverSocketId = userSocketMap[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", {
          senderId: userId,
          message,
          createdAt: new Date().toISOString(), // Add timestamp
        });
      }
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
