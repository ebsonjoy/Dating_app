export interface IMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}
  
export interface IMessageData {
  receiverId: string;
  content: string;
  timestamp: string;
}