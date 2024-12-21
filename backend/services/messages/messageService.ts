import { injectable, inject } from 'inversify';
import { IMessageService } from '../../interfaces/messages/IMessageService';
import { IMessageRepository } from '../../interfaces/messages/IMessageRepository';
import { IMessage, IMessageData } from '../../types/message.types';
import { ICallHistory } from '../../types/videoCall.types';


@injectable()
export class MessageService implements IMessageService {
    constructor(
        @inject('IMessageRepository') private messageRepository: IMessageRepository
    ) {}

    async sendMessage(senderId: string, receiverId: string, messageData: IMessageData): Promise<IMessage> {


      let conversation  = await this.messageRepository.findConversationByUserIds(senderId,receiverId)
      if(!conversation){
      conversation =  await this.messageRepository.createConversation(senderId,receiverId);
      }

      const newMessage = await this.messageRepository.createMessage(senderId,receiverId,messageData)

      if (newMessage && conversation._id) {
        await this.messageRepository.addMessageToConversation(conversation._id.toString(), newMessage._id.toString());
      }

      return newMessage;
   
  }

  async getChatHistory(userId1: string, userId2: string): Promise<IMessage[]> {
    try {
      return await this.messageRepository.getChatHistory(userId1, userId2);
    } catch (error) {
        console.log(error)

      throw new Error('Failed to get chat history');
    }
  }

// Video
  async createCallHistory(callHistory:ICallHistory):Promise<void>{
    const { callerId, receiverId, type, duration, status } = callHistory;
    console.log('in serviceeeeeee',callHistory)
    try {
    const newCallHistory = await this.messageRepository.createCallHistory({
      callerId,
      receiverId,
      type,
      duration,
      status,
  });

  const senderId = callerId.toString()
  const callHistoryId =newCallHistory._id.toString()

  let conversation  = await this.messageRepository.findConversationByUserIds(senderId,receiverId.toString())
  if(!conversation){
  conversation =  await this.messageRepository.createConversation(senderId,receiverId.toString());
  }

      let messageText = '';
      const callDuration = duration ?? 0;
      switch (status) {
          case 'ended':
              messageText = `Video call ended (${Math.floor(callDuration / 60)}:${(callDuration % 60)
                  .toString()
                  .padStart(2, '0')})`;
              break;
          case 'rejected':
              messageText = 'Call rejected';
              break;
          case 'missed':
              messageText = 'Missed call';
              break;
          default:
              messageText = 'Video call';
      }
     
  const message = messageText
  console.log('switch case',message)
    const newMessage=  await this.messageRepository.createMessageCallHistory({
        senderId,
        receiverId:receiverId.toString(),
        message,
        callHistoryId
    });
    if (newMessage && conversation._id) {
      await this.messageRepository.addMessageToConversation(conversation._id.toString(), newMessage._id.toString());
    }
  } catch (error) {
    console.error('Failed to create call history:', error);
    throw new Error('Failed to create call history');
}

  }


  // async markMessagesAsRead(userId: string, senderId: string): Promise<void> {
  //   await this.messageRepository.markMessagesAsRead(userId, senderId);
  // }
  
  async markMessagesAsRead(userId: string, senderId: string): Promise<IMessage[]> {
    const messages = await this.messageRepository.findMessage(
       userId, senderId, false,);
  
    if (messages.length > 0) {
      await this.messageRepository.updateMessage(userId,senderId,false);
    }
  
    return messages;
  }


  async getUnreadMessageCount(userId: string): Promise<{ [key: string]: number }> {
    return await this.messageRepository.getUnreadMessageCount(userId);
  }
  
}