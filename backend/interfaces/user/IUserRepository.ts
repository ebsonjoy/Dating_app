import { IUser } from "../../types/user.types";
import { IUserInfo } from "../../types/userInfo.types";
import { UserInfoUpdate } from "../../types/userInfo.types";
import { IPlan } from "../../types/plan.types";
export interface IUserRepository {
    findByEmail(email: string): Promise<IUser | null>;
    register(userData: Partial<IUser>): Promise<IUser | null>;
    findById(id: string): Promise<IUser | null>;
    update(id: string, data: Partial<IUser>): Promise<IUser | null>;
    findUserInfo(userId: string): Promise<IUserInfo | null>;
    createUserInfo(userInfoData: IUserInfo): Promise<IUserInfo | null>;
    updateUserInfo(userId: string, data: UserInfoUpdate): Promise<IUserInfo | null>;
    findMatchedUsers(filters: Partial<IUserInfo>): Promise<IUserInfo[] | null>;
    findUserPlanDetailsById(userId: string): Promise<{ subscription: IUser['subscription']; plan: IPlan | null } | null>;

}
