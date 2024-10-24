import bcrypt from 'bcryptjs';
import AdminRepository from '../repositories/adminRepository';
import { IAdmin } from '../models/AdminModel'; 

class AdminService {
  async authenticateAdmin(email: string, password: string): Promise<IAdmin | null> {
    try{
      const admin = await AdminRepository.findAdminByEmail(email);

      if (admin && (await admin.matchPassword(password))) {
        return admin;
      }
      return null;
    }catch(error){
      console.log(error);
      throw new Error('Failed to register admin');
    }
  
  }

  async registerAdmin(email: string, password: string): Promise<IAdmin> {
    const existingAdmin = await AdminRepository.findAdminByEmail(email);
    try{
      if (existingAdmin) {
        throw new Error('Admin already exists');
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      return await AdminRepository.createAdmin(email, hashedPassword);
    }catch(error){
      console.log(error);
    throw new Error('Failed to register admin');
    }
    
  }


  // Display Users
async getAllUsers(){
  return await AdminRepository.getAllUsers()
}

// status Updating

async toggleUserStatus(userId: string, newStatus: boolean){
  try{
    const updateUser = await AdminRepository.updateUserStatus(userId,newStatus)
    return updateUser;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to toggle user status');
  }
}

}

export default new AdminService();
