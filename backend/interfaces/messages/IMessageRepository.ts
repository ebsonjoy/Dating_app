import { IMessage, IMessageData } from '../../types/message.types';

export interface IMessageRepository {
    createMessage(userId: string, messageData: IMessageData): Promise<IMessage>;
  getChatHistory(userId1: string, userId2: string): Promise<IMessage[]>;
  markMessagesAsRead(userId: string, chatPartnerId: string): Promise<void>;
  getUnreadMessagesCount(userId: string): Promise<number>;
}