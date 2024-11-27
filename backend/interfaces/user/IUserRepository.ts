import { IUser } from "../../types/user.types";
import { IUserInfo } from "../../types/userInfo.types";
import { UserInfoUpdate } from "../../types/userInfo.types";
import { IPlan, IPlanDocument } from "../../types/plan.types";
import { ILike, ILikeData } from "../../types/like.types";
import {IMatch} from '../../types/match.types'
// import { IVideoCall } from "../../types/videoCall.types";


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

    //videocall
    // create(videoCallHistory: Partial<IVideoCall>): Promise<IVideoCall>;
    // findByUserId(userId: string, limit?: number): Promise<IVideoCall[]>;

    

   
}
