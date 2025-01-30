import { IAdmin } from "../../types/admin.types";
import { IDashboardMasterData } from "../../types/dashboard.types";
import { IMessage } from "../../types/message.types";
import { IPayment } from "../../types/payment.types";
import { IReport } from "../../types/report.types";
import { IUser } from "../../types/user.types";
export interface IAdminService {
    authenticateAdmin(email: string, password: string): Promise<IAdmin | null>;
    registerAdmin(email: string, password: string): Promise<void>;
    getAllUsers(): Promise<IUser[]>;
    toggleUserStatus(userId: string, newStatus: boolean): Promise<IUser | null>;
    getPayments():Promise<IPayment[]>
    dashBoardMasterData():Promise<IDashboardMasterData>
    getUserChartData(
        timeRange: 'day'|'month'|'year'
      ): Promise<{ totalUsers: number; userGrowthData: { date: Date; count: number }[] }>
    getPaymentChartData(timeRange: 'day'|'month'|'year'
    ):Promise<{totalPayments:number;paymentGrowthData:{ date: Date; amount: number }[]}>
    getReportsWithMessages():Promise<(IReport & { messages: IMessage[] })[]>
    updateReportStatus(reportId: string, status: 'Pending' | 'Reviewed' | 'Resolved'): Promise<IReport | null>;
}