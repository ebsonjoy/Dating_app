import mongoose, { Document } from "mongoose";

export interface IMessage extends Document {
    _id: string;
  senderId: mongoose.Types.ObjectId; 
  receiverId: mongoose.Types.ObjectId;
  message: string;
  isRead: boolean;
  callHistory?: mongoose.Types.ObjectId
  createdAt?: Date; 
  updatedAt?: Date;
}

export interface IMessageData {
    senderId: string;
    receiverId: string;
    message: string;
    isRead?: boolean;
    callHistoryId?:string;
}