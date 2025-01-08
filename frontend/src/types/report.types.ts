
export interface IReport {
    reporterId: string;     
    reportedId: string;     
    reason: string;           
    additionalDetails?: string;
}

interface Reporter {
    _id: string;
    name: string;
    email: string;
  }
  
  interface Reported {
    _id: string;
    name: string;
    email: string;
  }
  
  interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    message: string;
    isRead: boolean;
    createdAt: string;
  }
  
 interface IUserReports {
    _id: string;
    reporterId: Reporter;
    reportedId: Reported;
    reason: string;
    additionalDetails: string;
    status: 'Pending' | 'Reviewed' | 'Resolved';
    messages: Message[];
  }

 export interface ApiResponse {
    success: boolean;
    data: IUserReports[];
  }
  
  export interface IUpdateReportStatus{
    reportId:string;
    status:string;
  }