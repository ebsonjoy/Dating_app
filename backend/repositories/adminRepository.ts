import Admin, { IAdmin } from '../models/AdminModel'; 
import User from '../models/User';

class AdminRepository {
  async findAdminByEmail(email: string): Promise<IAdmin | null> {
    return await Admin.findOne({ email });
  }

  async createAdmin(email: string, password: string): Promise<IAdmin> {
    const newAdmin = new Admin({
      email,
      password,
    });
    return await newAdmin.save();
  }


  // get Users
  async getAllUsers(){
    try {
      return await User.find().select('name email mobileNumber isPremium matches status');
    } catch (error) {
      console.log(error);
      throw new Error('Error fetching users')
    }
  }

  // Status Updating

  async updateUserStatus(userId: string, newStatus: boolean){
    try{
      const updatedUser = await User.findByIdAndUpdate( userId,{status:newStatus},{new:true})
      if (!updatedUser) {
        throw new Error('User not found');
      }
  
      return updatedUser;
    } catch (error) {
      console.log(error);
      throw new Error('Error updating user status');
    }
  }


}

export default new AdminRepository();
