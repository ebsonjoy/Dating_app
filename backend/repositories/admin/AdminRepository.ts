import { injectable } from "inversify";
import { IAdminRepository } from "../../interfaces/admin/IAdminRepository";
import { IAdmin } from "../../types/admin.types";
import User from "../../models/User";
import Admin from "../../models/AdminModel";
import { IUser } from "../../types/user.types";

@injectable()
export class AdminRepository implements IAdminRepository {
  constructor(
    private readonly adminModel = Admin,
    private readonly userModel = User
  ) {}

  async authenticate(email: string): Promise<IAdmin | null> {
    try {
      return await this.adminModel.findOne({ email });
    } catch (error) {
      console.error("Error during admin authentication:", error);
      throw new Error("Error authenticating admin");
    }
  }

  async create(email: string, password: string): Promise<void> {
    const admin = new this.adminModel({ email, password });
    try {
      await admin.save();
    } catch (error) {
      console.error("Error creating admin:", error);
      throw new Error("Error creating admin");
    }
  }

  async findAllUsers(): Promise<IUser[]> {
    try {
      return await this.userModel
        .find()
        .select("name email mobileNumber isPremium matches status");
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Error fetching users");
    }
  }

  async updateUserStatus(
    userId: string,
    newStatus: boolean
  ): Promise<IUser | null> {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        { status: newStatus },
        { new: true }
      );
      if (!updatedUser) {
        throw new Error("User not found");
      }
      return updatedUser;
    } catch (error) {
      console.error("Error updating user status:", error);
      throw new Error("Error updating user status");
    }
  }
}
