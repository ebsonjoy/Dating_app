import { apiSlice } from "./apiSlice";
const USERS_URL = "/api/users";
interface LoginData {
  email: string;
  password: string;
}

interface forgotPasswordData {
  email : string
}
interface resetPasswordData{
  password:string;
}

interface RegisterData {
  name: string;
  email: string;
  mobileNumber: string;
  password: string;
  confirmPassword:string;
  dateOfBirth: string;
}

interface RegisterResponse {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
  dateOfBirth: string;
  otp: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
}
interface Otp{
  otp:string;
  emailId:string;
}
interface ResendOtpData {
  emailId: string;
}

interface MyFormData {
  
  gender: string;
  lookingFor: string;
  profilePhotos: string[];
  relationship: string;
  interests: string[];
  occupation: string;
  education: string;
  bio: string;
  smoking: string;
  drinking: string;
  location: {
    latitude: number;
    longitude: number;
  };
  caste: string;

}

interface UserProfile {
  userId: string; 
  name: string | undefined;
  age: number | null;
  gender: string;
  lookingFor: string;
  profilePhotos: string[];
  relationship: string;
  interests: string[];
  occupation: string;
  education: string;
  bio: string;
  smoking: boolean;
  drinking: boolean;
  place: string;
}

interface IUser {
  _id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  mobileNumber: string;
  otp: string;
  otpExpiresAt: string;
  createdAt: string;
  updatedAt: string;
  status: boolean;
  isPremium: boolean;
  matches: number;
}

interface IUserInfo {
  _id: string;
  userId: string;
  gender: string;
  lookingFor: string;
  profilePhotos: string[];
  relationship: string;
  interests: string[];
  occupation: string;
  education: string;
  bio: string;
  smoking: string;
  drinking: string;
  place: string;
  caste: string;
}


interface IUserProfileResponse {
  user: IUser;
  userInfo: IUserInfo;
}

interface UpdateUserPersonalInfoArgs {
  userId: string; 
  data: RegisterResponse; 
}

interface PlansData{
  _id: string;
  planName: string;
  duration: string;
  offerPercentage: number;
  actualPrice: number;
  offerPrice: number;
  offerName: string;
  status:boolean;
}
interface paymentData{
  isPremium: boolean;
  planId:string;
  planExpiryDate:Date;
  planStartingDate:Date;
}

interface updateData {
  
  gender: string;
  lookingFor: string;
  profilePhotos: string[];
  relationship: string;
  interests: string[];
  occupation: string;
  education: string;
  bio: string;
  smoking: string;
  drinking: string;
  place: string;
  caste: string;

}

interface IUserSubscriptionResponse {
  userId: string;
  name: string;
  email: string;
  planStartingDate: Date; 
  planExpiryDate: Date;
  isPremium: boolean; 
  planId: PlansData;
}
interface IUserPlanDetails{
  subscription: IUserSubscriptionResponse;
  plan: PlansData;
}
interface ILike{
  likerId:string;
  likedUserId:string;
}

interface ILikeProfile {
  id:string;
  name: string;
  dateOfBirth: string;
  place: string;
  profilePhotos: string[];
}
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ token: string }, LoginData>({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    googleLogin: builder.mutation<{ token: string }, { credential: string }>({
      query: (data) => ({
        url: `${USERS_URL}/auth/google`,
        method: 'POST',
        body: data,
      }),
    }),
    forgotPasswordRequesting: builder.mutation<void, forgotPasswordData>({
      query: (data) => ({
        url: `${USERS_URL}/password-reset-request`,
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<void, { data: resetPasswordData; token: string }>({
      query: ({data,token}) => ({
        url: `${USERS_URL}/reset-password/${token}`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation<RegisterResponse, RegisterData>({
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

    updateUser: builder.mutation<RegisterResponse, UpdateUserData>({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    
    verifyOtp: builder.mutation<void, Otp>({
      query: (data) => ({
        url: `${USERS_URL}/verifyOtp`,
        method: "POST",
        body: data,
      }),
    }),
    resendOtp: builder.mutation<void, ResendOtpData>({
      query: (data) => ({
        url: `${USERS_URL}/resendOtp`,
        method: "POST",
        body: data,
      }),
    }),
    createUserInfo: builder.mutation<void, MyFormData>({      
      query: (data) => ({
        url: `${USERS_URL}/userInfoSignUp`,
        method: "POST",
        body: data,
      }),
    }),
    getUsersProfiles: builder.query<UserProfile[], string>({  
      query: (userId) => `${USERS_URL}/getHomeUsersProfiles/${userId}`,
    }),

    getUserProfile: builder.query<IUserProfileResponse, string>({
      query: (userId) => `${USERS_URL}/getUserProfile/${userId}`,
    }),

    updateUserPersonalInfo: builder.mutation<RegisterResponse,UpdateUserPersonalInfoArgs>({
      query: ({ userId,data }) => ({
        url: `${USERS_URL}/updatePersonalInfo/${userId}`,
        method: 'PUT',
        body: data, 
      }),
    }),

    updateUserDatingInfo: builder.mutation<updateData,{data:updateData,userId:string}>({
      query: ({ data, userId }) => ({
        url: `${USERS_URL}/updateDatingInfo/${userId}`,
        method: 'PUT',
        body: data, 
      }),
    }),

    // plans

    getUserPlans:builder.query<PlansData,void>({
      query:()=>`${USERS_URL}/getUserPlans`,
    }),

    //payment

    updateUserSubscription: builder.mutation<void,{data:paymentData,userId:string}>({
      query: ({ data, userId }) => ({
        url: `${USERS_URL}/updateUserSubscription/${userId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // Add this line
      },
      body: JSON.stringify(data),
      }),
    }),
    //detials for subscription
    getUserPlanDetails: builder.query<IUserPlanDetails, string>({  
      query: (userId) => `${USERS_URL}/getUserPlanDetails/${userId}`,
    }),
    handleHomeLikes: builder.mutation<void, ILike>({
      query: (data) => ({
        url: `${USERS_URL}/handleHomeLikes`,
        method: "POST",
        body: data,
      }),
    }),
    getSentLikeProfiles: builder.query<ILikeProfile, string>({  
      query: (userId) => `${USERS_URL}/sentLikes/${userId}`,
    }),
    getReceivedLikeProfiles: builder.query<ILikeProfile, string>({  
      query: (userId) => `${USERS_URL}/receivedLikes/${userId}`,
    }),
    getMatchProfiles: builder.query<ILikeProfile, string>({  
      query: (userId) => `${USERS_URL}/getMathProfiles/${userId}`,
    }),
  }),
});

export const {
  useLoginMutation,
  useGoogleLoginMutation,
  useLogoutMutation,
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
} = usersApiSlice;
