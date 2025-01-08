import { injectable } from "inversify";
import { IAdminRepository } from "../../interfaces/admin/IAdminRepository";
import { IAdmin } from "../../types/admin.types";
import User from "../../models/User";
import Admin from "../../models/AdminModel";
import Payment from "../../models/PaymentModel";
import Match from '../../models/MatchModel'
import Message from '../../models/MessageModel'
import Report from '../../models/reportModel'
import { IUser } from "../../types/user.types";
import { IPayment } from "../../types/payment.types";
import { IMessage } from "../../types/message.types";
import { IReport } from "../../types/report.types";
@injectable()
export class AdminRepository implements IAdminRepository {
  constructor(
    private readonly adminModel = Admin,
    private readonly userModel = User,
    private readonly paymentModel = Payment,
    private readonly matchModel = Match,
    private readonly MessageModel = Message,
    private readonly reportModel = Report,

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
      ).select('_id name status')
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

// Graph

async getUserCountByTimeRange(timeRange: 'day' | 'month' | 'year'): Promise<number> {
  const now = new Date();
  let startDate: Date;

  switch (timeRange) {
    case 'day':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
  }

  return await this.userModel.countDocuments({ 
    createdAt: { $gte: startDate } 
  });
}

async getUserGrowthData(timeRange: 'day' | 'month' | 'year'): Promise<{ date: Date; count: number }[]> {
  const now = new Date();
  let groupFormat: string;
  let startDate: Date;

  switch (timeRange) {
    case 'day':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      groupFormat = '%Y-%m-%d';
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      groupFormat = '%Y-%m';
      break;
    case 'year':
      startDate = new Date(now.getFullYear() - 5, 0, 1);
      groupFormat = '%Y';
      break;
  }

  const result = await this.userModel.aggregate([
    { 
      $match: { 
        createdAt: { $gte: startDate } 
      } 
    },
    { 
      $group: {
        _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { 
      $sort: { _id: 1 } 
    }
  ]);

  return result.map(item => ({
    date: new Date(item._id),
    count: item.count
  }));
}

async getPaymentTotalByTimeRange(timeRange: 'day' | 'month' | 'year'): Promise<number> {
  const now = new Date();
  let startDate: Date;

  switch (timeRange) {
    case 'day':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
  }

  const result = await this.paymentModel.aggregate([
    { 
      $match: { 
        date: { $gte: startDate } 
      } 
    },
    { 
      $group: { 
        _id: null, 
        total: { $sum: '$amount' } 
      } 
    }
  ]);

  return result[0]?.total || 0;
}

async getPaymentGrowthData(timeRange: 'day' | 'month' | 'year'): Promise<{ date: Date; amount: number }[]> {
  const now = new Date();
  let groupFormat: string;
  let startDate: Date;

  switch (timeRange) {
    case 'day':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      groupFormat = '%Y-%m-%d';
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      groupFormat = '%Y-%m';
      break;
    case 'year':
      startDate = new Date(now.getFullYear() - 5, 0, 1);
      groupFormat = '%Y';
      break;
  }

  const result = await this.paymentModel.aggregate([
    { 
      $match: { 
        date: { $gte: startDate } 
      } 
    },
    { 
      $group: {
        _id: { $dateToString: { format: groupFormat, date: '$date' } },
        amount: { $sum: '$amount' }
      }
    },
    { 
      $sort: { _id: 1 } 
    }
  ]);

  return result.map(item => ({
    date: new Date(item._id), 
    amount: item.amount
  }));
}

async getAllReportsWithMessages(): Promise<(IReport & { messages: IMessage[] })[]> {
  const reports = await this.reportModel.find()
    .populate("reporterId", "name email")
    .populate("reportedId", "name email")
    .lean();

  const reportsWithMessages = await Promise.all(
    reports.map(async (report) => {
      const messages = await this.MessageModel.find({
        $or: [
          { senderId: report.reporterId, receiverId: report.reportedId },
          { senderId: report.reportedId, receiverId: report.reporterId },
        ],
      })
        .sort({ createdAt: -1 }) 
        .limit(5)
        .lean();

      return { ...report, messages };
    })
  );

  return reportsWithMessages;
}

async updateReportStatus(reportId: string, status: 'Pending' | 'Reviewed' | 'Resolved'): Promise<IReport | null> {
  return await Report.findByIdAndUpdate(
      reportId,
      { status, updatedAt: new Date() },
      { new: true }
  );
}

}
