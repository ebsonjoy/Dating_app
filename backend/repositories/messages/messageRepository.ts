import { injectable } from 'inversify';
import { IConversation } from '../../types/conversation.types';
import { IMessage, IMessageData } from '../../types/message.types';
import { IMessageRepository } from '../../interfaces/messages/IMessageRepository';
import mongoose, { Model } from 'mongoose';
import { ICallHistory } from '../../types/videoCall.types';
import { ICallHistoryResponse } from '../../types/videoCall.types';



@injectable()
export class MessageRepository implements IMessageRepository {
    private MessageModel: Model<IMessage>;
    private ConversationModel: Model<IConversation>;
    private CallHistoryModel : Model<ICallHistory>;
  
    constructor(MessageModel: Model<IMessage>, ConversationModel: Model<IConversation>,CallHistoryModel : Model<ICallHistory>) {
      this.MessageModel = MessageModel;
      this.ConversationModel = ConversationModel;
      this.CallHistoryModel = CallHistoryModel;
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


// call

async createCallHistory(callHistory:ICallHistory):Promise<ICallHistoryResponse>{
  try{
    const history = new this.CallHistoryModel({
      callerId:callHistory.callerId,
      receiverId:callHistory.receiverId,
      type:callHistory.type,
      duration:callHistory.duration,
      status:callHistory.status
    })
    return await history.save()
  }catch (error) {
    console.error('Error creating message:', error);
    throw new Error('Failed to create message');
  }
}

async createMessageCallHistory(messageData: IMessageData): Promise<IMessage> {
  try {
    const message = new this.MessageModel({
      message:messageData.message,
      senderId:messageData.senderId,
      receiverId:messageData.receiverId,
      callHistoryId:messageData.callHistoryId,
    });
    return await message.save();
  } catch (error) {
    console.error('Error creating message:', error);
    throw new Error('Failed to create message');
  }
}

// async markMessagesAsRead(userId: string, senderId: string): Promise<void> {
//   await this.MessageModel.updateMany(
//     { 
//       senderId: senderId, 
//       receiverId: userId, 
//       isRead: false 
//     }, 
//     { 
//       $set: { isRead: true } 
//     }
//   );
// }

async getUnreadMessageCount(userId: string): Promise<{ [key: string]: number }> {
  const unreadCounts = await this.MessageModel.aggregate([
    { 
      $match: { 
        receiverId: new mongoose.Types.ObjectId(userId), 
        isRead: false 
      } 
    },
    {
      $group: {
        _id: "$senderId",
        count: { $sum: 1 }
      }
    }
  ]);

  return unreadCounts.reduce((acc, item) => {
    acc[item._id.toString()] = item.count;
    return acc;
  }, {});
}

async findMessage(userId1: string, userId2: string, status: boolean): Promise<IMessage[]> {
    return await this.MessageModel.find({
    receiverId: userId1,
    senderId: userId2,
    isRead: status,
    })
}

async updateMessage(userId1: string, senderId: string, status: boolean): Promise<void> {
    await this.MessageModel.updateMany({
      receiverId: userId1,
      senderId: senderId,
      isRead: status,
    },
    { isRead: true }
    )
}

}