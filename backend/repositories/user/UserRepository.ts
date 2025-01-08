import { injectable } from "inversify";
import mongoose from "mongoose";
import User from "../../models/User";
import UserInfo from "../../models/UserInfo";
import Like from "../../models/LikesModel";
import Match from "../../models/MatchModel";
import Plan from "../../models/PlanModel";
import Payment from "../../models/PaymentModel";
import Notification from "../../models/Notifications";
import Report from '../../models/reportModel'
import { IUserRepository } from "../../interfaces/user/IUserRepository";
import { IUser,IBlockedUserResponse,IUnblockedUserResponse } from "../../types/user.types";
import { IUserInfo, ILocation } from "../../types/userInfo.types";
import { IPlan, IPlanDocument } from "../../types/plan.types";
import { ILikeData,ILike} from "../../types/like.types";
import { IMatch } from "../../types/match.types";
import {IPaymentCreate } from "../../types/payment.types";
import Article from "../../models/Article";
import AdviceCategory from "../../models/AdviceCategory";
import { IAdviceCategory, IArticle } from "../../types/advice.types";
import { INotification } from "../../types/notification.types";
import { IReport } from "../../types/report.types";





@injectable()
export class UserRepository  implements IUserRepository {
    constructor(
        private readonly UserModel = User,
        private readonly UserInfoModel = UserInfo,
        private readonly LikesModel = Like,
        private readonly MatchModel = Match,
        private readonly PlanModel = Plan,
        private readonly PaymentModel = Payment,
        private readonly AdviceCategoryModel = AdviceCategory,
        private readonly ArticleModel = Article,
        private readonly NotificationModel = Notification,
        private readonly reportModel = Report,
       
    ){}
   
    async findByEmail(email: string): Promise<IUser | null> {
        try {
            return await this.UserModel.findOne({ email });
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw new Error('Failed to find user by email');
        }
    }
    
    async register(userData: IUser): Promise<IUser | null> {
        try {
            const user = new this.UserModel(userData);
            return await user.save();
        } catch (error) {
            console.error('Error registering user:', error);
            throw new Error('Failed to register user');
        }
    }
    

    async findById(userId: string): Promise<IUser | null> {
        try {
            return await this.UserModel.findById(userId);
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw new Error('Failed to find user');
        }
    }
    

    async update(userId: string, data: Partial<IUser>): Promise<IUser | null> {
        try {
            return await this.UserModel.findByIdAndUpdate(userId, { $set: data }, { new: true });
        } catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Failed to update user');
        }
    }
    
    async findUserInfo(userId: string): Promise<IUserInfo | null> {
        try {
            return await this.UserInfoModel.findOne({ userId });
        } catch (error) {
            console.error('Error finding user info:', error);
            throw new Error('Failed to find user info');
        }
    }
    
    async createUserInfo(userInfoData: IUserInfo): Promise<IUserInfo | null> {
        try {
            return await this.UserInfoModel.create(userInfoData);
        } catch (error) {
            console.error('Error creating user info:', error);
            throw new Error('Failed to create user info');
        }
    }
    async updateUserInfo(userId: string, data: Partial<IUserInfo>): Promise<IUserInfo | null> {
        try {
            return await this.UserInfoModel.findOneAndUpdate(
                { userId },
                { $set: data },
                { new: true }
            );
        } catch (error) {
            console.error('Error updating user info:', error);
            throw new Error('Failed to update user info');
        }
    }
    

    async findMatchedUsers(filters: {
        userId: mongoose.Types.ObjectId;
        gender: string;
        location: ILocation
    }): Promise<IUserInfo[] |null> {
        const earthRadius = 6371;
        const [longitude, latitude] = filters.location.coordinates;
        try {
             // Fetch liked user IDs
            const likedUsers = await this.LikesModel.find({ 
                likerId: filters.userId 
            }).select('likedUserId');

            const likedUserIds = likedUsers.map(like => like.likedUserId);
        return await this.UserInfoModel.find({
            userId: { $ne: filters.userId, $nin: likedUserIds},
            gender: filters.gender,
            location: {
                $geoWithin: {
                    $centerSphere: [[longitude, latitude], 80 / earthRadius],
                },
            },
        })
    } catch (error) {
        console.error('Error finding matched users:', error);
        throw new Error('Failed to find matched users');
    }
    }

    async getUserPlans(): Promise<IPlanDocument[]> {
        try {
          const activePlans = await this.PlanModel.find({ status: true });
          return activePlans;
        } catch (error) {
          console.error("Error fetching active user plans:", error);
          throw new Error("Failed to retrieve active user plans");
        }
      }

    async findUserPlanDetailsById(userId: string): Promise<{ subscription: IUser['subscription']; plan: IPlan | null } | null> {
        const user = await this.UserModel.findById(userId)
            .select('subscription') 
            .populate({
                path: 'subscription.planId',
                model: 'Plan',
            });
    
        if (!user) return null;
        const subscription = user.subscription;
        const plan = user.subscription.planId as IPlan | null; 
    
        return { subscription, plan };
    }

    async userReceivedLikesCount(user1Id: string): Promise<number> {
        try {
            const count = await this.LikesModel.countDocuments({ likedUserId: user1Id,status: "pending" });
          if (!count){
            return 0
          }
          return count;
        } catch (error) {
            console.error("Error fetching user received likes:", error);
            throw new Error("Failed to retrieve likes count");
        }
      }


    async findPlanById(id: string): Promise<IPlanDocument | null> {
        try {
          const plan = await this.PlanModel.findById(id).exec();
          if (!plan) throw new Error("Plan not found");
          return plan;
        } catch (error) {
          console.error("Error fetching plan by ID:", error);
          throw new Error("Failed to retrieve plan");
        }
      }

      async getPlansAbovePrice(minPrice: number): Promise<IPlanDocument[]> {
        try {
            return await this.PlanModel.find({ status: true, offerPrice: { $gt: minPrice } });
        } catch (error) {
            console.error("Error fetching plans above price:", error);
            throw new Error("Failed to retrieve plans");
        }
    }

    async cancelSubscriptionPlan(userId: string): Promise<IUser | null> {
        return await this.UserModel.findByIdAndUpdate(
          userId,
          {
            $set: {
              "subscription.isPremium": false,
              "subscription.planId": null,
              "subscription.planExpiryDate": null,
              "subscription.planStartingDate": null,
            },
          },
          { new: true } 
        );
      }

    async findExistingLike(likeData: ILikeData): Promise<ILike | null> {
        const { likerId, likedUserId } = likeData;
        return await this.LikesModel.findOne({ likerId, likedUserId });
    }
    async findReverseLike(likeData: ILikeData): Promise<ILike | null> {
        const { likerId, likedUserId } = likeData;
        return await this.LikesModel.findOne({ likerId: likedUserId, likedUserId: likerId });
    }
    

    async saveLike(likeData: ILikeData): Promise<void> {
        const { likerId, likedUserId } = likeData;
        await this.LikesModel.create({ likerId, likedUserId, status: "pending" });
    }

    async updateLikeStatus(likeData: ILikeData, status: "pending" | "matched"): Promise<void> {
        const { likerId, likedUserId } = likeData;
        await this.LikesModel.updateOne({ likerId, likedUserId }, { status });
    }

    async findSentLikes(likerId: string): Promise<ILikeData[]> {
        return this.LikesModel.find({ likerId,status: { $ne: "matched" } });
      }

      async findReceivedLikes(likedUserId: string): Promise<ILikeData[]> {
        return this.LikesModel.find({ likedUserId,status: { $ne: "matched" } });
      }

      async saveMatch(matchData: { user1Id: string; user2Id: string; matchDate: Date }): Promise<void> {
        await this.MatchModel.create(matchData);
    }

    async findMatchedProfileById(userId:string):Promise<IMatch[]>{
        return await this.MatchModel.find({
            $or: [
                { user1Id: userId },
                { user2Id: userId }
            ]
        })
    }

    async createPayment(paymentData: IPaymentCreate): Promise<void | null> {
         await this.PaymentModel.create(paymentData)
    }

    async paymentsCount():Promise<number>{
        return await this.PaymentModel.countDocuments()
    }

     async getAdviceCategory(): Promise<IAdviceCategory[] | null> {
        return await this.AdviceCategoryModel.find({isBlock:false})
    }

     async getArticleByCategoryId(categoryId: string): Promise<IArticle[] | null> {
        return await this.ArticleModel.find({ categoryId,isBlock:false}).exec();
    }

    async getArticleById(articleId: string): Promise<IArticle | null> {
        return await  this.ArticleModel.findById({ articleId,isBlock:false}).exec();
    }

    async createNotification(notification:INotification): Promise<INotification> {
        return await this.NotificationModel.create(notification)
    }

    async getNotifications(userId: string): Promise<INotification[]> {
        return await this.NotificationModel.find({userId})
    }

    async clearNotifications(userId: string): Promise<string> {
        const result = await this.NotificationModel.deleteMany({ userId });
    return result.deletedCount > 0 
        ? "Notifications successfully deleted." 
        : "No notifications found to delete.";
    }
    async userBlocked(userId: string, blockedUserId: string): Promise<IBlockedUserResponse | null> {
        try {
            const user = await this.UserModel.findByIdAndUpdate(
                userId,
                { $addToSet: { blockedUsers: blockedUserId } },
                { new: true }
            ).select('userId blockedUsers')
    
            if (!user) {
                return null
            }
    
            return {
                _id: user._id.toString(),
                blockedUsers: user.blockedUsers,
            };
        } catch (error) {
            console.error('Error blocking user:', error);
            throw new Error('Failed to block user');
        }
    }
    async userUnblocked(userId: string, blockedUserId: string): Promise<IUnblockedUserResponse | null> {
        try {
            const user = await this.UserModel.findByIdAndUpdate(
                userId,
                { $pull: { blockedUsers: blockedUserId } },
                { new: true } 
            );
    
            if (!user) {
                return null
            }
    
            return{
                _id: user._id.toString(),
                blockedUsers: user.blockedUsers,
            };
        } catch (error) {
            console.error('Error blocking user:', error);
            throw new Error('Failed to block user');
        }
    }

    async createReport(reportData: IReport): Promise<IReport> {
        const report = new this.reportModel(reportData);
        return await report.save();
    }

  
}

