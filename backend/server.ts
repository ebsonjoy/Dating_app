import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import {notFound,errorHandler} from './middleware/errorMiddleware'
import userRoutes from './routes/userRoutes'
import adminRoutes from './routes/adminRoutes'
import messageRoutes from './routes/messagesRoutes'

import { Server, Socket } from 'socket.io';
import http from 'http';
import { container } from './config/container';
import { MessageController } from './controller/messages/MessageController';

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const port = process.env.PORT || 4000;

connectDB();
app.use(cookieParser())
app.get('/', (req, res) => {
    res.send('Server is ready');
});
app.use(express.json());
app.use(express.static('backend/public'));
app.use(express.urlencoded({extended : true}));
app.use('/api/users', userRoutes);
app.use('/api/admin',adminRoutes)
app.use('/api/message',messageRoutes)
const messageController = container.get<MessageController>('MessageController')
io.on('connection', (socket: Socket) => {
    messageController.handleSocketConnection(socket);
  });


app.use(notFound)
app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`));