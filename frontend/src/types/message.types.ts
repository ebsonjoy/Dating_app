// src/types/message.ts

export interface IMessage {
  _id?: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IChatHistory {
 data: IMessage[];
  partnerProfile?: {
    id: string;
    name: string;
    image: string[];
  };
}

export interface IMessageState {
  currentChat?: {
    partnerId: string;
    messages: IMessage[];
  };
  chatHistories: {
    [partnerId: string]: IMessage[];
  };
}

export interface SendMessagePayload {
  senderId: string;
  receiverId: string;
  message: string;
}

export interface GetChatHistoryParams {
  userId1: string | null | undefined;
  userId2: string | null | undefined;
}