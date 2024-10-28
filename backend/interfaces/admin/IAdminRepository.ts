import { IAdmin } from "../../types/admin.types";
import { IUser } from "../../types/user.types";
export interface IAdminRepository{
    authenticate(email: string): Promise<IAdmin | null>;
    create(email: string, password: string): Promise<void>;
    findAllUsers(): Promise<IUser[]>;
    updateUserStatus(userId: string, newStatus: boolean): Promise<IUser | null>;
}