import { injectable } from "inversify";
import { IUserRepository } from "../../interfaces/user/IUserRepository";
import { IUser } from "../../types/user.types";
import { IUserInfo, ILocation } from "../../types/userInfo.types";
import User from "../../models/User";
import UserInfo from "../../models/UserInfo";
import mongoose from "mongoose";
@injectable()
export class UserRepository  implements IUserRepository {
    constructor(
        private readonly UserModel = User,
        private readonly UserInfoModel = UserInfo
    ){}
   
    async findByEmail(email: string): Promise<IUser | null> {
        return this.UserModel.findOne({ email });
    }
    async register(userData: IUser): Promise<IUser | null> {
        const user = new this.UserModel(userData);
       return await user.save()
        // return this.UserModel.create({userData})
    }

    async findById(userId:string): Promise<IUser | null>{
        return this.UserModel.findById(userId)
    }

    async update(userId: string, data: Partial<IUser>): Promise<IUser | null> {
        return this.UserModel.findByIdAndUpdate(userId,{$set:data},{new:true})
    }

    async findUserInfo(userId: string): Promise<IUserInfo | null> {
        return this.UserInfoModel.findOne({userId});
    }

    async createUserInfo(userInfoData: IUserInfo): Promise<IUserInfo | null> {

        return this.UserInfoModel.create(userInfoData);
    }

    async updateUserInfo(userId: string, data:  Partial<IUserInfo>): Promise<IUserInfo | null> {
        return this.UserInfoModel.findOneAndUpdate(
            { userId },
            { $set: data },
            { new: true }
        );
    }

    async findMatchedUsers(filters: {
        userId: mongoose.Types.ObjectId;
        gender: string;
        location: ILocation
    }): Promise<IUserInfo[] |null> {
        
        const earthRadius = 6371;
        const [longitude, latitude] = filters.location.coordinates;
        return await this.UserInfoModel.find({
            userId: { $ne: filters.userId },
            gender: filters.gender,
            location: {
                $geoWithin: {
                    $centerSphere: [[longitude, latitude], 80 / earthRadius],
                },
            },
        })
    }


}