import "reflect-metadata";
import dotenv from "dotenv";
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import http from "http";
import cors from "cors";

import connectDB from "./config/db";
import { initializeSocket } from "./socket/socket";
import { notFound, errorHandler } from "./middleware/errorMiddleware";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import messageRoutes from "./routes/messagesRoutes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;


const server = http.createServer(app);


initializeSocket(server);


connectDB();


const corsOptions = {
  origin: ["http://localhost:3001"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.static("backend/public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server is ready");
});
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);


server.listen(port, () => console.log(`Server started on port ${port}`));
