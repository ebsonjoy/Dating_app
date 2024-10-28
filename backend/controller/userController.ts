// import asyncHandler from "express-async-handler";
// import UserService from "../services/userService";
// import generateToken from "../utils/generateToken";
// import { generateOTP, sendOTP } from "../utils/userOtp";
// import { Request, Response } from "express";
// // import { IUserInfo } from "../models/UserInfo";
// // import mongoose from 'mongoose';
// import { HttpStatusCode } from "../enums/HttpStatusCode";
// import { UserInfoUpdate } from "../types/userTypes";
// import UserInfo from "../models/UserInfo";
// import mongoose from 'mongoose';




// class UserController{
// // User Authentication
//  authUser = asyncHandler(async (req:Request, res:Response) => {
//   const { email, password } = req.body;
//   const user = await UserService.authenticateUser(email, password);
//    if(!user){
//      res.status(HttpStatusCode.NOT_FOUND).json({ message: ' Invalid email or password' });
//      return
//    }

//    if (user.status === false) {
//     res.status(HttpStatusCode.FORBIDDEN).json({ message: 'Your account has been blocked by the admin.' });
//     return;
//   }
//   if (user) {
//     generateToken(res, user._id.toString());
//     res.status(200).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//     });
//   } else {
//     res.status(HttpStatusCode.UNAUTHORIZED)
//     throw new Error("User not found");
//   }
// });

// // Logout User
//  logoutUser = asyncHandler(async (req: Request, res: Response) => {
//   res.cookie("jwt", "", {
//     httpOnly: true,
//     expires: new Date(0),
//   });

//   res.status(HttpStatusCode.OK).json({ message: "User Logged Out" });
// });

// // User Registration
//  registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password, mobileNumber, dateOfBirth } = req.body;

//   const userExists = await UserService.authenticateUser(email, password);
//   if (userExists) {
//     res.status(HttpStatusCode.BAD_REQUEST);
//     throw new Error("User already exists");
//   }
//   const otp = generateOTP();
//   const otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000);
//   const user = await UserService.registerUser({
//     name,
//     email,
//     password,
//     mobileNumber,
//     dateOfBirth,
//     otp,
//     otpExpiresAt,
//   });
//   await sendOTP(email, otp);
//   if (user) {
//     generateToken(res, user._id.toString());
//     res.status(HttpStatusCode.CREATED).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       mobileNumber: user.mobileNumber,
//       otp: otp,
//       dateOfBirth: user.dateOfBirth,
//     });
//   } else {
//     res.status(HttpStatusCode.BAD_REQUEST);
//     throw new Error("Invalid user data");
//   }
// });

//  resendOTP = asyncHandler(async (req: Request, res: Response) => {
//   const { emailId } = req.body;
//   if (!emailId) {
//     res.status(HttpStatusCode.CREATED);
//     throw new Error("Email is required");
//   }
//   // Resend OTP using the service
//   const result = await UserService.resendOTP(emailId);

//   if (result.success) {
//     res.status(HttpStatusCode.OK).json({ success: true, message: "OTP resent successfully" });
//   } else {
//     res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: result.message });
//   }
// });

// verifyOTP = asyncHandler(async (req, res) => {
//   const { emailId, otp } = req.body;
//   if (!emailId || !otp) {
//     res.status(HttpStatusCode.BAD_REQUEST);
//     throw new Error("Email and OTP are required");
//   }
//   const isVerified = await UserService.verifyOTP(emailId, otp);

//   if (isVerified) {
//     res
//       .status(HttpStatusCode.OK)
//       .json({ success: true, message: "OTP verified successfully" });
//   } else {
//     res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: "Invalid OTP" });
//   }
// });

// // Reset  Password request
//  requestPasswordReset = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { email } = req.body;
//     try {
//       await UserService.requestPasswordReset(email);
//       res
//         .status(HttpStatusCode.OK)
//         .json({ message: "Password reset link sent to your email" });
//     } catch (error) {
//       res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Email is not valid", error });
//     }
//   }
// );

// // Reset Password
//  resetPassword = asyncHandler(async (req, res) => {
//   const { token } = req.params;
//   const { password } = req.body;
//   try {
//     await UserService.resetPassword(token, password);
//     res.status(200).json({ message: "Password reset successful" });
//   } catch (error) {
//     res.status(400).json({ message: "Error", error });
//   }
// });

// // Create user info
//  createUserInfo = asyncHandler(async (req, res) => {
//   try {
//     console.log("try is running");
//     const profilePhotos = (req.files as Express.Multer.File[]) || [];
//     //   console.log('ooooooooooooooooooooooooooooooooooooooo', req.files);

//     const userInfoData = {
//       ...req.body,
//       profilePhotos: profilePhotos.map((file) => file.filename),
//     };

//     // console.log(userInfoData);

//     const newUserInfo = await UserService.createUserInfo(userInfoData);
//     res.status(201).json(newUserInfo);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Error creating user info", error });
//   }
// });

//  getHomeUsersProfiles = asyncHandler(
//   async (req: Request, res: Response) => {
//     const userId = req.params.userId;

//     try {
//       const matchedUsers = await UserService.getMatchedUsers(userId);

//       res.json(matchedUsers);
//     } catch (error) {
//       console.error("Error fetching matched users:", error);

//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // get user Profile
//  getUserProfile = asyncHandler(async (req, res) => {
//   const userId = req.params.userId;
//   try {
//     const { user, userInfo } = await UserService.getUserProfile(userId);

//     if (!user || !userInfo) {
//       res.status(404).json({ message: "User profile not found" });
//     }
//     res.json({ user, userInfo });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Failed to retrieve profile" });
//   }
// });

//  updatedPersonalInfo = asyncHandler(async(req,res)=>{
//   const {userId} = req.params
//   const userPeronalData = req.body
//   console.log(userId)
//   console.log(userPeronalData);
  
  
//   try{
//     const updatedPersonalInfo = await UserService.updateUserPersonalInfo(userId,userPeronalData)
//     // res.json(updatedPersonalInfo)
//     res.status(HttpStatusCode.OK).json({
//       _id: updatedPersonalInfo._id,
//       name: updatedPersonalInfo.name,
//       email: updatedPersonalInfo.email,
//     });
//   }catch(error){
//     console.log(error);
//     res.status(500).json({ message: "Failed to update profile" });
//   }
// })

// // paymet

//  updateUserSubscription = asyncHandler(async(req,res)=>{
//   const {userId} = req.params
//   const {isPremium, planId, planExpiryDate,planStartingDate} = req.body
//   if (!userId || !isPremium || !planId || !planExpiryDate) {
//     res.status(400).json({ message: 'All fields are required' });
//     return;
//   }
//   try{
//     const updatedUser = UserService.updateUserSubscription(userId, { isPremium, planId, planExpiryDate,planStartingDate })
//     if (updatedUser) {
//       res.status(HttpStatusCode.OK).json({ message: 'User subscription updated successfully', user: updatedUser });
//     } else {
//       res.status(HttpStatusCode.NOT_FOUND).json({ message: 'User not found' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update user subscription' });
//   }
// })


// //plan details

// // const getUserPlanDetails = asyncHandler(async(req,res)=>{
// //   const userId = req.params.userId
// //   const user = await UserService.getUserById(userId)
// //   const planId = user?.planId
// //   try{
// //     const {userDetails,planDetals} = await UserService.getUserPlanDetails(userId,planId)
// //     if(!userDetails || !planDetals){
// //       res.status(HttpStatusCode.NOT_FOUND).json({ message: "User profile not found" });
// //     }
// //     res.json({ userDetails, planDetals });
// //   }catch (error) {
// //     console.log(error);
// //     res.status(500).json({ message: "Failed to retrieve profile" });
// //   }
// // })


//  updateUserDatingInfo = asyncHandler(async(req:Request,res:Response)=>{
//   const userId = req.params.userId;
// console.log(userId);

  
//   if (!mongoose.Types.ObjectId.isValid(userId)) {
//     res.status(400).json({ message: 'Invalid user ID' });
//     return 
//   }

//   const currentUserInfo = await UserInfo.findOne({ userId: userId });
//   if (!currentUserInfo) {
//     res.status(404).json({ message: 'User info not found' });
//     return
//   }
//   const uploadedPhotos = (req.files as Express.Multer.File[]) || [];
//   console.log('------------------',req.body.imgIndex);
  
//   const imgIndex = req.body.imgIndex && req.body.imgIndex.trim() !== '' 
//   ? req.body.imgIndex.split(',').map(Number) 
//   : [];
//   if(imgIndex.length>0){
//     imgIndex.forEach((index: number, i:number) => {
//       currentUserInfo.profilePhotos[index] = uploadedPhotos[i].filename;
//     });
//   }
 

//   // Prepare data for update
//   const updatedData:UserInfoUpdate = {
//     gender: req.body.gender,
//     lookingFor: req.body.lookingFor,
//     relationship: req.body.relationship,
//     interests: req.body.interests.split(', '), 
//     occupation: req.body.occupation,
//     education: req.body.education,
//     bio: req.body.bio,
//     smoking: req.body.smoking,
//     drinking: req.body.drinking,
//     place: req.body.place,
//     caste: req.body.caste,
//     profilePhotos: currentUserInfo.profilePhotos,
//   };
//   console.log(updatedData);
//   try {
//     const userInfo = await UserInfo.findOneAndUpdate(
//       { userId: userId },
//       { $set: updatedData },
//       { new: true} 
//     );

//     if (!userInfo) {
//       res.status(404).json({ message: 'User info not found' });
//       return 

//     }

//     res.status(200).json({ message: 'User info updated successfully', userInfo });
//     return 

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to update user info', error });
//     return 

//   }
// })


// }

// export default new UserController();


