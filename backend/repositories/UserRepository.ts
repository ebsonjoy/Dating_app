import { UpdateQuery } from 'mongoose';
import User from '../models/User';
import { IUser } from '../models/User';
import UserInfo, { IUserInfo } from '../models/UserInfo';  
import { ISubscriptionDetails } from '../types/userTypes';

class UserRepository {
    async findUserByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ email });
    }

    async createUser(userData: Partial<IUser>): Promise<IUser> {
        return await User.create(userData);
    }

    async findUserById(userId: string): Promise<IUser | null> {
        return await User.findById(userId).select('-password');
    }

    async findUserByOTP(email: string): Promise<IUser | null> {
        return await User.findOne({ email });
    }



    // Update OTP and expiration time
    async updateOTP(email: string, newOtp: string, otpExpiresAt: Date) {
        return User.updateOne(
            { email },
            { otp: newOtp, otpExpiresAt: otpExpiresAt }
        );
    }

    // resetPassword Updation
    async saveResetToken(userId: string, token: string,expDate: Date):Promise<void>{
        await User.findByIdAndUpdate(userId,{
      'resetPassword.token': token,
      'resetPassword.expDate': expDate,
      'resetPassword.lastResetDate': new Date(),
        })
    }

    // reset Password
    async resetPassword(userId : string, newPassword:string) :Promise<void>{
        await User.findByIdAndUpdate(userId,{
        password: newPassword,
      'resetPassword.token': null,
      'resetPassword.expDate': null,
        })
    }


    
    // Create user info
    async createUserInfo(userInfoData: IUserInfo): Promise<IUserInfo> {
      const userInfo = new UserInfo(userInfoData);
      return await userInfo.save();
    }

    // }
    async findUsersById(userId: string): Promise<IUser | null> {
        return await User.findById(userId).select('name dateOfBirth');
    }

    async findUserProfileById(userId:string):Promise<IUser | null>{
        return await User.findById(userId).select('name email mobileNumber dateOfBirth')
    }


    async updateUser(userId: string, userData: Partial<IUser>): Promise<IUser | null> {
        return await User.findByIdAndUpdate(userId, userData, { new: true });
      }
    
      // payment Updation
      async updateUserSubscription(userId:string,subscriptionDetails:ISubscriptionDetails):Promise<IUser | null>{
        return await User.findByIdAndUpdate(userId,{$set:subscriptionDetails} as UpdateQuery<IUser>,{new : true})
      }

      async findUserPlanDetals(userId:string):Promise<IUser | null>{
        return await User.findById(userId).select('isPremium planId planExpiryDate planStartingDate' )
      }


      // User info repo

    async findUserInfoByUserId(userId: string): Promise<IUserInfo | null> {
        return await UserInfo.findOne({ userId });
    }

    async findMatchedUsers(filters: {
        userId: string;
        gender: string;
        relationship: string;
        place: string;
    }): Promise<IUserInfo[]> {
        return await UserInfo.find({
            userId: { $ne: filters.userId },
            gender: filters.gender,
            relationship: filters.relationship,
            place: filters.place,
        });
    }


    async findUserPersonalInfo(userId:string, userPeronalData:UpdateQuery<IUser>):Promise<IUser | null>{
      return User.findByIdAndUpdate(userId,userPeronalData,{new:true});
  }

  async findUserDatingInfo(userId:string, userDatingData:UpdateQuery<IUserInfo>):Promise<IUserInfo | null>{
      return UserInfo.findByIdAndUpdate(userId,userDatingData,{new:true});
  }


}

export default new UserRepository();
