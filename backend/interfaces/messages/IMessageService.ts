import { IMessage, IMessageData } from '../../types/message.types';
import { ICallHistory } from '../../types/videoCall.types';

export interface IMessageService {
  sendMessage(senderId: string,receiverId:string, messageData: IMessageData): Promise<IMessage>;
  getChatHistory(userId1: string, userId2: string): Promise<IMessage[]>;
  createCallHistory(callHistory:ICallHistory):Promise<void>
  markMessagesAsRead(userId: string, senderId: string): Promise<IMessage[]>
  getUnreadMessageCount(userId: string): Promise<{ [key: string]: number }>
}