import { IAdmin } from "../../types/admin.types";
import { IUser } from "../../types/user.types";
import { IPayment } from "../../types/payment.types";

export interface IAdminRepository{
    authenticate(email: string): Promise<IAdmin | null>;
    create(email: string, password: string): Promise<void>;
    findAllUsers(): Promise<IUser[]>;
    updateUserStatus(userId: string, newStatus: boolean): Promise<IUser | null>;
    getAllPayments():Promise<IPayment[]>
    usersCount():Promise<number>
    matchesCount():Promise<number>
    premiumUsersCount():Promise<number>
    totalRevanue():Promise<number>
    getUserCountByTimeRange(timeRange:'day'|'month'|'year'): Promise<number>;
    getUserGrowthData(timeRange: 'day'|'month'|'year'): Promise<{ date: Date; count: number }[]>;
    getPaymentTotalByTimeRange(timeRange:'day'|'month'| 'year'): Promise<number>;
    getPaymentGrowthData(timeRange: 'day'|'month'|'year'): Promise<{ date: Date; amount: number }[]>;

}