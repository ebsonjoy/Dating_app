import mongoose, { Schema } from "mongoose";
import { ICallHistory } from "../types/videoCall.types";

const callHistorySchema = new Schema<ICallHistory>({
  callerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  type: {
    type: String,
    enum: ['video-call', 'missed-call', 'rejected-call'],
    required: true,
  },
  duration: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['started', 'ended', 'rejected', 'missed'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CallHistory = mongoose.model<ICallHistory>('CallHistory', callHistorySchema);

export default CallHistory;