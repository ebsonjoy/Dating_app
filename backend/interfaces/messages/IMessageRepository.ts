import { IMessage, IMessageData } from '../../types/message.types';
import { IConversation } from '../../types/conversation.types';
import { ICallHistory } from '../../types/videoCall.types';
import { ICallHistoryResponse } from '../../types/videoCall.types';



export interface IMessageRepository {
  createMessage(senderId: string, receiverId: string, messageData: IMessageData): Promise<IMessage>;
  getChatHistory(userId1: string, userId2: string): Promise<IMessage[]>;
  findConversationByUserIds(userId1: string, userId2: string): Promise<IConversation | null>;
  createConversation(userId1: string, userId2: string): Promise<IConversation>;
  addMessageToConversation(conversationId: string, messageId: string): Promise<void>;
  createCallHistory(CallHistory:ICallHistory):Promise<ICallHistoryResponse>;
  createMessageCallHistory(messageData: IMessageData): Promise<IMessage>;
  // markMessagesAsRead(userId: string, senderId: string): Promise<void>
  getUnreadMessageCount(userId: string): Promise<{ [key: string]: number }>

  findMessage(userId1: string, userId2: string,status:boolean): Promise<IMessage[]>;
  updateMessage(userId1: string, senderId: string,status:boolean): Promise<void>;

  
}