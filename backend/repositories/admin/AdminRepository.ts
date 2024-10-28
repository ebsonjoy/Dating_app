import { injectable } from "inversify";
import { IAdminRepository } from "../../interfaces/admin/IAdminRepository";
// import { IAdminService } from "../../interfaces/admin/IAdminService";
// import { Model } from "mongoose";
import { IAdmin } from "../../types/admin.types";
// import { BaseRepository } from "../base/BaseRepository";
import User from "../../models/User";
import Admin from "../../models/AdminModel";
import { IUser } from "../../types/user.types";

@injectable()
export class AdminRepository  implements IAdminRepository{
    constructor(
        private readonly adminModel = Admin,
        private readonly userModel = User
    ) {}


    async authenticate(email: string): Promise<IAdmin | null> {
        return this.adminModel.findOne({ email});
    }

    async create(email: string, password: string): Promise<void> {
        const admin = new this.adminModel({ email, password });
        await admin.save();
    }

    async findAllUsers(): Promise<IUser[]> {
        return this.userModel.find().select('name email mobileNumber isPremium matches status');
    }

    async updateUserStatus(userId: string, newStatus: boolean): Promise<IUser | null> {
        return this.userModel.findByIdAndUpdate(
            userId,
            { status: newStatus },
            { new: true }
        );
    }
}