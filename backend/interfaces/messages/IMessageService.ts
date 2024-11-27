import { IMessage, IMessageData } from '../../types/message.types';
// import { ICallHistory } from '../../types/videoCall.types';

export interface IMessageService {
  sendMessage(senderId: string,receiverId:string, messageData: IMessageData): Promise<IMessage>;
  getChatHistory(userId1: string, userId2: string): Promise<IMessage[]>;
  // markMessagesAsRead(userId: string, chatPartnerId: string): Promise<void>;
  // getUnreadMessagesCount(userId: string): Promise<number>;

  // createCallHistory(callData: {
  //   callerId: string;
  //   receiverId: string;
  //   type: ICallHistory['type'];
  //   duration?: number;
  //   status: ICallHistory['status'];
  // }): Promise<{
  //   callHistory: ICallHistory;
  //   message: ICallHistory;
  // }>; 
}