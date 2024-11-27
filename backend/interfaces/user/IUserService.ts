import { IUser } from "../../types/user.types";
import { IUserInfo } from "../../types/userInfo.types";
import { IUserProfile } from "../../types/user.types";
import { ISubscriptionDetails } from "../../types/user.types";
import { IPlan, IPlanDocument } from "../../types/plan.types";
import { ILikeData,ILikeProfile } from "../../types/like.types";
// import { IVideoCall } from "../../types/videoCall.types";
// import { IMatch } from "../../types/match.types";

export interface IUserService {
    authenticateUser(email: string, password: string): Promise<IUser | null>;
    registerUser(userData:  Partial<IUser>): Promise<IUser | null>;
    getUserById(userId:string):Promise<IUser>;
    resendOTP(email: string): Promise<{ success: boolean; message: string }>;
    verifyOTP(email: string, otp: string): Promise<boolean>;
    requestPasswordReset(email: string): Promise<void>;
    resetPassword(token: string, password: string): Promise<void>;
    createUserInfo(userInfoData: IUserInfo): Promise<IUserInfo | null>;
    getMatchedUsers(userId: string): Promise<IUserProfile[] | null>;
    getUserProfile(userId: string): Promise<{ user: IUser | null; userInfo: IUserInfo|null; }>;
    updateUserPersonalInfo(userId: string, data: IUser): Promise<IUser | null>;
    updateUserSubscription(userId: string, subscriptionData: ISubscriptionDetails): Promise<IUser | null>;
    updateUserDatingInfo(userId: string, data: IUserInfo, files: Express.Multer.File[]): Promise<IUserInfo | null>;
    getUserSubscriptionDetails(userId: string): Promise<{ subscription: IUser['subscription']; plan: IPlan | null } | null>;
    fetchUserPlans(userId:string): Promise<IPlanDocument[]>;

    cancelSubscriptionPlan(userId:string): Promise<IUser | null>;
    handleHomeLikes(likesIds: ILikeData): Promise<{ match: boolean; message: string } | null>
    getSentLikesProfiles(userId: string): Promise<ILikeProfile[] | null>;
    getReceivedLikesProfiles(userId: string): Promise<ILikeProfile[] | null>;
    getmatchProfile(userId:string) : Promise<ILikeProfile[]>
    getReceivedLikesCount(user1Id:string) :Promise<number>;
//video call
// createVideoCallHistory(videoCallHistory: Partial<IVideoCall>): Promise<IVideoCall>;


}