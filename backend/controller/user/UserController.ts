import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { IUserService } from '../../interfaces/user/IUserService';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import generateToken from '../../utils/generateToken';
import { inject, injectable } from 'inversify';
import { StatusMessage } from '../../enums/StatusMessage';


@injectable()
export class UserController {
    constructor(
        @inject('IUserService') private readonly userService : IUserService
    ){}
    authUser = asyncHandler(async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const user = await this.userService.authenticateUser(email, password);
            if (!user) {
                res.status(HttpStatusCode.NOT_FOUND).json({ message: StatusMessage.NOT_FOUND });
                return;
            }
            if (user.status === false) {
                res.status(HttpStatusCode.FORBIDDEN).json({ message: StatusMessage.FORBIDDEN });
                return;
            }
            generateToken(res, user._id.toString());
            res.status(HttpStatusCode.OK).json({
                _id: user._id,
                name: user.name,
                email: user.email,
            });
        } catch (error) {
            console.log(error)
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
        }
    });
    


    logoutUser = asyncHandler(async (req: Request, res: Response) => {
        try {
            res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
            res.status(HttpStatusCode.OK).json({ message: StatusMessage.SUCCESS });
        } catch (error) {
            console.log(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
        }
    });
    
    registerUser = asyncHandler(async (req: Request, res: Response) => {
        try {
            const { name, email, password, mobileNumber, dateOfBirth } = req.body;
            const userExists = await this.userService.authenticateUser(email, password);
            if (userExists) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ message: StatusMessage.BAD_REQUEST });
                return;
            }
            const user = await this.userService.registerUser({ name, email, password, mobileNumber, dateOfBirth });
            res.status(HttpStatusCode.CREATED).json(user);
        } catch (error) {
            console.log(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
        }
    });
    
    resendOTP = asyncHandler(async (req: Request, res: Response) => {
        try {
            const { emailId } = req.body;
            if (!emailId) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ message: StatusMessage.BAD_REQUEST });
                return;
            }
            const result = await this.userService.resendOTP(emailId);
            res.status(result.success ? HttpStatusCode.OK : HttpStatusCode.BAD_REQUEST).json(result);
        } catch (error) {
            console.log(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
        }
    });
    

    verifyOTP = asyncHandler(async (req: Request, res: Response) => {
        const { emailId, otp } = req.body;
        if (!emailId || !otp) {
            res.status(HttpStatusCode.BAD_REQUEST).json({ message: StatusMessage.BAD_REQUEST });
            return;
        }
    
        try {
            const isVerified = await this.userService.verifyOTP(emailId, otp);
            res.status(HttpStatusCode.OK).json({ success: isVerified });
        } catch (error) {
            console.log(error);
            res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: StatusMessage.BAD_REQUEST })
        }
    })
    
    requestPasswordReset = asyncHandler(async (req: Request, res: Response) => {
        const { email } = req.body;
        if (!email) {
            res.status(HttpStatusCode.BAD_REQUEST).json({ message: StatusMessage.BAD_REQUEST }); 
            return;
        }
    
        try {
            await this.userService.requestPasswordReset(email);
            res.status(HttpStatusCode.OK).json({ message: StatusMessage.SUCCESS }); 
        } catch (error) {
            console.log(error);
            res.status(HttpStatusCode.BAD_REQUEST).json({ message: StatusMessage.BAD_REQUEST }); 
        }
    });

    resetPassword = asyncHandler(async (req: Request, res: Response) => {
        const { token } = req.params;
        const { password } = req.body;
        try {
            await this.userService.resetPassword(token, password);
            res.status(HttpStatusCode.OK).json({ message: StatusMessage.SUCCESS }); 
        } catch (error) {
            console.log(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR }); 
        }
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
            res.status(HttpStatusCode.BAD_REQUEST).json({ message: StatusMessage.BAD_REQUEST });
            return;
        }
        try {
        const userInfoData = { 
            ...req.body, 
            profilePhotos: profilePhotos.map((file) => file.filename) 
        };
    
        const newUserInfo = await this.userService.createUserInfo(userInfoData);
        res.status(HttpStatusCode.CREATED).json(newUserInfo)
    } catch (error) {
        console.log(error)
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR })
    }
    });

    getHomeUsersProfiles = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.params.userId;
        try {
            const matchedUsers = await this.userService.getMatchedUsers(userId);
            res.status(HttpStatusCode.OK).json(matchedUsers);
        } catch (error: unknown) {
            console.log(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
        }
    });
    
    getUserProfile = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.params.userId;
        try {
            const { user, userInfo } = await this.userService.getUserProfile(userId);
            if (!user || !userInfo) {
                res.status(HttpStatusCode.NOT_FOUND).json({ message: StatusMessage.NOT_FOUND });
                return;
            }
            res.status(HttpStatusCode.OK).json({ user, userInfo });
        } catch (error) {
            console.log(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
        }
    });
    

    updatedPersonalInfo = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const userPeronalData = req.body;
        try {
            const updatedPersonalInfo = await this.userService.updateUserPersonalInfo(userId, userPeronalData);
    
            if (!updatedPersonalInfo) {
                res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
                return;
            }
            res.status(HttpStatusCode.OK).json({
                _id: updatedPersonalInfo._id,
                name: updatedPersonalInfo.name,
                email: updatedPersonalInfo.email,
            });
        } catch (error) {
            console.log(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
        }
    });
    
      

    updateUserSubscription = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { isPremium, planId, planExpiryDate, planStartingDate } = req.body;
        if (!userId || !isPremium || !planId || !planExpiryDate) {
            res.status(HttpStatusCode.BAD_REQUEST).json({ message: StatusMessage.BAD_REQUEST });
            return;
        }
        try {
            const updatedUser = await this.userService.updateUserSubscription(userId, { isPremium, planId, planExpiryDate, planStartingDate });
            
            if (!updatedUser) {
                res.status(HttpStatusCode.NOT_FOUND).json({ message: StatusMessage.NOT_FOUND });
                return;
            }
            res.status(HttpStatusCode.OK).json({ message: "User subscription updated successfully", user: updatedUser });
        } catch (error) {
            console.log(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
        }
    });
    updateUserDatingInfo = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const uploadedPhotos = (req.files as Express.Multer.File[]) || [];
        const data = req.body;
    
        try {
            const userInfo = await this.userService.updateUserDatingInfo(userId, data, uploadedPhotos);
            res.status(HttpStatusCode.OK).json({ message: StatusMessage.SUCCESS, userInfo });
        } catch (error) {
            console.error(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
        }
    });
    
}