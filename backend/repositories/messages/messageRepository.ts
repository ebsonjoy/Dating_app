import { injectable } from 'inversify';
import Message from '../../models/MessageModel';
import { IMessage, IMessageData } from '../../types/message.types';
import { IMessageRepository } from '../../interfaces/messages/IMessageRepository';

@injectable()
export class MessageRepository implements IMessageRepository {
    constructor(
        private readonly MessageModel = Message
    ) {}

    async createMessage(userId: string, messageData: IMessageData): Promise<IMessage> {
        try {
          const message = new Message({
            ...messageData,
            senderId: userId,
          });
          return await message.save();
        } catch (error) {
          console.error('Error creating message:', error);
          throw new Error('Failed to create message');
        }
      }

      async getChatHistory(userId1: string, userId2: string): Promise<IMessage[]> {
        try {
          return await Message.find({
            $or: [
              { senderId: userId1, receiverId: userId2 },
              { senderId: userId2, receiverId: userId1 },
            ],
          }).sort({ timestamp: 1 });
        } catch (error) {
          console.error('Error getting chat history:', error);
          throw new Error('Failed to get chat history');
        }
      }

      async markMessagesAsRead(userId: string, chatPartnerId: string): Promise<void> {
        try {
          await Message.updateMany(
            {
              receiverId: userId,
              senderId: chatPartnerId,
              isRead: false,
            },
            { isRead: true }
          );
        } catch (error) {
          console.error('Error marking messages as read:', error);
          throw new Error('Failed to mark messages as read');
        }
      }

      async getUnreadMessagesCount(userId: string): Promise<number> {
        try {
          return await Message.countDocuments({
            receiverId: userId,
            isRead: false,
          });
        } catch (error) {
          console.error('Error getting unread messages count:', error);
          throw new Error('Failed to get unread messages count');
        }
      }
}