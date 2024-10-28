import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { IUserService } from '../../interfaces/user/IUserService';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import generateToken from '../../utils/generateToken';
import { inject, injectable } from 'inversify';


@injectable()
export class UserController {
    constructor(
        @inject('IUserService') private readonly userService : IUserService
    ){}
    authUser = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const user = await this.userService.authenticateUser(email, password);

        if (!user) {
            res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Invalid email or password' });
            return;
        }

        if (user.status === false) {
            res.status(HttpStatusCode.FORBIDDEN).json({ message: 'Your account has been blocked by the admin.' });
            return;
        }

        generateToken(res, user._id.toString());
        res.status(HttpStatusCode.OK).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    });


    logoutUser = asyncHandler(async (req: Request, res: Response) => {
        res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
        res.status(HttpStatusCode.OK).json({ message: "User Logged Out" });
    });

    registerUser = asyncHandler(async (req: Request, res: Response) => {
        const { name, email, password, mobileNumber, dateOfBirth } = req.body;

        const userExists = await this.userService.authenticateUser(email, password);
        if (userExists) {
            res.status(HttpStatusCode.BAD_REQUEST);
            throw new Error("User already exists");
        }
        const user = await this.userService.registerUser({ name, email, password, mobileNumber, dateOfBirth });
        res.status(HttpStatusCode.CREATED).json(user);
    });
    resendOTP = asyncHandler(async (req: Request, res: Response) => {
        const { emailId } = req.body;

        if (!emailId) {
            res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Email is required" });
            return;
        }

        const result = await this.userService.resendOTP(emailId);
        res.status(result.success ? HttpStatusCode.OK : HttpStatusCode.BAD_REQUEST).json(result);
    });

    verifyOTP = asyncHandler(async (req: Request, res: Response) => {
        const { emailId, otp } = req.body;
        if (!emailId || !otp) {
            res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Email and OTP are required" });
            return;
        }
    
        try {
            const isVerified = await this.userService.verifyOTP(emailId, otp);
            res.status(HttpStatusCode.OK).json({ success: isVerified });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error:any) {
            res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: error.message });
        }
    });
    
    

    requestPasswordReset = asyncHandler(async (req: Request, res: Response) => {
        const { email } = req.body;

        if (!email) {
             res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Email is required" });
             return
        }

        try {
            await this.userService.requestPasswordReset(email);
            res.status(HttpStatusCode.OK).json({ message: "Password reset link sent to your email" });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
        }
    });
    
    

    resetPassword = asyncHandler(async (req: Request, res: Response) => {
        const { token } = req.params;
        const { password } = req.body;
        await this.userService.resetPassword(token, password);
        res.status(HttpStatusCode.OK).json({ message: "Password reset successful" });
    });
    createUserInfo = asyncHandler(async (req: Request, res: Response) => {     
        const profilePhotos = (req.files as Express.Multer.File[]) || [];
        if (typeof req.body.location === 'string') {
            req.body.location = JSON.parse(req.body.location);
        }
        if (
            !req.body.location || 
            req.body.location.type !== 'Point' || 
            !Array.isArray(req.body.location.coordinates) || 
            req.body.location.coordinates.length !== 2 ||
            isNaN(req.body.location.coordinates[0]) ||
            isNaN(req.body.location.coordinates[1])
        ) {
            res.status(400).json({ error: 'Invalid location data. Coordinates array with longitude and latitude is required.' });
            return;
        }
        const userInfoData = { 
            ...req.body, 
            profilePhotos: profilePhotos.map((file) => file.filename) 
        };
    
        const newUserInfo = await this.userService.createUserInfo(userInfoData);
        res.status(HttpStatusCode.CREATED).json(newUserInfo);
    });

    getHomeUsersProfiles = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.params.userId;
        const matchedUsers = await this.userService.getMatchedUsers(userId);    
        res.json(matchedUsers);
    });


    getUserProfile = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.params.userId;
        const { user, userInfo } = await this.userService.getUserProfile(userId);
        if (!user || !userInfo) {
            res.status(HttpStatusCode.NOT_FOUND).json({ message: "User profile not found" });
            return;
        }
        res.json({ user, userInfo });
    });

    updatedPersonalInfo = asyncHandler(async(req,res)=>{
        const {userId} = req.params
        const userPeronalData = req.body
        console.log(userId)
        console.log(userPeronalData);
        try{
          const updatedPersonalInfo = await this.userService.updateUserPersonalInfo(userId,userPeronalData)
          if(!updatedPersonalInfo){
    res.status(500).json({ message: "Failed to update profile" });
            return
          }
          res.status(HttpStatusCode.OK).json({
            _id: updatedPersonalInfo._id,
            name: updatedPersonalInfo.name,
            email: updatedPersonalInfo.email,
          });
        }catch(error){
          console.log(error);
          res.status(500).json({ message: "Failed to update profile" });
        }
      })
      

    updateUserSubscription = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { isPremium, planId, planExpiryDate, planStartingDate } = req.body;

        if (!userId || !isPremium || !planId || !planExpiryDate) {
            res.status(HttpStatusCode.BAD_REQUEST).json({ message: "All fields are required" });
            return;
        }

        const updatedUser = await this.userService.updateUserSubscription(userId, { isPremium, planId, planExpiryDate, planStartingDate });
        if (!updatedUser) {
            res.status(HttpStatusCode.NOT_FOUND).json({ message: "User not found" });
            return;
        }

        res.status(HttpStatusCode.OK).json({ message: "User subscription updated successfully", user: updatedUser });
    });


    updateUserDatingInfo = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const uploadedPhotos = (req.files as Express.Multer.File[]) || [];
        const data = req.body
        try {
            const userInfo = await this.userService.updateUserDatingInfo(userId, data, uploadedPhotos);
            res.status(HttpStatusCode.OK).json({ message: 'User info updated successfully', userInfo });
        } catch (error) {
            console.error(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update user info', error });
        }
    });
}