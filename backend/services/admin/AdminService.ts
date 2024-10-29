import { inject, injectable } from "inversify";
import { IAdminService } from "../../interfaces/admin/IAdminService";
import { IAdminRepository } from "../../interfaces/admin/IAdminRepository";
import { IAdmin } from "../../types/admin.types";
import { IUser } from "../../types/user.types";

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject("IAdminRepository") private adminRepository: IAdminRepository
  ) {}

  async authenticateAdmin(
    email: string,
    password: string
  ): Promise<IAdmin | null> {
    try {
      const admin = await this.adminRepository.authenticate(email);
      if (admin && (await admin.matchPassword(password))) {
        return admin;
      }
      return null;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to auth admin");
    }
  }

  async registerAdmin(email: string, password: string): Promise<void> {
    try {
      await this.adminRepository.create(email, password);
    } catch (error) {
      console.log(error);
      throw new Error("Failed to register admin");
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    try {
      return await this.adminRepository.findAllUsers();
    } catch (error) {
      console.log(error);
      throw new Error("Failed to retrieve users");
    }
  }

  async toggleUserStatus(
    userId: string,
    status: boolean
  ): Promise<IUser | null> {
    try {
      return await this.adminRepository.updateUserStatus(userId, status);
    } catch (error) {
      console.log(error);
      throw new Error("Failed to toggle user status");
    }
  }
}
