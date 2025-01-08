import { IUser,IBlockedUserResponse,IUnblockedUserResponse } from "../../types/user.types";
import { IUserInfo } from "../../types/userInfo.types";
import { UserInfoUpdate } from "../../types/userInfo.types";
import { IPlan, IPlanDocument } from "../../types/plan.types";
import { ILike, ILikeData } from "../../types/like.types";
import {IMatch} from '../../types/match.types'
import { IPaymentCreate } from "../../types/payment.types";
import { IAdviceCategory, IArticle } from "../../types/advice.types";
import { INotification } from "../../types/notification.types";
import { IReport } from "../../types/report.types";



export interface IUserRepository {
    findByEmail(email: string): Promise<IUser | null>;
    register(userData: Partial<IUser>): Promise<IUser | null>;
    findById(id: string): Promise<IUser | null>;
    update(id: string, data: Partial<IUser>): Promise<IUser | null>;
    findUserInfo(userId: string): Promise<IUserInfo | null>;
    createUserInfo(userInfoData: IUserInfo): Promise<IUserInfo | null>;
    cancelSubscriptionPlan(userId:string):Promise<IUser | null>
    getUserPlans(): Promise<IPlanDocument[]>;
    findPlanById(id: string): Promise<IPlanDocument | null>;
    getPlansAbovePrice(minPrice: number): Promise<IPlanDocument[]>;
    updateUserInfo(userId: string, data: UserInfoUpdate): Promise<IUserInfo | null>;
    findMatchedUsers(filters: Partial<IUserInfo>): Promise<IUserInfo[] | null>;
    findUserPlanDetailsById(userId: string): Promise<{ subscription: IUser['subscription']; plan: IPlan | null } | null>;
    findExistingLike(likeData: ILikeData):Promise<ILike | null>;
    saveLike(likeData: ILikeData): Promise<void>;
    findReverseLike(likeData: ILikeData):Promise<ILike | null>;
    updateLikeStatus(likeData: ILikeData, status: "pending" | "matched"): Promise<void>
    saveMatch(matchData: { user1Id: string; user2Id: string; matchDate: Date }): Promise<void>
    findSentLikes(likerId: string): Promise<ILikeData[]>;
    findReceivedLikes(likedUserId: string): Promise<ILikeData[]>;
    findMatchedProfileById(user1Id:string):Promise<IMatch[]>;
    userReceivedLikesCount(user1Id:string):Promise<number>;
    createPayment(paymentData:IPaymentCreate) : Promise<void | null>
    paymentsCount():Promise<number | null>
    getAdviceCategory():Promise<IAdviceCategory[] | null>
    getArticleByCategoryId(categoryId:string) : Promise<IArticle[] | null>
    getArticleById(articleId:string) : Promise<IArticle | null>
    createNotification(notication:INotification):Promise<INotification>
    getNotifications(userId:string):Promise<INotification[]>
    clearNotifications(userId:string):Promise<string>
    userBlocked(userId:string,blockedUserId:string):Promise<IBlockedUserResponse | null>
    userUnblocked(userId:string,blockedUserId:string):Promise<IUnblockedUserResponse | null>
    createReport(reportData: IReport): Promise<IReport>;
   

}
