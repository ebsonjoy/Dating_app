import asyncHandler from "express-async-handler";
import UserService from "../services/userService";
import generateToken from "../utils/generateToken";
import { generateOTP, sendOTP } from "../utils/userOtp";
import { Request, Response } from "express";

// User Authentication
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await UserService.authenticateUser(email, password);

  if (user) {
    generateToken(res, user._id.toString());
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// Logout User
const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "User Logged Out" });
});

// User Registration
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, mobileNumber, dateOfBirth } = req.body;

  const userExists = await UserService.authenticateUser(email, password);
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000);
  const user = await UserService.registerUser({
    name,
    email,
    password,
    mobileNumber,
    dateOfBirth,
    otp,
    otpExpiresAt,
  });
  await sendOTP(email, otp);
  if (user) {
    generateToken(res, user._id.toString());
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber,
      otp: otp,
      dateOfBirth: user.dateOfBirth,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const resendOTP = asyncHandler(async (req: Request, res: Response) => {
  const { emailId } = req.body;

  if (!emailId) {
    res.status(400);
    throw new Error("Email is required");
  }

  // Resend OTP using the service
  const result = await UserService.resendOTP(emailId);

  if (result.success) {
    res.status(200).json({ success: true, message: "OTP resent successfully" });
  } else {
    res.status(400).json({ success: false, message: result.message });
  }
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { emailId, otp } = req.body;
  if (!emailId || !otp) {
    res.status(400);
    throw new Error("Email and OTP are required");
  }
  const isVerified = await UserService.verifyOTP(emailId, otp);

  if (isVerified) {
    res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP" });
  }
});

// Reset  Password request
const requestPasswordReset = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
      await UserService.requestPasswordReset(email);
      res
        .status(200)
        .json({ message: "Password reset link sent to your email" });
    } catch (error) {
      res.status(400).json({ message: "Email is not valid", error });
    }
  }
);

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    await UserService.resetPassword(token, password);
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(400).json({ message: "Error", error });
  }
});

// Create user info
const createUserInfo = asyncHandler(async (req, res) => {
  try {
    console.log("try is running");
    const profilePhotos = (req.files as Express.Multer.File[]) || [];
    //   console.log('ooooooooooooooooooooooooooooooooooooooo', req.files);

    const userInfoData = {
      ...req.body,
      profilePhotos: profilePhotos.map((file) => file.filename),
    };

    // console.log(userInfoData);

    const newUserInfo = await UserService.createUserInfo(userInfoData);
    res.status(201).json(newUserInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user info", error });
  }
});

const getHomeUsersProfiles = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.userId;

    try {
      const matchedUsers = await UserService.getMatchedUsers(userId);

      res.json(matchedUsers);
    } catch (error) {
      console.error("Error fetching matched users:", error);

      res.status(500).json({ message: "Server error" });
    }
  }
);

// get user Profile
const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  try {
    const { user, userInfo } = await UserService.getUserProfile(userId);

    if (!user || !userInfo) {
      res.status(404).json({ message: "User profile not found" });
    }
    res.json({ user, userInfo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve profile" });
  }
});

const updatedPersonalInfo = asyncHandler(async(req,res)=>{
  const {userId} = req.params
  const userPeronalData = req.body
  console.log(userId)
  console.log(userPeronalData);
  
  
  try{
    const updatedPersonalInfo = await UserService.updateUserPersonalInfo(userId,userPeronalData)
    res.json(updatedPersonalInfo)
  }catch(error){
    console.log(error);
    res.status(500).json({ message: "Failed to update profile" });
  }
})

const updateUserDatingInfo = asyncHandler(async(req,res)=>{
  const userId = req.params.userId
  const userDatingData = req.body
  try{
    const updateUserDatingInfo = await UserService.updateUserDatingInfo(userId,userDatingData)
    res.json(updateUserDatingInfo)
  }catch(error){
    console.log(error);
    res.status(500).json({ message: "Failed to update profile" });
  }
})


// const updateUserProfile = asyncHandler(async(req,res)=>{
//   const userId = req.params.userId
//   const userData = req.body.userData; 
//   const userInfoData = req.body.userInfoData;
//   try{
//     const profilePhotos = (req.files as Express.Multer.File[]) || [];
//     userInfoData.profilePhotos = profilePhotos.map((file) => file.filename)
//     const updatedProfile= await UserService.updateProfile(userId, userData, userInfoData)
//     res.json(updatedProfile);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Failed to update profile" });
//   }
// })

export {
  authUser,
  registerUser,
  verifyOTP,
  createUserInfo,
  resendOTP,
  getHomeUsersProfiles,
  logoutUser,
  requestPasswordReset,
  resetPassword,
  getUserProfile,
  updatedPersonalInfo,
  updateUserDatingInfo,
};
