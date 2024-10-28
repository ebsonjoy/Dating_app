import { IAdmin } from "../../types/admin.types";
import { IUser } from "../../types/user.types";
export interface IAdminService {
    authenticateAdmin(email: string, password: string): Promise<IAdmin | null>;
    registerAdmin(email: string, password: string): Promise<void>;
    getAllUsers(): Promise<IUser[]>;
    toggleUserStatus(userId: string, newStatus: boolean): Promise<IUser | null>;
}