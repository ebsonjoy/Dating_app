import mongoose, { Schema } from "mongoose";
import { INotification } from "../types/notification.types";

const notificationSchema : Schema<INotification> = new Schema({
  userId: { type:Schema.Types.ObjectId, required: true, ref: "User" },
  type: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;
