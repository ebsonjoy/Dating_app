import { ApiResponse, IUpdateReportStatus } from "../types/report.types";
import { IFetchPlanFeatures } from "../types/subscription.types";
import { apiSlice } from "./apiSlice";
const ADMIN_URL = "/api/admin";
// const PLAN_URL = "/api/plans"

interface AdminLoginData {
  email: string;
  password: string;
  
}
interface IAdmin {
  id: string;
  name: string;
  email: string;
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
  _id?: string;
  planName: string;
  duration: string;
  offerPercentage: number;
  actualPrice: number;
  offerPrice: number;
  offerName: string;
  status:boolean;
  features: string[];
}
interface CreatePlanData {
  planName: string;
  duration: string;
  offerPercentage: number;
  actualPrice: number;
  offerPrice: number;
  offerName: string;
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

export interface IAdviceCategory{
  name: string;
  description: string;
  image: string; 
  isBlock : boolean
}
// interface IAdviceCategoryFormData {
//   formData: FormData;
// }
export interface IArticle {
  title: string;
  image: string;
  content: string; 
  categoryId:string; 
  isBlock : boolean
}
interface IBlockAdviceCategory{
  categoryId:string;
  newStatus:boolean;
}

interface IBlockArticle{
  articleId:string;
  newStatus:boolean;
}

interface IAdviceCategoryUpdate{
  categoryId: string
  // name: string;
  // description: string;
  // image?: File
  formData: FormData;
}

export interface IArticleUpdate {
  articleId: string
  formData: FormData;
}

interface UserChartData {
  userGrowthData: { date: Date; count: number }[];
  totalUsers: number;
}

interface PaymentChartData {
  paymentGrowthData: { date: Date; amount: number }[];
  totalPayments: number;
}
interface UpdateUserStatusResponse {
  message: string;
  user: {
      _id: string;
      name: string;
      status: boolean;
  };
}

interface UpdatePlanStatusResponse {
  message: string;
  user: {
      _id: string;
      name: string;
      status: boolean;
  };
}


export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Admin login
    loginAdmin: builder.mutation<IAdmin &{ token: string }, AdminLoginData>({
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

    updateUserStatus: builder.mutation<UpdateUserStatusResponse, UpdateStatusData>({
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

    updatePlanStatus: builder.mutation<UpdatePlanStatusResponse, UpdatePlanStatusData>({
      query: ({ planId, newStatus }) => ({
        url: `${ADMIN_URL}/updatePlanStatus/${planId}`,
        method: "PUT",
        body: {newStatus }, 
      }),
    }),

    getPlans:builder.query<PlansData,void>({
      query:()=>`${ADMIN_URL}/getAllPlans`,
    }),
    addPlan: builder.mutation<{ message: string }, CreatePlanData>({
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

    //Advice
    // category

    getPresignedUrlsAdmin: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/getSignedUrlsAdmin`,
        method: 'POST',
        body: data
      }),
    }),

    getAdminAdviceCategories : builder.query<IAdviceCategory[], void>({
      query: () => ({
        url: `${ADMIN_URL}/getAdviceCategories`,
        method: "GET",
      }),
    }),
    addAdviceCategory: builder.mutation<{ message: string }, FormData>({
      query: (data) => ({
        url: `${ADMIN_URL}/createAdviceCategory`,
        method: "POST",
        body: data,
      }),
    }),
    blockAdviceCategory: builder.mutation<void, IBlockAdviceCategory>({
      query: ({ categoryId, newStatus }) => ({
        url: `${ADMIN_URL}/blockAdviceCategory/${categoryId}`,
        method: "PUT",
        body: {newStatus }, 
      }),
    }),
    getSingleAdviceCategory: builder.query<IAdviceCategory, string>({
      query: (categoryId) => `${ADMIN_URL}/getSingleAdviceCategory/${categoryId}`,
    }),

    updateAdviceCategory: builder.mutation<{ message: string }, IAdviceCategoryUpdate>({
      query: ({ categoryId,formData }) => ({
        url: `${ADMIN_URL}/updateAdviceCategory/${categoryId}`,
        method: "PUT",
        body: formData,
      }),
    }),

    //Article

    addArticle: builder.mutation<{ message: string }, FormData>({
      query: (data) => ({
        url: `${ADMIN_URL}/createArticle`,
        method: "POST",
        body: data,
      }),
    }),
    getArticles : builder.query<IArticle[], void>({
      query: () => ({
        url: `${ADMIN_URL}/getArticles`,
        method: "GET",
      }),
    }),

    blockArticle: builder.mutation<void, IBlockArticle>({
      query: ({ articleId, newStatus }) => ({
        url: `${ADMIN_URL}/blockArticle/${articleId}`,
        method: "PUT",
        body: {newStatus }, 
      }),
    }),
    getSingleArticle: builder.query<IArticle, string>({
      query: (articleId) => `${ADMIN_URL}/getSingleArticle/${articleId}`,
    }),

    updateArticle: builder.mutation<{ message: string }, IArticleUpdate>({
      query: ({ articleId,formData }) => ({
        url: `${ADMIN_URL}/updateArticle/${articleId}`,
        method: "PUT",
        body: formData,
      }),
    }),

    getUserChartData: builder.query<UserChartData, { timeRange: 'day' | 'month' | 'year' }>({
      query: ({ timeRange }) => ({
        url: `${ADMIN_URL}/dashboard/users`,
        method: "GET",
        params: { timeRange }
      }),
    }),
    getPaymentChartData: builder.query<PaymentChartData, { timeRange: 'day' | 'month' | 'year' }>({
      query: ({ timeRange }) => ({
        url: `${ADMIN_URL}/dashboard/payments`,
        method: "GET",
        params: { timeRange }
      }),
    }),
    getUserReports : builder.query<ApiResponse, void>({
      query: () => ({
        url: `${ADMIN_URL}/userReportWithMessages`,
        method: "GET",
      }),
    }),

    updateReportStatus : builder.mutation<void, IUpdateReportStatus>({
      query: ({ reportId, status }) => ({
        url: `${ADMIN_URL}/updateReportStatus/${reportId}`,
        method: "PUT",
        body: {status }, 
      }),
    }),

    fetchPlanFeatures : builder.query<IFetchPlanFeatures[],void>({
      query: ()=>({
        url: `${ADMIN_URL}/fetchPlanFeatures`,
        method : 'GET',
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
  useGetDashBoardMasterDataQuery,
  useGetAdminAdviceCategoriesQuery,
  useGetArticlesQuery,
  useAddAdviceCategoryMutation,
  useAddArticleMutation,
  useBlockAdviceCategoryMutation,
  useGetSingleAdviceCategoryQuery,
  useUpdateAdviceCategoryMutation,
  useBlockArticleMutation,
  useGetSingleArticleQuery,
  useUpdateArticleMutation,
  useGetPresignedUrlsAdminMutation,

  useGetUserChartDataQuery,
  useGetPaymentChartDataQuery,
  useGetUserReportsQuery,
  useUpdateReportStatusMutation,

  useFetchPlanFeaturesQuery,

} = adminApiSlice;
