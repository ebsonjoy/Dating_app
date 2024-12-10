import { inject,injectable } from "inversify";
import { IUserService } from "../../interfaces/user/IUserService";
import { IUserRepository } from "../../interfaces/user/IUserRepository";
import { generateOTP,sendOTP } from "../../utils/userOtp";
import { sendResetEmail } from "../../utils/resetGmail";
import { IUserInfo, UserInfoUpdate } from "../../types/userInfo.types";
import { IUser, IUserProfile } from "../../types/user.types";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
// import Plan from "../../models/PlanModel";
import { calculateAge } from "../../utils/calculateAge";
import { ISubscriptionDetails } from "../../types/user.types";
import mongoose from "mongoose";
import { IPlan, IPlanDocument } from "../../types/plan.types";
import { deleteImageFromS3 } from "../../config/multer";
import { ILikeData, ILikeProfile } from "../../types/like.types";
import { calculateExpiryDate } from "../../utils/calculateExpDate";
// import { IPayment,CreatePaymentInput } from "../../types/payment.types";



@injectable()
export class UserService implements IUserService {
    constructor(
        @inject('IUserRepository') private userRepository : IUserRepository
    ){}
    async authenticateUser(email: string, password: string): Promise<IUser | null> {
        try{
        const user = await this.userRepository.findByEmail(email);
        if (user && (await user.matchPassword(password))) {
            return user;
        }
        return null;
    }catch(error){
        console.log(error);
         throw new Error('Failed to autheticate user');
    }
    }
    // async registerUser(userData: IUser): Promise<IUser | null> {

    //     try {
    //         const otp = generateOTP();
    //         const otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000);
    //         const user = await this.userRepository.register({
    //             ...userData,
    //             otp,
    //             otpExpiresAt
    //         });
    
    //         await sendOTP(userData.email, otp);
    //         return user;
    //     } catch (error) {
    //         console.log(error);
    //         throw new Error('Failed to register user');
    //     }
    // }


    async registerUser(userData: IUser): Promise<IUser | null> {
        const planId = '675315d8356f388bd2d2844e';
    
        let dataToUpdate: Partial<IUser> | null = null;
    
        try {
            const currentPlan = await this.userRepository.findPlanById(planId);
    
            if (currentPlan) {
                dataToUpdate = {
                    subscription: {
                        isPremium: true,
                        planId: currentPlan._id ? new mongoose.Types.ObjectId(planId) : null,
                        // planExpiryDate: calculateExpiryDate(currentPlan.duration),
                        planExpiryDate:  new Date(Date.now() + 2 * 60 * 1000),
                        planStartingDate: new Date(),
                    },
                };
            }
    
            const otp = generateOTP();
            const otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000); 
            const user = await this.userRepository.register({
                ...userData,
                otp,
                otpExpiresAt,
            });
    
            if (!user) {
                throw new Error('User registration failed');
            }
    
            await sendOTP(userData.email, otp);
    
            if (dataToUpdate) {
                await this.userRepository.update(user._id.toString(), dataToUpdate);
            }
    
            return user;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to register user');
        }
    }

    async getUserById(userId: string): Promise<IUser> {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            console.log(error);
            throw new Error('Failed to Fetch user');
        }
    }
    

    async resendOTP(email: string): Promise<{ success: boolean; message: string }> {
        try {
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                return { success: false, message: 'User not found' };
            }
    
            const otp = generateOTP();
            const otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000);
    
            await this.userRepository.update(user._id.toString(), { otp, otpExpiresAt });
            await sendOTP(email, otp);
    
            return { success: true, message: 'OTP sent successfully' };
        } catch (error) {
            console.log(error);
            return { success: false, message: 'Failed to resend OTP' };
        }
    }
    

    async verifyOTP(email: string, otp: string): Promise<boolean> {
        try {
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                throw new Error('User not found');
            }
        
            if (user.otp !== otp) {
                throw new Error('Invalid OTP');
            }
        
            if (new Date() > user.otpExpiresAt) {
                throw new Error('OTP has expired');
            }
        
            return true;
        } catch (error) {
            console.log(error);
            throw new Error('Failed to verify OTP');
        }
    }
    
    async requestPasswordReset(email: string): Promise<void> {
        try {
            const user = await this.userRepository.findByEmail(email);
            if (!user) throw new Error('User Not Found');
        
            const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
            const expDate = new Date(Date.now() + 3600000); 
            await this.userRepository.update(user._id.toString(), { resetPassword: { token: resetToken, expDate, lastResetDate: new Date() } });
        
            const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
            await sendResetEmail(user.email, resetLink);
        } catch (error) {
            console.log(error);
            throw new Error('Failed to request password reset');
        }
    }
    
    
    async resetPassword(token: string, newPassword: string): Promise<void> {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
            const user = await this.userRepository.findById(decoded.userId);
            if (!user || user.resetPassword.token !== token) throw new Error('Invalid or expired token');
            if (user.resetPassword.expDate && user.resetPassword.expDate < new Date()) {
                throw new Error('Reset token expired');
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await this.userRepository.update(user._id.toString(), {
                password: hashedPassword,
                resetPassword: { ...user.resetPassword, lastResetDate: new Date(), token: null, expDate: null },
            });
        } catch (error) {
            console.log(error);
            throw new Error('Failed to reset password');
        }
    }
    

    async createUserInfo(userInfoData: IUserInfo): Promise<IUserInfo | null> {  
        try {
            return await this.userRepository.createUserInfo(userInfoData);
        } catch (error) {
            console.log(error);
            throw new Error('Failed to create user info');
        }
    }
    

    async getMatchedUsers(userId: string): Promise<IUserProfile[]> {
         try {
        const loggedInUserInfo = await this.userRepository.findUserInfo(userId)
        if (!loggedInUserInfo) {
            return [];
        }
        const { lookingFor, location } = loggedInUserInfo;

        const matchedUserInfos = await this.userRepository.findMatchedUsers({
            userId: new mongoose.Types.ObjectId(userId),
            gender: lookingFor,
            location,
        });

        if (!matchedUserInfos) {
            return [];
        }
      
        const matchedUsersWithDetails = await Promise.all(
            matchedUserInfos.map(async (userInfo) => {
                const user = await this.userRepository.findById(userInfo.userId.toString());
                return {
                  userId: userInfo.userId.toString(), 
                  name: user?.name || 'Unknown',
                  age: calculateAge(user?.dateOfBirth ? new Date(user.dateOfBirth) : undefined),
                  gender: userInfo.gender,
                  lookingFor: userInfo.lookingFor,
                  profilePhotos: userInfo.profilePhotos,
                  relationship: userInfo.relationship,
                  interests: userInfo.interests,
                  occupation: userInfo.occupation,
                  education: userInfo.education,
                  bio: userInfo.bio,
                  smoking: userInfo.smoking,
                  drinking: userInfo.drinking,
                   place: userInfo.place,
                } as unknown as IUserProfile ;
            })
        );
      
        return matchedUsersWithDetails
    } catch (error) {
        console.log(error);
        throw new Error('Failed to get matched users');
    }
    }
    async getUserProfile(userId: string): Promise<{ user: IUser | null; userInfo: IUserInfo | null; }> {
        try {
            const user = await this.userRepository.findById(userId);
            const userInfo = await this.userRepository.findUserInfo(userId);
            return { user, userInfo };
        } catch (error) {
            console.log(error);
            throw new Error('Failed to get user profile');
        }
    }

    async getUserDetails(userId: string): Promise<IUserProfile[]> {
        try {
          // Fetch the user's basic information
          const user = await this.userRepository.findById(userId);
          if (!user) {
            return []; // Return an empty array if the user is not found
          }
      
          // Fetch user's extended profile information
          const userInfo = await this.userRepository.findUserInfo(userId);
          if (!userInfo) {
            return []; // Return an empty array if extended profile info is not found
          }
      
          // Combine the user's basic and extended profile information
          const matchedUsersWithDetails = [
              {
                  userId: userId,
                  name: user.name || 'Unknown',
                  age: calculateAge(user.dateOfBirth ? new Date(user.dateOfBirth) : undefined),
                  gender: userInfo.gender || 'Not specified',
                  lookingFor: userInfo.lookingFor,
                  profilePhotos: userInfo.profilePhotos || [],
                  relationship: userInfo.relationship || 'Not specified',
                  interests: userInfo.interests || [],
                  occupation: userInfo.occupation || 'Not specified',
                  education: userInfo.education || 'Not specified',
                  bio: userInfo.bio || 'Not specified',
                  smoking: userInfo.smoking || 'Not specified',
                  drinking: userInfo.drinking || 'Not specified',
                  place: userInfo.place || 'Not specified',
              },
          ] as unknown as IUserProfile[]; // Ensure this is typed correctly as an array
      
          return matchedUsersWithDetails; // Return the array containing one user
        } catch (error) {
          console.error(error);
          throw new Error('Failed to get user details');
        }
      }
      
      



    async fetchUserPlans(userId:string): Promise<IPlanDocument[]> {
        try {

            const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        if (!user.subscription.isPremium || !user.subscription.planId) {
            return await this.userRepository.getUserPlans();
        }

        const currentPlan = await this.userRepository.findPlanById(user.subscription.planId.toString());
        if (!currentPlan) {
            throw new Error("Current plan not found");
        }

        return await this.userRepository.getPlansAbovePrice(currentPlan.offerPrice);


          
        } catch (error) {
            console.log(error);
            throw new Error('Failed to fetch user plans');
        }
    }



    async getUserSubscriptionDetails(userId: string): Promise<{ subscription: IUser['subscription']; plan: IPlan | null } | null> {
        const user = await this.userRepository.findUserPlanDetailsById(userId);
        
        if (!user || !user.subscription) {
            return null;
        }

        const { subscription } = user;
        const plan = subscription.planId as IPlan | null; 

        return { subscription, plan };
    }

    async cancelSubscriptionPlan(userId: string): Promise<IUser | null> {
        const user = await this.userRepository.cancelSubscriptionPlan(userId);
        if (!user) {
          throw new Error("User not found or subscription cancellation failed.");
        }
        return user;
      }

    async updateUserPersonalInfo(userId: string, data: IUser): Promise<IUser | null> {
        try {
            const updatedPersonalInfo = await this.userRepository.update(userId, data);
            if (!updatedPersonalInfo) {
                throw new Error('Failed to update user personal Data');
            }
            return updatedPersonalInfo;
        } catch (error) {
            console.log(error);
            throw new Error('Failed to update user personal Data');
        }
    }
    

    async updateUserSubscription(userId: string, subscriptionData: ISubscriptionDetails): Promise<IUser | null> {
        try {

            const dataToUpdate: Partial<IUser> = {
                subscription: {
                    isPremium: subscriptionData.isPremium,
                    planId: subscriptionData.planId ? new mongoose.Types.ObjectId(subscriptionData.planId) : null,
                    planExpiryDate: subscriptionData.planExpiryDate,
                    planStartingDate: subscriptionData.planStartingDate,
                },
            };
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new Error(`User not found for ID: ${userId}`);
            }
    
            const plan = await this.userRepository.findPlanById(subscriptionData.planId.toString());
            if (!plan) {
                throw new Error(`Plan not found for ID: ${subscriptionData.planId}`);
            }

            const count = await this.userRepository.paymentsCount()
            const paymentCount = count === null ? 0 : count;
            const paymentId = (paymentCount + 1).toString().padStart(4, '0');

            const paymentData = {
                paymentId,
                userName : user.name,
                planName:plan.planName,
                amount : plan.offerPrice,
                userId: new mongoose.Types.ObjectId(userId),
                planId: new mongoose.Types.ObjectId(subscriptionData.planId),
            }
            if (!paymentData.userName || !paymentData.planName || !paymentData.amount) {
                throw new Error('Invalid payment data');
            }
                await this.userRepository.createPayment(paymentData);
            return await this.userRepository.update(userId, dataToUpdate);
        } catch (error) {
            console.log(error);
            throw new Error('Failed to update user subscription');
        }
    }
    

    async updateUserDatingInfo(userId: string, data: UserInfoUpdate, uploadedPhotos: Express.MulterS3.File[]): Promise<IUserInfo | null> {
        try {
        const currentUserInfo = await this.userRepository.findUserInfo(userId);
        if (!currentUserInfo) {
            throw new Error('User info not found');
        }
        const imgIndex = data.imgIndex && data.imgIndex.trim() !== '' ? data.imgIndex.split(',').map(Number) : [];  
        if(imgIndex.length>0){
            imgIndex.forEach((index:number, i:number)=>{
                deleteImageFromS3(currentUserInfo.profilePhotos[index])
                currentUserInfo.profilePhotos[index] = uploadedPhotos[i].location
            })
        }
        imgIndex.length = 0;
        const updatedData:UserInfoUpdate = {
            gender: data.gender,
            lookingFor: data.lookingFor,
            relationship: data.relationship,
            interests: data.interests.toString().split(', '), 
            occupation: data.occupation,
            education: data.education,
            bio: data.bio,
            smoking: data.smoking,
            drinking: data.drinking,
            place: data.place,
            location: data.location,
            caste: data.caste,
            profilePhotos: currentUserInfo.profilePhotos,
          };
  return await this.userRepository.updateUserInfo(userId,updatedData)
} catch (error) {
    console.log(error);
    throw new Error('Failed to update user dating info');
}

}  
async handleHomeLikes(likesIds: ILikeData): Promise<{ match: boolean; message: string } | null> {
    const { likerId, likedUserId } = likesIds;

    const existingLike = await this.userRepository.findExistingLike({ likerId, likedUserId });
    if (existingLike) {
        return { match: false, message: "You have already liked this profile." };
    }

    const reverseLike = await this.userRepository.findReverseLike({ likerId, likedUserId });
    if (reverseLike) {
        await this.userRepository.updateLikeStatus({ likerId, likedUserId }, "matched");
        await this.userRepository.updateLikeStatus({ likerId: likedUserId, likedUserId: likerId }, "matched");
        await this.userRepository.saveMatch({ user1Id: likerId.toString(), user2Id: likedUserId.toString(), matchDate: new Date() });
        return { match: true, message: "You have a new match!" };

    }else{
        await this.userRepository.saveLike({ likerId, likedUserId });
        return { match: false, message: "You liked the profile!" };
    }
  }

  async getReceivedLikesCount(userId: string): Promise<number> {
    try {
        const count = await this.userRepository.userReceivedLikesCount(userId);
        return count;
    } catch (error) {
        console.error("Error in LikeService:", error);
        throw new Error("Unable to fetch received likes count");
    }
}


  //..................................................

  async getSentLikesProfiles(userId: string): Promise<ILikeProfile[]> {
    const sentLikes = await this.userRepository.findSentLikes(userId);

    const profiles = await Promise.all(
      sentLikes.map(async (like) => {
        const user = await this.userRepository.findById(like.likedUserId.toString());
        const userInfo = await this.userRepository.findUserInfo(like.likedUserId.toString());

        if (user && userInfo) {
          return {
            id:user._id,
            name: user.name,
            age: user.dateOfBirth,
            place: userInfo.place,
            image: userInfo.profilePhotos,
          };
        }
        return null;
      })
    );

    return profiles.filter((profile) => profile !== null) as unknown as ILikeProfile[];
  }


  async getReceivedLikesProfiles(userId: string): Promise<ILikeProfile[]> {
    const receivedLikes = await this.userRepository.findReceivedLikes(userId);

    const profiles = await Promise.all(
      receivedLikes.map(async (like) => {
        const user = await this.userRepository.findById(like.likerId.toString());
        const userInfo = await this.userRepository.findUserInfo(like.likerId.toString());

        if (user && userInfo) {
          return {
            id:user._id,
            name: user.name,
            age: user.dateOfBirth,
            place: userInfo.place,
            image: userInfo.profilePhotos,
          };
        }
        return null;
      })
    );

    return profiles.filter((profile) => profile !== null) as unknown as ILikeProfile[];
  }



  async getmatchProfile(userId:string) : Promise<ILikeProfile[]>{

    const profiles = await this.userRepository.findMatchedProfileById(userId)

    
    const matchedProfiles = await Promise.all(

        profiles.map(async (match) => {
            const id = match.user1Id.toString() == userId ? match.user2Id : match.user1Id
        const user = await this.userRepository.findById(id.toString());
        const userInfo = await this.userRepository.findUserInfo(id.toString());
        if (user && userInfo) {
            return {
                id:user._id,
              name: user.name,
              age: user.dateOfBirth,
              place: userInfo.place,
              image: userInfo.profilePhotos,
            };
          }
          return null;
            
        })
        
    )
    return matchedProfiles.filter((profile) => profile !== null) as unknown as ILikeProfile[];

  }

}


