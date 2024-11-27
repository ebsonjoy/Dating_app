import mongoose, { Schema } from "mongoose";
// import { IVideoCall } from "../types/videoCall.types";

import { ICallHistory } from "../types/videoCall.types";

// const VideoCallSchema = new Schema<IVideoCall>({
//     userId: { 
//         type: Schema.Types.ObjectId, 
//         ref: 'User', 
//         required: true 
//       },
//       partnerId: { 
//         type: Schema.Types.ObjectId, 
//         ref: 'User', 
//         required: true 
//       },
//       callDuration: { 
//         type: Number, 
//         default: 0 
//       },
      
//       callType: { 
//         type: String, 
//         enum: ['initiated', 'received', 'missed'], 
//         required: true 
//       },
//       status: { 
//         type: String, 
//         enum: ['completed', 'rejected', 'cancelled'], 
//         required: true 
//       },
//       createdAt: { 
//         type: Date, 
//         default: Date.now 
//       }
// })


// const VideoCall = mongoose.model<IVideoCall>('VideoCall',VideoCallSchema)

// export default VideoCall

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