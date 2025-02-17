import express from "express";
import { container } from '../config/container';
import { UserController } from "../controller/user/UserController";
import { userProtect } from "../middleware/userAuth";
import validateSignup from "../validation/userValidation";
import multer from "multer";
import { checkSubscription } from "../middleware/checkSubscription ";
import { checkRole } from '../middleware/roleMiddleware';
import {checkFeatureAccess} from '../middleware/checkFeatureAccess'


const upload = multer();
const router = express.Router();
const userController = container.get<UserController>('UserController')



//container User
router.post("/auth",userController.authUser);
router.post("/logoutUser",userController.logoutUser);
router.post("/register",validateSignup, userController.registerUser);
router.post("/refresh-token", userController.refreshToken);
router.post("/verifyOtp", userController.verifyOTP);
router.post("/resendOtp", userController.resendOTP);
router.post("/password-reset-request", userController.requestPasswordReset);
router.post("/reset-password/:token", userController.resetPassword);
router.post("/userInfoSignUp",userController.createUserInfo);
router.post("/getSignedUrls",userController.getPresignedUrl);

// Google Login
router.post('/auth/google', userController.googleAuth);

router.get("/getHomeUsersProfiles/:userId", userProtect,checkRole(['user']), userController.getHomeUsersProfiles);
router.get("/getUserProfile/:userId",userProtect,checkRole(['user']), userController.getUserProfile);
router.get('/getUserDetails/:userId',userProtect,checkRole(['user']),userController.getUserDetails)
router.put("/updatePersonalInfo/:userId",userProtect,checkRole(['user']),upload.none(),userController.updatedPersonalInfo)
router.put("/updateDatingInfo/:userId",userProtect,checkRole(['user']),upload.none(),userController.updateUserDatingInfo);


// Plan
router.get('/getUserPlans/:userId',userProtect,checkRole(['user']),userController.getUserPlan)
router.put('/updateUserSubscription/:userId',userProtect,checkRole(['user']),userController.updateUserSubscription)
router.get('/getUserPlanDetails/:userId',userProtect,checkRole(['user']),userController.userSubscriptionDetails)
router.put('/cancelUserPlan/:userId',userProtect,checkRole(['user']),userController.cancelSubscriptionPlan)



//LIKE
router.post('/handleHomeLikes',userProtect,checkRole(['user']),checkSubscription,userController.handleHomeLikes)
router.get("/sentLikes/:userId",userProtect,checkRole(['user']),checkFeatureAccess('VIEW_SENT_LIKES'),userController.getSentLikesProfiles);
router.get("/receivedLikes/:userId",userProtect,checkRole(['user']),checkFeatureAccess('VIEW_SENT_LIKES'),userController.getReceivedLikesProfiles);
router.get('/getReceivedLikesCount/:userId',userProtect,checkRole(['user']),userController.getReceivedLikesCount)

//MATCH
router.get('/getMathProfiles/:userId',userProtect,checkRole(['user']),userController.getMathProfiles)

//ADVICE
router.get('/getAdviceCategory',userProtect,checkRole(['user']),checkFeatureAccess('READ_DATING_ADVICE'),userController.getCategories)
router.get('/getArticleByCategoryId/:categoryId',userProtect,checkRole(['user']),checkFeatureAccess('READ_DATING_ADVICE'),userController.getArticleByCategoryId)
router.get('/getArticleById/:articleId',userProtect,checkRole(['user']),checkFeatureAccess('READ_DATING_ADVICE'),userController.getArticleById)

//NOTIFICATION
router.post('/createNotification',userProtect,checkRole(['user']),userController.createNotification)
router.get('/getNotifications/:userId',userProtect,checkRole(['user']),userController.getNotification)
router.delete('/clearNotifications/:userId',userProtect,checkRole(['user']),userController.clearNotifications)

// BlOCK&UNBLOCK
router.put('/userBlocked',userProtect,checkRole(['user']),userController.userBlocked)
router.put('/userUnblocked',userProtect,checkRole(['user']),userController.userUnBlocked)
router.get('/userBlockedList/:userId',userProtect,checkRole(['user']),userController.fetchBlockedUserList)

//REPORT
router.post('/createReport',userProtect,checkRole(['user']),userController.createReport)
router.get('/getUserPlanFeatures',userProtect,userController.getUserPlanFeatures)




export default router;
