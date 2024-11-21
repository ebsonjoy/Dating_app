import mongoose, { Document } from "mongoose";

export interface IConversation extends Document {
    _id: string;
  participants: mongoose.Types.ObjectId[]; 
  messages: mongoose.Types.ObjectId[]; 
  createdAt?: Date; 
  updatedAt?: Date; 
}
