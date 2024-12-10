import { injectable } from "inversify";
import { IAdminRepository } from "../../interfaces/admin/IAdminRepository";
import { IAdmin } from "../../types/admin.types";
import User from "../../models/User";
import Admin from "../../models/AdminModel";
import Payment from "../../models/PaymentModel";
import Match from '../../models/MatchModel'
import { IUser } from "../../types/user.types";
import { IPayment } from "../../types/payment.types";

@injectable()
export class AdminRepository implements IAdminRepository {
  constructor(
    private readonly adminModel = Admin,
    private readonly userModel = User,
    private readonly paymentModel = Payment,
    private readonly matchModel = Match,
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
        .select("name email mobileNumber subscription matches status");
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

  async getAllPayments(): Promise<IPayment[]> {
    return await this.paymentModel.find();
  }

  async usersCount(): Promise<number> {
    return await this.userModel.countDocuments({ status: true });
  }
  async matchesCount(): Promise<number> {
      return await this.matchModel.countDocuments()
  }
  async totalRevanue(): Promise<number> {
    try {
      const total = await this.paymentModel.aggregate([
        {
          $group: {
            _id: null, 
            totalAmount: { $sum: "$amount" } 
          }
        }
      ]);
      return total.length > 0 ? total[0].totalAmount : 0;
    } catch (error) {
      console.error("Error calculating total revenue:", error);
      throw error;
    }
  }

  async premiumUsersCount(): Promise<number> {
    try {
        const count = await this.userModel.countDocuments({ "subscription.isPremium": true });
        return count;
    } catch (error) {
        console.error("Error fetching premium users count:", error);
        throw error;
    }
}

}
