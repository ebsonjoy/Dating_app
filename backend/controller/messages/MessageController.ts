import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { IMessageService } from '../../interfaces/messages/IMessageService';
import asyncHandler from 'express-async-handler';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { StatusMessage } from '../../enums/StatusMessage';
import { Socket } from 'socket.io';

@injectable()
export class MessageController {
    constructor(
        @inject('IMessageService') private readonly messageService: IMessageService
    ) {}

    sendMessage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.params.userId
        const messageData = req.body;
        try {
            const message = await this.messageService.sendMessage(userId, messageData);
            res.status(HttpStatusCode.CREATED).json({ success: true, data: message });
        } catch (error) {
            console.error(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, error: StatusMessage.SEND_MESSAGE_FAILED });
        }
    });

    getChatHistory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { userId1, userId2 } = req.query as { userId1: string; userId2: string };
        try {
            const messages = await this.messageService.getChatHistory(userId1, userId2);
            res.status(HttpStatusCode.OK).json({ success: true, data: messages });
        } catch (error) {
            console.error(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, error: StatusMessage.GET_CHAT_HISTORY_FAILED });
        }
    });

    markMessagesAsRead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { userId, chatPartnerId } = req.body;
        try {
            await this.messageService.markMessagesAsRead(userId, chatPartnerId);
            res.status(HttpStatusCode.OK).json({ success: true, message: StatusMessage.MARK_MESSAGES_AS_READ_SUCCESS });
        } catch (error) {
            console.error(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, error: StatusMessage.MARK_MESSAGES_AS_READ_FAILED });
        }
    });

    getUnreadMessagesCount = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.params;
        try {
            const count = await this.messageService.getUnreadMessagesCount(userId);
            res.status(HttpStatusCode.OK).json({ success: true, data: count });
        } catch (error) {
            console.error(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, error: StatusMessage.GET_UNREAD_MESSAGES_COUNT_FAILED });
        }
    });

    handleSocketConnection(socket: Socket) {
        const userId = socket.handshake.auth.userId;

        socket.on('joinChat', async ({ userId1, userId2 }) => {
            const room = `chat_${userId1}_${userId2}`;
            socket.join(room);
            try {
                const messages = await this.messageService.getChatHistory(userId1, userId2);
                socket.emit('chatHistory', messages);
            } catch (err) {
              console.log(err);
              
                socket.emit('error', { message: StatusMessage.GET_CHAT_HISTORY_FAILED });
            }
        });

        socket.on('sendMessage', async (data, callback) => {
            const { senderId, receiverId } = data;
            const room = `chat_${senderId}_${receiverId}`;
            try {
                const message = await this.messageService.sendMessage(senderId, data);
                socket.to(room).emit('newMessage', message);
                callback({ success: true, message });
            } catch (err) {
              console.log(err);

                socket.emit('error', { message: StatusMessage.SEND_MESSAGE_FAILED });
            }
        });

        socket.on('markAsRead', async (data, callback) => {
            const { userId, chatPartnerId } = data;
            try {
                await this.messageService.markMessagesAsRead(userId, chatPartnerId);
                callback({ success: true, message: StatusMessage.MARK_MESSAGES_AS_READ_SUCCESS });
            } catch (err) {
              console.log(err);

                socket.emit('error', { message: StatusMessage.MARK_MESSAGES_AS_READ_FAILED });
            }
        });

        socket.on('getUnreadCount', async (callback) => {
            try {
                const count = await this.messageService.getUnreadMessagesCount(userId);
                callback({ success: true, count });
            } catch (err) {
              console.log(err);

                socket.emit('error', { message: StatusMessage.GET_UNREAD_MESSAGES_COUNT_FAILED });
            }
        });
    }
}
