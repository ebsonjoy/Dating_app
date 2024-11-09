import mongoose, { Schema } from 'mongoose';
import { IMessage } from '../types/message.types';

const messageSchema = new Schema({
    senderId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    receiverId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
    isRead: { 
        type: Boolean, 
        default: false 
    }
});

messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ timestamp: -1 });

const Message = mongoose.model<IMessage>('Message', messageSchema);
export default Message
