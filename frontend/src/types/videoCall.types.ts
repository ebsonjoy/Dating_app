// export interface IVideoCall{
//     userId: string
//     partnerId:  string
//     callDuration: number
//     // callStartTime: Date;
//     // callEndTime: Date;
//     callType: 'initiated' | 'received' | 'missed';
//     status: 'completed' | 'rejected' | 'cancelled';
//     // createdAt: Date;
//   }

  export interface ICallHistory {
    callerId: string; 
    receiverId: string;
    type: 'video-call' | 'missed-call' | 'rejected-call';
    duration?: number;
    status: 'started' | 'ended' | 'rejected' | 'missed';
    createdAt?: Date;
  }
  
  export interface ICallHistoryResponse {
    _id:string;
    callerId: string; 
    receiverId: string;
    type: 'video-call' | 'missed-call' | 'rejected-call';
    duration?: number;
    status: 'started' | 'ended' | 'rejected' | 'missed';
    createdAt?: Date;
  }