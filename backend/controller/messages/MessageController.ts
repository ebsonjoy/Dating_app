import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { IMessageService } from '../../interfaces/messages/IMessageService';
import asyncHandler from 'express-async-handler';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { StatusMessage } from '../../enums/StatusMessage';
import { getReceiverSocketId,io } from '../../socket/socket';

@injectable()
export class MessageController {
    constructor(
        @inject('IMessageService') private readonly messageService: IMessageService
    ) {}

    sendMessage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const receiverId = req.params.userId
     console.log('message sending receiviverId', receiverId)
        const { senderId, ...messageData } = req.body;
     console.log('message sending senderId', senderId)
     console.log('message sending message Dataaaaaa', messageData)

        try {
            const newMessage = await this.messageService.sendMessage(senderId,receiverId, messageData);
            
            // SOCKET.IO FUNCTIONALITY
    // const receiverSocketId = getReceiverSocketId(receiverId);
    // if (receiverSocketId) {
    //   io.to(receiverSocketId).emit("newMessage", {
    //     senderId,
    //     message: newMessage.message,    
    //     createdAt: newMessage.createdAt,
    //   });
    // }

    const receiverSocketId = getReceiverSocketId(receiverId);
if (receiverSocketId) {
  io.to(receiverSocketId).emit("newMessage", {
    senderId,
    message: newMessage.message,
    createdAt: newMessage.createdAt,
  });
}

    res.status(HttpStatusCode.CREATED).json({ success: true, data: newMessage });
            // res.status(HttpStatusCode.CREATED).json({ success: true, data: message });
        } catch (error) {
            console.error(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, error: StatusMessage.SEND_MESSAGE_FAILED });
        }
    });

    getChatHistory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { userId1, userId2 } = req.query as { userId1: string; userId2: string };
        if (!userId1 || !userId2) {
            res.status(400).json({ success: false, error: 'User IDs are required' });
            return;
        }

        try {
            const messages = await this.messageService.getChatHistory(userId1, userId2);
            res.status(HttpStatusCode.OK).json({ success: true, data: messages });
        } catch (error) {
            console.error(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: StatusMessage.GET_CHAT_HISTORY_FAILED,
            });
        }
    });


    // createCallHistroy =  asyncHandler(async (req: Request, res: Response): Promise<void> => {

    // })

   
}
