import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IMessageService } from "../../interfaces/messages/IMessageService";
import asyncHandler from "express-async-handler";
import { HttpStatusCode } from "../../enums/HttpStatusCode";
import { StatusMessage } from "../../enums/StatusMessage";
import { getReceiverSocketId, io } from "../../socket/socket";

@injectable()
export class MessageController {
  constructor(
    @inject("IMessageService") private readonly messageService: IMessageService
  ) {}

  sendMessage = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const receiverId = req.params.userId;
      const { senderId, ...messageData } = req.body;
      try {
        const newMessage = await this.messageService.sendMessage(
          senderId,
          receiverId,
          messageData
        );

        // SOCKET.IO FUNCTIONALITY
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", {
            senderId,
            message: newMessage.message,
            createdAt: newMessage.createdAt,
          });
        }

        res
          .status(HttpStatusCode.CREATED)
          .json({ success: true, data: newMessage });
      } catch (error) {
        console.error(error);
        res
          .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
          .json({ success: false, error: StatusMessage.SEND_MESSAGE_FAILED });
      }
    }
  );

  getChatHistory = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { userId1, userId2 } = req.query as {
        userId1: string;
        userId2: string;
      };
      if (!userId1 || !userId2) {
        res
          .status(400)
          .json({ success: false, error: "User IDs are required" });
        return;
      }

      try {
        const messages = await this.messageService.getChatHistory(
          userId1,
          userId2
        );
        res.status(HttpStatusCode.OK).json({ success: true, data: messages });
      } catch (error) {
        console.error(error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
          success: false,
          error: StatusMessage.GET_CHAT_HISTORY_FAILED,
        });
      }
    }
  );

  createCallHistroy = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { callerId, receiverId, type, duration, status } = req.body;
      console.log("hissssssssssssssssssssssssssssssss", req.body);

      try {
        const callHistory = await this.messageService.createCallHistory({
          callerId,
          receiverId,
          type,
          duration,
          status,
        });
        res
          .status(HttpStatusCode.OK)
          .json({ success: true, data: callHistory });
        console.log("caaaaaaaaaaaaaaaaaa", callHistory);
      } catch (error) {
        console.error(error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
          success: false,
          error: StatusMessage.GET_CHAT_HISTORY_FAILED,
        });
      }
    }
  );

  markMessagesAsRead = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { userId, senderId } = req.body;
  
      try {
        const updatedMessages = await this.messageService.markMessagesAsRead(
          userId,
          senderId
        );
        console.log(updatedMessages)
  
        // Emit socket event for each updated message
      //   const senderSocketId = getReceiverSocketId(senderId);
      // if (senderSocketId) {
      //   updatedMessages.forEach((message) => {
      //     io.to(senderSocketId).emit("messageRead", {
      //       messageId: message._id,
      //       readerId: userId,
      //     });
      //   });
      // }
  
        res.status(HttpStatusCode.OK).json({ success: true });
      } catch (error) {
        console.error(error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
          success: false,
          error: "Failed to mark messages as read",
        });
      }
    }
  );
  // markMessagesAsRead = asyncHandler(
  //   async (req: Request, res: Response): Promise<void> => {
  //     const { userId, senderId } = req.body;

  //     try {
  //       await this.messageService.markMessagesAsRead(userId, senderId);
  //       res.status(HttpStatusCode.OK).json({ success: true });
  //     } catch (error) {
  //       console.error(error);
  //       res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
  //         success: false,
  //         error: "Failed to mark messages as read",
  //       });
  //     }
  //   }
  // );

  getUnreadMessageCount = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { userId } = req.query;

      try {
        const unreadCounts = await this.messageService.getUnreadMessageCount(
          userId as string
        );
        res
          .status(HttpStatusCode.OK)
          .json({ success: true, data: unreadCounts });
      } catch (error) {
        console.error(error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
          success: false,
          error: "Failed to get unread message count",
        });
      }
    }
  );
}
