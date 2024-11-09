import { injectable, inject } from 'inversify';
import { IMessageService } from '../../interfaces/messages/IMessageService';
import { IMessageRepository } from '../../interfaces/messages/IMessageRepository';
import { IMessage, IMessageData } from '../../types/message.types';

@injectable()
export class MessageService implements IMessageService {
    constructor(
        @inject('IMessageRepository') private messageRepository: IMessageRepository
    ) {}

     async sendMessage(userId: string, messageData: IMessageData): Promise<IMessage> {
    try {
      return await this.messageRepository.createMessage(userId, messageData);
    } catch (error) {
        console.log(error)
      throw new Error('Failed to send message');
    }
  }

  async getChatHistory(userId1: string, userId2: string): Promise<IMessage[]> {
    try {
      return await this.messageRepository.getChatHistory(userId1, userId2);
    } catch (error) {
        console.log(error)

      throw new Error('Failed to get chat history');
    }
  }
  async markMessagesAsRead(userId: string, chatPartnerId: string): Promise<void> {
    try {
      await this.messageRepository.markMessagesAsRead(userId, chatPartnerId);
    } catch (error) {
        console.log(error)

      throw new Error('Failed to mark messages as read');
    }
  }
  async getUnreadMessagesCount(userId: string): Promise<number> {
    try {
      return await this.messageRepository.getUnreadMessagesCount(userId);
    } catch (error) {
        console.log(error)
      throw new Error('Failed to get unread messages count');
    }
  }
}