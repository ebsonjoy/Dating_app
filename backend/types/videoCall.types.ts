import  {Types,  Document } from 'mongoose';

export interface IVideoCall extends Document {
  userId: Types.ObjectId;
  partnerId:  Types.ObjectId;
  callDuration: number
  // callStartTime: Date;
  // callEndTime: Date;
  callType: 'initiated' | 'received' | 'missed';
  status: 'completed' | 'rejected' | 'cancelled';
  createdAt: Date;
}



export interface CreateVideoCallHistoryDto {
  userId: Types.ObjectId;
  partnerId: string;
  callDuration?: number;
  callStartTime?: Date;
  callEndTime?: Date;
  callType: 'initiated' | 'received' | 'missed';
  status: 'completed' | 'rejected' | 'cancelled';
}

export interface VideoCallHistoryResponseDto {
  id: Types.ObjectId;
  partnerName: string;
  partnerImage: string;
  callDuration: number;
  callStartTime: Date;
  callEndTime: Date;
  callType: string;
  status: string;
}


// import { Types } from 'mongoose';

export interface ICallHistory {
  callerId: Types.ObjectId; 
  receiverId: Types.ObjectId;
  type: 'video-call' | 'missed-call' | 'rejected-call';
  duration?: number;
  status: 'started' | 'ended' | 'rejected' | 'missed';
  createdAt?: Date;
}

export interface ICallHistoryResponse {
  _id:Types.ObjectId;
  callerId: Types.ObjectId; 
  receiverId: Types.ObjectId;
  type: 'video-call' | 'missed-call' | 'rejected-call';
  duration?: number;
  status: 'started' | 'ended' | 'rejected' | 'missed';
  createdAt?: Date;
}

