import UserInfo from '../models/UserInfo';
import { IUserInfo } from '../models/UserInfo';

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

    async updateUserInfo(userId: string, userInfoData: Partial<IUserInfo>): Promise<IUserInfo | null> {
        return await UserInfo.findOneAndUpdate({ userId }, userInfoData, { new: true });
      }
}

export default new UserInfoRepository();
