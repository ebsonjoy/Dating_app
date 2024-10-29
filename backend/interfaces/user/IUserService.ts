import { IUser } from "../../types/user.types";
import { IUserInfo } from "../../types/userInfo.types";
import { IUserProfile } from "../../types/user.types";
import { ISubscriptionDetails } from "../../types/user.types";

export interface IUserService {
    authenticateUser(email: string, password: string): Promise<IUser | null>;
    registerUser(userData:  Partial<IUser>): Promise<IUser | null>;
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
}