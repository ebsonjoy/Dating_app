import { injectable, inject } from 'inversify';
import { IMessageService } from '../../interfaces/messages/IMessageService';
import { IMessageRepository } from '../../interfaces/messages/IMessageRepository';
import { IMessage, IMessageData } from '../../types/message.types';
// import { IConversation } from '../../types/conversation.types';

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
  
}