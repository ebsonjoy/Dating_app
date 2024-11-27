export interface IVideoCall{
    userId: string
    partnerId:  string
    callDuration: number
    // callStartTime: Date;
    // callEndTime: Date;
    callType: 'initiated' | 'received' | 'missed';
    status: 'completed' | 'rejected' | 'cancelled';
    // createdAt: Date;
  }