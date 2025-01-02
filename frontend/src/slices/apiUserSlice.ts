import { apiSlice } from "./apiSlice";
const USERS_URL = "/api/users";
const MESSAGES_URL = "/api/message";
import { 
  IMessage, 
  SendMessagePayload, 
  GetChatHistoryParams, 
  IChatHistory 
} from '../types/message.types';

import { ICallHistory } from "../types/videoCall.types";
import { ILoginData,IforgotPasswordData,IresetPasswordData,IOtp,IResendOtpData,IGoogleLogin,ILogin } from "../types/auth.types";
import { IRegisterData,IRegisterResponse,IUpdateUserData,IUserProfile,IUserProfileResponse } from "../types/user.types";
import { IPlansData,IpaymentData,IUserPlanDetails} from "../types/subscription.types";
import { ILike,ILikeProfiles,ILikesCount,ILikeResponse, IMatchProfile } from "../types/like.types";
import { IAdviceCategory,IArticle,INotification } from "../types/article.types";

// interface LoginData {
//   email: string;
//   password: string;
// }

// interface forgotPasswordData {
//   email : string
// }
// interface resetPasswordData{
//   password:string;
// }

// interface RegisterData {
//   name: string;
//   email: string;
//   mobileNumber: string;
//   password: string;
//   confirmPassword:string;
//   dateOfBirth: string;
// }

// interface RegisterResponse {
//   _id: string;
//   name: string;
//   email: string;
//   mobileNumber: string;
//   dateOfBirth: string;
//   otp: string;
// }

// interface UpdateUserData {
//   name?: string;
//   email?: string;
// }
// interface Otp{
//   otp:string;
//   emailId:string;
// }
// interface ResendOtpData {
//   emailId: string;
// }

// interface MyFormData {
  
//   gender: string;
//   lookingFor: string;
//   profilePhotos: string[];
//   relationship: string;
//   interests: string[];
//   occupation: string;
//   education: string;
//   bio: string;
//   smoking: string;
//   drinking: string;
//   location: {
//     latitude: number;
//     longitude: number;
//   };
//   caste: string;

// }

// interface UserProfile {
//   userId: string; 
//   name: string | undefined;
//   age: number | null;
//   gender: string;
//   lookingFor: string;
//   profilePhotos: string[];
//   relationship: string;
//   interests: string[];
//   occupation: string;
//   education: string;
//   bio: string;
//   smoking: boolean;
//   drinking: boolean;
//   place: string;
// }

// interface IUser {
//   _id: string;
//   name: string;
//   email: string;
//   dateOfBirth: string;
//   mobileNumber: string;
//   otp: string;
//   otpExpiresAt: string;
//   createdAt: string;
//   updatedAt: string;
//   status: boolean;
//   isPremium: boolean;
//   matches: number;
// }

// interface IUserInfo {
//   _id: string;
//   userId: string;
//   gender: string;
//   lookingFor: string;
//   profilePhotos: string[];
//   relationship: string;
//   interests: string[];
//   occupation: string;
//   education: string;
//   bio: string;
//   smoking: string;
//   drinking: string;
//   place: string;
//   caste: string;
// }


// interface IUserProfileResponse {
//   user: IUser;
//   userInfo: IUserInfo;
// }

// interface UpdateUserPersonalInfoArgs {
//   userId: string; 
//   data: RegisterResponse; 
// }

// interface PlansData{
//   _id: string;
//   planName: string;
//   duration: string;
//   offerPercentage: number;
//   actualPrice: number;
//   offerPrice: number;
//   offerName: string;
//   status:boolean;
//   features:string[];
// }
// interface paymentData{
//   isPremium: boolean;
//   planId:string;
//   planExpiryDate:Date;
//   planStartingDate:Date;
// }

// interface updateData {
  
//   gender: string;
//   lookingFor: string;
//   profilePhotos: string[];
//   relationship: string;
//   interests: string[];
//   occupation: string;
//   education: string;
//   bio: string;
//   smoking: string;
//   drinking: string;
//   place: string;
//   caste: string;

// }

// interface IUserSubscriptionResponse {
//   userId: string;
//   name: string;
//   email: string;
//   planStartingDate: Date; 
//   planExpiryDate: Date;
//   isPremium: boolean; 
//   planId: PlansData;
// }
// interface IUserPlanDetails{
//   subscription: IUserSubscriptionResponse;
//   plan: PlansData;
// }

// interface ILike{
//   likerId:string;
//   likedUserId:string;
// }

// interface ILikeProfile {
//   id:string;
//   name: string;
//   dateOfBirth: string;
//   place: string;
//   profilePhotos: string[];
// }

// interface ILikesCount{
//   count: number
// }

// interface IAdviceCategory {
//   _id: string;
//   name: string;
//   description: string;
//   image: string;
//   isBlock: boolean;
// }

// interface IArticle {
//   _id: string;
//   title: string;
//   content: string;
//   image: string;
//   categoryId: string;
//   isBlock: boolean;
// }

// interface INotification {
//   userId: string;
//   type: string;     
//   message: string;  
//   createdAt?: Date; 
// }


export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ILogin, ILoginData>({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    googleLogin: builder.mutation<IGoogleLogin, { credential: string }>({
      query: (data) => ({
        url: `${USERS_URL}/auth/google`,
        method: 'POST',
        body: data,
      }),
    }),
    forgotPasswordRequesting: builder.mutation<void, IforgotPasswordData>({
      query: (data) => ({
        url: `${USERS_URL}/password-reset-request`,
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<void, { data: IresetPasswordData; token: string }>({
      query: ({data,token}) => ({
        url: `${USERS_URL}/reset-password/${token}`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation<IRegisterResponse, IRegisterData>({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: `${USERS_URL}/logoutUser`,
        method: "POST",
      }),
    }),

    refreshToken: builder.mutation<void, void>({
      query: () => ({
        url: `${USERS_URL}/refresh-token`,
        method: "POST",
      }),
    }),

    updateUser: builder.mutation<IRegisterResponse, IUpdateUserData>({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    
    verifyOtp: builder.mutation<void, IOtp>({
      query: (data) => ({
        url: `${USERS_URL}/verifyOtp`,
        method: "POST",
        body: data,
      }),
    }),
    resendOtp: builder.mutation<void, IResendOtpData>({
      query: (data) => ({
        url: `${USERS_URL}/resendOtp`,
        method: "POST",
        body: data,
      }),
    }),
    createUserInfo: builder.mutation<void, FormData>({      
      query: (data) => ({
        url: `${USERS_URL}/userInfoSignUp`,
        method: "POST",
        body: data,
      }),
    }),
    getUsersProfiles: builder.query<IUserProfile[], string>({  
      query: (userId) => `${USERS_URL}/getHomeUsersProfiles/${userId}`,
    }),

    getUserProfile: builder.query<IUserProfileResponse, string>({
      query: (userId) => `${USERS_URL}/getUserProfile/${userId}`,
    }),

    getUserDetails : builder.query<IUserProfile[], string>({
      query:(userId)=> `${USERS_URL}/getUserDetails/${userId}`
    }),

    updateUserPersonalInfo: builder.mutation<IRegisterResponse,{ data: FormData; userId: string }>({
      query: ({ userId,data }) => ({
        url: `${USERS_URL}/updatePersonalInfo/${userId}`,
        method: 'PUT',
        body: data, 
      }),
    }),

    updateUserDatingInfo: builder.mutation<void,{data:FormData,userId:string}>({
      query: ({ data, userId }) => ({
        url: `${USERS_URL}/updateDatingInfo/${userId}`,
        method: 'PUT',
        body: data, 
      }),
    }),

    // plans

    getUserPlans:builder.query<IPlansData[],string>({
      query:(userId)=>`${USERS_URL}/getUserPlans/${userId}`,
    }),

    //payment

    updateUserSubscription: builder.mutation<void,{data:IpaymentData,userId:string}>({
      query: ({ data, userId }) => ({
        url: `${USERS_URL}/updateUserSubscription/${userId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', 
      },
      body: JSON.stringify(data),
      }),
    }),
    //detials for subscription
    getUserPlanDetails: builder.query<IUserPlanDetails, string>({  
      query: (userId) => `${USERS_URL}/getUserPlanDetails/${userId}`,
    }),

    cancelSubscription: builder.mutation<void, string>({
      query: (userId) => ({
        url: `${USERS_URL}/cancelUserPlan/${userId}`,
        method: 'PUT',
      }),
    }),
    handleHomeLikes: builder.mutation<ILikeResponse, ILike>({
      query: (data) => ({
        url: `${USERS_URL}/handleHomeLikes`,
        method: "POST",
        body: data,
      }),
    }),
    getSentLikeProfiles: builder.query<ILikeProfiles[], string>({  
      query: (userId) => `${USERS_URL}/sentLikes/${userId}`,
    }),
    getReceivedLikeProfiles: builder.query<ILikeProfiles[], string>({  
      query: (userId) => `${USERS_URL}/receivedLikes/${userId}`,
    }),
    getMatchProfiles: builder.query<IMatchProfile[], string>({  
      query: (userId) => `${USERS_URL}/getMathProfiles/${userId}`,
    }),
    getReceivedLikesCount: builder.query<ILikesCount, string>({  
      query: (userId) => `${USERS_URL}/getReceivedLikesCount/${userId}`,
    }),


    //Message

    sendMessage: builder.mutation<IMessage, SendMessagePayload>({
      query: (messageData) => ({
        url: `${MESSAGES_URL}/messages/${messageData.receiverId}`,
        method: 'POST',
        body: messageData
      }),
    }),

    markMessagesAsRead: builder.mutation<void, { userId: string; senderId: string }>({
      query: (body) => ({
        url: `${MESSAGES_URL}/mark-message-read`,
        method: 'POST',
        body
      }),
    }),
    
    getUnreadMessageCount: builder.query<{ [key: string]: number }, string>({
      query: (userId) => `${MESSAGES_URL}/message-unread-count?userId=${userId}`
    }),
    getChatHistory: builder.query<IChatHistory, GetChatHistoryParams>({
      query: ({ userId1, userId2 }) => ({
        url: `${MESSAGES_URL}/chat-history?userId1=${userId1}&userId2=${userId2}`
      }),
    }),
    //video call 

    createVideoCall: builder.mutation<void, ICallHistory>({
      query: (data) => ({
        url: `${MESSAGES_URL}/createCallHistory`,
        method: "POST",
        body: data,
      }),
    }),

    // advice

    getAdviceCategories: builder.query<IAdviceCategory[], void>({
      query: () => `${USERS_URL}/getAdviceCategory`,
    }),
    getArticlesByCategory: builder.query<IArticle[], string>({
      query: (categoryId) =>  `${USERS_URL}/getArticleByCategoryId/${categoryId}`,
    }),
    getArticleById: builder.query<IArticle, string>({
      query: (articleId) =>  `${USERS_URL}/getArticleById/${articleId}`,
    }),

    createNotification: builder.mutation<void, INotification>({
      query: (data) => ({
        url: `${MESSAGES_URL}/createNotification`,
        method: "POST",
        body: data,
      }),
    }),
    getNotification: builder.query<INotification[], string>({
      query: (userId) =>  `${USERS_URL}/getNotifications/${userId}`,
    }),

    clearNotification: builder.mutation<void, string>({
      query: (userId) => ({
        url:`${USERS_URL}/clearNotifications/${userId}`,
        method: 'DELETE',
      }),
    }),

    

  }),
});

export const {
  useLoginMutation,
  useGoogleLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useCreateUserInfoMutation,
  useGetUsersProfilesQuery,
  useForgotPasswordRequestingMutation,
  useResetPasswordMutation,
  useGetUserProfileQuery,
  useUpdateUserPersonalInfoMutation,
  useUpdateUserDatingInfoMutation,
  useGetUserPlansQuery,
  useUpdateUserSubscriptionMutation,
  useGetUserPlanDetailsQuery,
  useHandleHomeLikesMutation,
  useGetSentLikeProfilesQuery,
  useGetReceivedLikeProfilesQuery,
  useGetMatchProfilesQuery,
  useCancelSubscriptionMutation,
  useGetReceivedLikesCountQuery,
  useSendMessageMutation, 
  useGetChatHistoryQuery,
  useCreateVideoCallMutation,
  useGetUserDetailsQuery,
  useGetAdviceCategoriesQuery, 
  useGetArticlesByCategoryQuery,
  useGetArticleByIdQuery,
  useCreateNotificationMutation,
  useGetNotificationQuery,
  useClearNotificationMutation,
  useMarkMessagesAsReadMutation,
  useGetUnreadMessageCountQuery,

} = usersApiSlice;
