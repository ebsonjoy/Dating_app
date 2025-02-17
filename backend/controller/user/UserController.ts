import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { IUserService } from '../../interfaces/user/IUserService';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { inject, injectable } from 'inversify';
import { StatusMessage } from '../../enums/StatusMessage';
import { GoogleAuthService } from '../../services/user/googleAuthService';
import TokenService from '../../utils/tokenService';
import { s3Service  } from '../../config/s3Service';

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
                res.status(HttpStatusCode.FORBIDDEN).json({ message: StatusMessage.ACCOUNT_BLOCKED });
                return;
            }
            const accessToken = TokenService.generateAccessToken(user._id.toString(),user.role);
            const refreshToken = TokenService.generateRefreshToken(user._id.toString(),user.role)

            TokenService.setTokenCookies(res, accessToken, refreshToken);
            res.status(HttpStatusCode.OK).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } catch (error) {
            console.log(error)
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
        }
    });
    

    logoutUser = asyncHandler(async (req: Request, res: Response) => {
        try {
            res.cookie('accessToken', '', { 
                httpOnly: true, 
                expires: new Date(0) 
              });
              res.cookie('refreshToken', '', { 
                httpOnly: true, 
                expires: new Date(0) 
              });
            res.status(HttpStatusCode.OK).json({ message: StatusMessage.SUCCESS });
        } catch (error) {
            console.log(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
        }
    });


    refreshToken = asyncHandler(async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          res.status(401).json({ message: 'No refresh token' });
          return 
        }
    
        const decoded = TokenService.verifyRefreshToken(refreshToken);
        
        if (!decoded) {
           res.status(401).json({ message: 'Invalid refresh token' });
           return 
        }

        const user = await this.userService.getUserById(decoded.userId)    
        if (!user) {
           res.status(401).json({ message: 'User not found' });
           return 
        }
    
        const newAccessToken = TokenService.generateAccessToken(user._id.toString(),user.role);
    
        TokenService.setTokenCookies(res, newAccessToken, refreshToken);
    
        res.status(200).json({ message: 'Token refreshed successfully' });
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



    googleAuth = asyncHandler(async (req: Request, res: Response) => {
        try {
          const { credential } = req.body;
          const googleAuthService = new GoogleAuthService();
          const payload = await googleAuthService.verifyGoogleToken(credential);
          if (!payload) {
            res.status(HttpStatusCode.UNAUTHORIZED).json({ 
              message: 'Invalid Google token' 
            });
            return;
          }
      
          const user = await googleAuthService.findOrCreateUser(payload);
          
          if (!user.status) {
            res.status(HttpStatusCode.FORBIDDEN).json({ 
              message: StatusMessage.ACCOUNT_BLOCKED 
            });
            return;
          }
            const accessToken = TokenService.generateAccessToken(user._id.toString(),user.role);
            const refreshToken = TokenService.generateRefreshToken(user._id.toString(),user.role)

            TokenService.setTokenCookies(res, accessToken, refreshToken);
          
          res.status(HttpStatusCode.OK).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role : user.role,
            isGoogleLogin:user.isGoogleLogin,
          });
        } catch (error) {
          console.error('Google Auth Error:', error);
          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ 
            message: StatusMessage.INTERNAL_SERVER_ERROR 
          });
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

    getPresignedUrl = asyncHandler(async(req: Request, res: Response) => {
        const { fileTypes } = req.body;
    
        if (!fileTypes || !Array.isArray(fileTypes)) {
           res.status(HttpStatusCode.BAD_REQUEST)
            .json({ message: "File types are required" });
            return
        }
    
        try {
          const signedUrls = await s3Service.generateSignedUrls(fileTypes);
          res.json({ signedUrls });
        } catch (error) {
          console.error('Error generating signed URLs:', error);
          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
        }
      });
  
    createUserInfo = asyncHandler(async (req: Request, res: Response) => {    

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
            profilePhotos: req.body.profilePhotos,
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
    
    getUserDetails = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.params.userId;
        try {
            const matchedUsers = await this.userService.getUserDetails(userId);
            res.status(HttpStatusCode.OK).json(matchedUsers);
        } catch (error: unknown) {
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
    
    updateUserDatingInfo = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const uploadedPhotos = Array.isArray(req.body.profilePhotos) 
                               ? req.body.profilePhotos 
                               : [req.body.profilePhotos];
        const data = req.body;
        try {
            const userInfo = await this.userService.updateUserDatingInfo(userId, data, uploadedPhotos);
            res.status(HttpStatusCode.OK).json({ message: StatusMessage.SUCCESS,userInfo});
        } catch (error) {
            console.error(error);
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

    getUserPlan = asyncHandler(async (req: Request, res: Response) => {
        const {userId} = req.params;
        try {
            const plans = await this.userService.fetchUserPlans(userId);
            res.status(HttpStatusCode.OK).json(plans);
        } catch (error) {
            console.log(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
        }
      });

    userSubscriptionDetails = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
        try {
            const details = await this.userService.getUserSubscriptionDetails(userId);
            if (!details) {
                 res.status(HttpStatusCode.NOT_FOUND).json({ message: "User or subscription details not found" });
                 return
            }
            res.status(HttpStatusCode.OK).json(details);
        } catch (error) {
            console.error(`Error fetching subscription details: ${error}`);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to retrieve user subscription details" });
        }
    });

    cancelSubscriptionPlan = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
        try {
          const updatedUser = await this.userService.cancelSubscriptionPlan(userId);
          if (!updatedUser) {
             res
              .status(HttpStatusCode.NOT_FOUND)
              .json({ message: 'User not found or subscription cancellation failed' });
              return
          }
          res.status(HttpStatusCode.OK).json({ message: 'Subscription cancelled successfully' });
        } catch (err) {
            const error = err as Error
          console.error(`Error cancelling subscription: ${error.message}`);
          res
            .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .json({ message: 'Failed to cancel subscription' });
        }
      });

    handleHomeLikes = asyncHandler(async(req:Request, res:Response)=>{
        const {likerId,likedUserId} = req.body
        try {
            const result = await this.userService.handleHomeLikes({ likerId, likedUserId });
            console.log(result)
            res.status(HttpStatusCode.OK).json(result);

            
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to like user', error });
        }
    })

    getSentLikesProfiles = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
    
        try {
          const profiles = await this.userService.getSentLikesProfiles(userId);
          res.status(HttpStatusCode.OK).json(profiles);
        } catch (error) {
            console.log(error)
          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to retrieve sent likes profiles", error });
        }
      });

      getReceivedLikesProfiles = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
    
        try {
          const profiles = await this.userService.getReceivedLikesProfiles(userId);
          res.status(HttpStatusCode.OK).json(profiles);
        } catch (error) {
          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to retrieve received likes profiles", error });
        }
      });

      getMathProfiles = asyncHandler(async(req: Request,res:Response)=>{
        const {userId} = req.params
        try {
            const mathProfiles = await this.userService.getmatchProfile(userId)
            res.status(HttpStatusCode.OK).json(mathProfiles)
        } catch (error) {
            console.log(error);
          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to retrieve Match profiles", error });
            
        }
      })

      getReceivedLikesCount = asyncHandler(async(req: Request,res:Response)=>{
        const {userId} = req.params
        try {
            const count = await this.userService.getReceivedLikesCount(userId);
            res.status(200).json({ count });
        } catch (error) {
            console.error("Error in LikeController:", error);
            res.status(500).json({ message: "Failed to fetch received likes count" });
        }
    })

    getCategories = asyncHandler(async(req: Request,res:Response)=>{
        try{
            const category = await this.userService.getAdviceCategory()
            res.status(HttpStatusCode.OK).json(category)
        }catch(error){
            console.log(error)
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch category" });
        }
    })
    
    getArticleByCategoryId = asyncHandler(async(req: Request,res:Response)=>{
        const {categoryId} = req.params
        try{
            const article = await this.userService.getArticleByCategoryId(categoryId)
            res.status(HttpStatusCode.OK).json(article)
        }catch(error){
            console.log(error)
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch article" });
        }
    })

    getArticleById = asyncHandler(async(req: Request,res:Response)=>{
        const {articleId} = req.params
        try{
            const article = await this.userService.getArticleById(articleId)
            res.status(HttpStatusCode.OK).json(article)
        }catch(error){
            console.log(error)
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch article" });
        }
    })

    createNotification = asyncHandler(async(req: Request,res:Response)=>{
        const notification = req.body
        try{
            const noti= await this.userService.createNotification(notification)
            res.status(HttpStatusCode.OK).json(noti)

        }catch(err){
            console.log(err)
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to create notification" });
        }
    })

    getNotification = asyncHandler(async(req: Request,res:Response)=>{
        const {userId} = req.params
        try{
            const noti = await this.userService.getNotifications(userId)
            res.status(HttpStatusCode.OK).json(noti)

        }catch(err){
            console.log(err)
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch notification" });
        }
    })

    clearNotifications = asyncHandler(async(req: Request,res:Response)=>{
        const {userId} = req.params
        try{
            const noti = await this.userService.clearNotifications(userId)
            res.status(HttpStatusCode.OK).json(noti)

        }catch(err){
            console.log(err)
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to clear notification" });
        }
    })

    userBlocked = asyncHandler(async (req: Request, res: Response) => {
        const { userId, blockedUserId } = req.body;
    
        try {
            const user = await this.userService.userBlocked(userId, blockedUserId);
    
            if (!user) {
                    res
                    .status(HttpStatusCode.NOT_FOUND)
                    .json({ message: 'User not found' });
                    return
            }
    
                 res
                .status(HttpStatusCode.OK)
                .json({ 
                    message: 'Blocked successfully', 
                    data: user 
                });
                return
        } catch (err) {
            console.error('Error in userBlocked controller:', err);
    
                 res
                .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ message: 'Failed to block user' });
                return
        }
    });

    userUnBlocked = asyncHandler(async (req: Request, res: Response) => {
        const { userId, blockedUserId } = req.body;
    
        try {
            const user = await this.userService.userUnblocked(userId, blockedUserId);
    
            if (!user) {
                    res
                    .status(HttpStatusCode.NOT_FOUND)
                    .json({ message: 'User not found' });
                    return
            }
    
                 res
                .status(HttpStatusCode.OK)
                .json({ 
                    message: 'Unblocked successfully', 
                    data: user 
                });
                return
        } catch (err) {
            console.error('Error in userBlocked controller:', err);
                 res
                .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ message: 'Failed to block user' });
                return
        }
    });

    fetchBlockedUserList = asyncHandler(async (req: Request, res: Response) => {
        const {userId} = req.params
        try{
          const  blockeList = await this.userService.userBlockedList(userId)
            if(!blockeList){
                res
                    .status(HttpStatusCode.NOT_FOUND)
                    .json({ message: 'User not found' });
                    return
            }

            res
            .status(HttpStatusCode.OK)
            .json(blockeList);
            return
        }catch (err) {
            console.error('Error in fetch user blocked list:', err);
                 res
                .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ message: 'Failed to fetch user block list' });
                return
        }
    })

    createReport = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        try {
            const { reporterId, reportedId, reason, additionalDetails } = req.body;
            
            if (!reporterId || !reportedId || !reason) {
                res.status(400).json({ message: 'Reporter ID, Reported ID, and Reason are required.' });
                return;
            }
            const report = await this.userService.createReport({
                reporterId,
                reportedId,
                reason,
                additionalDetails,
                status: 'Pending',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            res.status(201).json({ message: 'Report created successfully.', report });
        } catch (err:unknown) {
            const error = err as Error
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    });

    getUserPlanFeatures = asyncHandler(async(req:Request, res:Response)=>{
        const PlanFeatures = await this.userService.getUserPlanFeatures()
        if(!PlanFeatures){
          res.status(400).json({ message: "No features" });
        }
        res.status(200).json(PlanFeatures)
      })
}