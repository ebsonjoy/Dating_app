import { UpdateQuery } from 'mongoose';
import UserInfo from '../models/UserInfo';
import { IUserInfo } from '../models/UserInfo';
import User, { IUser } from '../models/User';

class UserInfoRepository {
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

    // async findUserInfoByUserId(userId: string): Promise<IUserInfo | null> {
    //     return await UserInfo.findOne({ userId });
    //   }

    async findUserPersonalInfo(userId:string, userPeronalData:UpdateQuery<IUser>):Promise<IUser | null>{
        return User.findByIdAndUpdate(userId,userPeronalData,{new:true});
    }

    async findUserDatingInfo(userId:string, userDatingData:UpdateQuery<IUserInfo>):Promise<IUserInfo | null>{
        return UserInfo.findByIdAndUpdate(userId,userDatingData,{new:true});
    }

    // async updateUserInfo(userId: string, userInfoData: Partial<IUserInfo>): Promise<IUserInfo | null> {
    //     return await UserInfo.findOneAndUpdate({ userId }, userInfoData, { new: true });
    //   }
}

export default new UserInfoRepository();
