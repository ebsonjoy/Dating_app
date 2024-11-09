import { Document } from 'mongoose';

export interface IMessage extends Document {
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: Date;
    isRead: boolean;
}

export interface IMessageData {
    senderId: string;
    receiverId: string;
    content: string;
}