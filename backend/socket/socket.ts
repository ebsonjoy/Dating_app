import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

interface UserSocketMap {
  [userId: string]: string;
}

const userSocketMap: UserSocketMap = {};
export const initializeSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:3001"],
      methods: ["GET", "POST"],
    },
  });
  const emitOnlineUsers = () => {
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  };

  io.on("connection", (socket: Socket) => {
    console.log("A user connected:", socket.id);

    const userId = socket.handshake.query.userId as string;

    if (userId && userId !== "undefined") {
      userSocketMap[userId] = socket.id;
    }

    emitOnlineUsers();
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      if (userId) {
        delete userSocketMap[userId];
      }
      emitOnlineUsers();
    });
  });

  return io;
};

export const getReceiverSocketId = (receiverId: string): string | undefined => {
  return userSocketMap[receiverId];
};
