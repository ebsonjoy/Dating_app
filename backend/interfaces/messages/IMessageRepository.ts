import { IMessage, IMessageData } from '../../types/message.types';
import { IConversation } from '../../types/conversation.types';
// import { ICallHistory } from '../../types/videoCall.types';

export interface IMessageRepository {
  createMessage(senderId: string, receiverId: string, messageData: IMessageData): Promise<IMessage>;
  getChatHistory(userId1: string, userId2: string): Promise<IMessage[]>;
  findConversationByUserIds(userId1: string, userId2: string): Promise<IConversation | null>;
  createConversation(userId1: string, userId2: string): Promise<IConversation>;
  addMessageToConversation(conversationId: string, messageId: string): Promise<void>;

  //callhistroy

  // create(callHistory:ICallHistory): Promise<ICallHistory>;
  

}