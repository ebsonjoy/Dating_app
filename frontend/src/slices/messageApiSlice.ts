// src/slices/messageApiSlice.ts
import { apiSlice } from "./apiSlice";

const MESSAGES_URL = "/api/messages";

// Types
interface IMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface IMessageData {
  receiverId: string;
  content: string;
  timestamp: string;
}

interface IChatHistoryParams {
  userId1: string;
  userId2: string;
}

interface IMarkReadParams {
  chatPartnerId: string;
}

interface IContact {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  lastActive?: string;
}

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all contacts
    getContacts: builder.query<IContact[], void>({
      query: () => ({
        url: `${MESSAGES_URL}/contacts`,
        method: 'GET',
      }),
      providesTags: ['Contacts'],
    }),

    // Send a new message
    sendMessage: builder.mutation<IMessage, IMessageData>({
      query: (data) => ({
        url: `${MESSAGES_URL}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Messages', 'UnreadCount'],
    }),

    // Get chat history between two users
    getChatHistory: builder.query<IMessage[], IChatHistoryParams>({
      query: ({ userId1, userId2 }) => ({
        url: `${MESSAGES_URL}/chat-history`,
        method: 'GET',
        params: { userId1, userId2 },
      }),
      providesTags: ['Messages'],
    }),

    // Mark messages as read
    markMessagesAsRead: builder.mutation<void, IMarkReadParams>({
      query: (data) => ({
        url: `${MESSAGES_URL}/read`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['UnreadCount'],
    }),

    // Get unread messages count
    getUnreadCount: builder.query<number, string>({
      query: (userId) => ({
        url: `${MESSAGES_URL}/unread/${userId}`,
        method: 'GET',
      }),
      providesTags: ['UnreadCount'],
    }),
  }),
});


export const {
  useGetContactsQuery,
  useSendMessageMutation,
  useGetChatHistoryQuery,
  useMarkMessagesAsReadMutation,
  useGetUnreadCountQuery,
} = messageApiSlice;

