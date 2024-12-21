import mongoose, { Schema } from "mongoose";
import { IMessage } from "../types/message.types";

const messageSchema = new Schema<IMessage>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    callHistory: {
      type: Schema.Types.ObjectId,
      ref: "CallHistory",
      required: false,
    },
  },
  { timestamps: true } 
);

const Message = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
