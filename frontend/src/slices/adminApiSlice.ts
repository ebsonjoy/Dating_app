import { apiSlice } from "./apiSlice";

const ADMIN_URL = "/api/admin";
// const PLAN_URL = "/api/plans"
interface AdminLoginData {
  email: string;
  password: string;
  
}

interface AdminRegisterData {
  email: string;
  password: string;
}

interface AdminProfile {
  _id: string;
  email: string;
}

interface UsersData{
  _id:string
  name:string;
  email:string;
  mobileNumber:string;
  isPremium:boolean;
  status:boolean;
  matches:number;
}
interface UpdateStatusData{
  userId:string;
  newStatus:boolean;
}

interface UpdatePlanStatusData{
  planId:string;
  newStatus:boolean;
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
  features: string[];
}
interface UpdatePlanArgs {
  planId: string; 
  data: PlansData; 
}

interface IPayment {
  paymentId:string;
  userName: string;
  planName: string;
  amount: number;
  userId: string;
  planId: string;
  date?: Date;
}

export interface IDashboardMasterData{
  userCount : number;
  matchesCount : number;
  totalRevanue : number;
  premiumUsers : number;
}



export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Admin login
    loginAdmin: builder.mutation<{ token: string }, AdminLoginData>({
      query: (data) => ({
        url: `${ADMIN_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),

    // Admin registration
    registerAdmin: builder.mutation<{ message: string }, AdminRegisterData>({
      query: (data) => ({
        url: `${ADMIN_URL}/create`,
        method: "POST",
        body: data,
      }),
    }),

    // Admin logout
    logoutAdmin: builder.mutation<void, void>({
      query: () => ({
        url: `${ADMIN_URL}/logoutAdmin`,
        method: "POST",
      }),
    }),
    getAllUsers : builder.query<UsersData[], void>({
      query: () => ({
        url: `${ADMIN_URL}/getAllUsers`,
        method: "GET",
      }),
    }),

    updateUserStatus: builder.mutation<void, UpdateStatusData>({
      query: ({ userId, newStatus }) => ({
        url: `${ADMIN_URL}/updateUserStatus/${userId}`,
        method: "PUT",
        body: {newStatus }, 
      }),
    }),
    getAdminProfile: builder.query<AdminProfile, void>({
      query: () => `${ADMIN_URL}/profile`, 
    }),

    //plans

    updatePlanStatus: builder.mutation<void, UpdatePlanStatusData>({
      query: ({ planId, newStatus }) => ({
        url: `${ADMIN_URL}/updatePlanStatus/${planId}`,
        method: "PUT",
        body: {newStatus }, 
      }),
    }),

    getPlans:builder.query<PlansData,void>({
      query:()=>`${ADMIN_URL}/getAllPlans`,
    }),
    addPlan: builder.mutation<{ message: string }, PlansData>({
      query: (data) => ({
        url: `${ADMIN_URL}/createNewPlan`,
        method: "POST",
        body: data,
      }),
    }),
    getOnePlan: builder.query<PlansData, string>({
      query: (planId) => `${ADMIN_URL}/getOnePlan/${planId}`,
    }),
    updatePlan: builder.mutation<void, UpdatePlanArgs>({
      query: ({ planId, data }) => ({
        url: `${ADMIN_URL}/updatePlan/${planId}`,
        method: "PUT",
        body: data,
      }),
    }),
    getPayment : builder.query<IPayment[], void>({
      query: () => ({
        url: `${ADMIN_URL}/paymentDetails`,
        method: "GET",
      }),
    }),
    getDashBoardMasterData : builder.query<IDashboardMasterData, void>({
      query: () => ({
        url: `${ADMIN_URL}/dashBoardMasterData`,
        method: "GET",
      }),
    }),
  }),
});


export const {
  useLoginAdminMutation,
  useRegisterAdminMutation,
  useLogoutAdminMutation,
  useGetAdminProfileQuery,
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
  useGetPlansQuery,
  useAddPlanMutation,
  useGetOnePlanQuery,
  useUpdatePlanMutation,
  useUpdatePlanStatusMutation,
  useGetPaymentQuery,
  useGetDashBoardMasterDataQuery
} = adminApiSlice;
