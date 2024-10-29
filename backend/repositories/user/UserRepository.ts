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
        return await this.UserInfoModel.find({
            userId: { $ne: filters.userId },
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


}