// import UserRepository from "../repositories/userRepository";
// import { IUser } from '../types/user.types';
// import { IUserInfo } from "../types/userInfo.types";
// import { generateOTP, sendOTP } from "../utils/userOtp";
// import IUserProfile from "../interfaces/IUserProfile"
// import { calculateAge } from "../utils/calculateAge";
// // import UserInfoRepository from "../repositories/userInfoRepository";
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';
// import { sendResetEmail } from "../utils/resetGmail";
// import { ISubscriptionDetails } from "../types/userTypes";
// // import { IPlan } from "../models/PlanModel";
// // import planRepository from "../repositories/planRepository";


// class UserService {
//   async authenticateUser(
//     email: string,
//     password: string
//   ): Promise<IUser | null> {
//     const user = await UserRepository.findUserByEmail(email);
//     if (user && (await user.matchPassword(password))) {
//       return user;
//     }
//     return null;
//   }

//   async registerUser(userData: Partial<IUser>): Promise<IUser> {
//     return await UserRepository.createUser(userData);
//   }

//   async getUserById(userId: string): Promise<IUser | null> {
//     return await UserRepository.findUserById(userId);
//   }

//   async verifyOTP(email: string, otp: string): Promise<boolean> {
//     const user = await UserRepository.findUserByOTP(email); 

//     if (!user) {
//       throw new Error("User not found");
//     }
//     if (user.otp !== otp) {
//       throw new Error("Invalid OTP");
//     }
//     if (new Date() > user.otpExpiresAt) {
//       throw new Error("OTP has expired");
//     }
//     if (user.otp === otp) {
//       return true;
//     } else {
//       return false;
//     }
//   }

//   async resendOTP(email: string): Promise<{ success: boolean, message: string }> {
//     const user = await UserRepository.findUserByEmail(email);

//         if (!user) {
//             return { success: false, message: 'User not found' };
//         }

//         const newOtp = generateOTP()
//         const otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000);
//         await UserRepository.updateOTP(user.email, newOtp, otpExpiresAt);

//         await sendOTP(user.email, newOtp);

//         return { success: true, message: 'OTP resent successfully' };


//       }
//       //reset Password Request
//       async requestPasswordReset(email: string): Promise<void> {
//         const user = await UserRepository.findUserByEmail(email);
//         if(!user) throw new Error('User Not Found')
//         const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
//         const expDate = new Date();
//         expDate.setHours(expDate.getHours() + 1);

//         await UserRepository.saveResetToken(user._id.toString(),resetToken,expDate)
//         const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
//         await sendResetEmail(user.email, resetLink);
//       }

//       // reset Password
//       async resetPassword(token:string, newPassword:string): Promise<void>{
//         try {
//           // eslint-disable-next-line @typescript-eslint/no-explicit-any
//           const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
//           const user = await UserRepository.findUserById(decoded.userId);
//           if (!user || user.resetPassword.token !== token) throw new Error('Invalid or expired token');
//           if (user.resetPassword.expDate && user.resetPassword.expDate < new Date()) {
//             throw new Error('Reset token expired');
//           }

//           const hashedPassword = await bcrypt.hash(newPassword, 10);
//           await UserRepository.resetPassword(user._id.toString() ,hashedPassword)
//         } catch (error) {
//           console.log(error);
          
//           throw new Error('Invalid or expired token');
//         }
//       }


// //create User info

//   async createUserInfo(userInfoData: IUserInfo): Promise<IUserInfo> {
//     return await UserRepository.createUserInfo(userInfoData);
//   }



// async getMatchedUsers(userId: string): Promise<IUserProfile[]> {
//   const loggedInUserInfo = await UserRepository.findUserInfoByUserId(userId);
//   if (!loggedInUserInfo) {
//       return [];
//   }

//   const { lookingFor, relationship, place } = loggedInUserInfo;

//   const matchedUserInfos = await UserRepository.findMatchedUsers({
//       userId,
//       gender: lookingFor,
//       relationship,
//       place,
//   });

//   const matchedUsersWithDetails = await Promise.all(
//       matchedUserInfos.map(async (userInfo) => {
//           const user = await UserRepository.findUsersById(userInfo.userId.toString());
//           return {
//             userId: userInfo.userId.toString(), 
//             name: user?.name,
//             age: calculateAge(user?.dateOfBirth ? new Date(user.dateOfBirth) : undefined),
//             gender: userInfo.gender,
//             lookingFor: userInfo.lookingFor,
//             profilePhotos: userInfo.profilePhotos,
//             relationship: userInfo.relationship,
//             interests: userInfo.interests,
//             occupation: userInfo.occupation,
//             education: userInfo.education,
//             bio: userInfo.bio,
//             smoking: userInfo.smoking,
//             drinking: userInfo.drinking,
//             place: userInfo.place,
//           } as unknown as IUserProfile;
//       })
//   );

//   return matchedUsersWithDetails;
// }

// // Get User Profile

// async getUserProfile(userId: string): Promise<{ user: IUser | null; userInfo: IUserInfo | null }> {
//   const user = await UserRepository.findUserProfileById(userId);
//   const userInfo = await UserRepository.findUserInfoByUserId(userId);
//   return { user, userInfo };
// }

// // update User Personal info
// async updateUserPersonalInfo(userId:string,userPeronalData:IUser): Promise<IUser>{
//   const updatedPersonalInfo = await UserRepository.findUserPersonalInfo(userId,userPeronalData)
//   if(!updatedPersonalInfo){
//     throw new Error('Failed to update user personal Data');
//   }
//   return updatedPersonalInfo
// }
// // update User Dating info

// async updateUserDatingInfo(userId:string,userDatingData:IUserInfo):Promise<IUserInfo>{
//   const updatedUserDatingInfo = await UserRepository.findUserDatingInfo(userId,userDatingData)
//   if(!updatedUserDatingInfo){
//     throw new Error('Failed to update user dating Data');
//   }
//   return updatedUserDatingInfo
// }



// // PaymentUpdation

// async updateUserSubscription(userId:string,subscriptionDetails:ISubscriptionDetails): Promise<IUser>{
//   const updatedUser = await UserRepository.updateUserSubscription(userId,subscriptionDetails)
//   if(!updatedUser){
//     throw new Error('Failed to update user subscription');
//   }
//   return updatedUser;
// }

// // async getUserPlanDetails(userId:string,planId:string):Promise<{userDatails : IUser | null; planDetails:IPlan | null}>{
// //   const userDetails = await UserRepository.findUserPlanDetals(userId)
// //   const planDetails = await planRepository.getPlanById(planId)
// //   return {userDetails ,planDetails}
// // }




// }

// export default new UserService();
