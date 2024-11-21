import { injectable } from 'inversify';
// import Message from '../../models/MessageModel';
// import Conversation from '../../models/conversationModel';
import { IConversation } from '../../types/conversation.types';
import { IMessage, IMessageData } from '../../types/message.types';
import { IMessageRepository } from '../../interfaces/messages/IMessageRepository';
import { Model } from 'mongoose';

@injectable()
export class MessageRepository implements IMessageRepository {
    // constructor(
    //   private readonly ConversationModel = Conversation,
    //     private readonly MessageModel = Message
    // ) {}
    private MessageModel: Model<IMessage>;
    private ConversationModel: Model<IConversation>;
  
    constructor(MessageModel: Model<IMessage>, ConversationModel: Model<IConversation>) {
      this.MessageModel = MessageModel;
      this.ConversationModel = ConversationModel;
    }

    async createMessage(senderId: string, receiverId: string, messageData: IMessageData): Promise<IMessage> {
      try {
        const message = new this.MessageModel({
          ...messageData,
          senderId,
          receiverId,
        });
        return await message.save();
      } catch (error) {
        console.error('Error creating message:', error);
        throw new Error('Failed to create message');
      }
    }

    async getChatHistory(userId1: string, userId2: string, limit = 50, skip = 0): Promise<IMessage[]> {
      return await this.MessageModel.find({
          $or: [
              { senderId: userId1, receiverId: userId2 },
              { senderId: userId2, receiverId: userId1 },
          ],
      })
          .sort({ createdAt: 1 })
          .skip(skip)
          .limit(limit);
  }
  

async findConversationByUserIds(userId1: string, userId2: string): Promise<IConversation | null> {
  return await this.ConversationModel.findOne({ participants: { $all: [userId1, userId2] } });
}

async createConversation(userId1: string, userId2: string): Promise<IConversation> {
  return await this.ConversationModel.create({ participants: [userId1, userId2] });
}

async addMessageToConversation(conversationId: string, messageId: string): Promise<void> {
  try {
    await this.ConversationModel.findByIdAndUpdate(conversationId, {
      $push: { messages: messageId },
    });
  } catch (error) {
    console.error('Error adding message to conversation:', error);
    throw new Error('Failed to add message to conversation');
  }
}

}