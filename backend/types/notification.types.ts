import mongoose from "mongoose";

export interface INotification {
  userId: mongoose.Types.ObjectId;
  type: string;     
  message: string;  
  createdAt?: Date; 
}
