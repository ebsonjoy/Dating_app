import express from "express";
import { container } from '../config/container';
import { UserController } from "../controller/user/UserController";
import { userProtect } from "../middleware/userAuth";
import { multerUploadUserImg } from "../config/multer";
import validateSignup from "../validation/userValidation";
import multer from "multer";
import { checkSubscription } from "../middleware/checkSubscription ";


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
router.post("/userInfoSignUp",multerUploadUserImg.array("profilePhotos", 4),userController.createUserInfo);

// Google Login
router.post('/auth/google', userController.googleAuth);

router.get("/getHomeUsersProfiles/:userId", userProtect, userController.getHomeUsersProfiles);
router.get("/getUserProfile/:userId",userProtect, userController.getUserProfile);
router.get('/getUserDetails/:userId',userProtect,userController.getUserDetails)
router.put("/updatePersonalInfo/:userId",userProtect,upload.none(),userController.updatedPersonalInfo)
router.put("/updateDatingInfo/:userId",userProtect, multerUploadUserImg.array("profilePhotos", 4), userController.updateUserDatingInfo);

// Plan
router.get('/getUserPlans/:userId',userProtect,userController.getUserPlan)
router.put('/updateUserSubscription/:userId',userProtect,userController.updateUserSubscription)
router.get('/getUserPlanDetails/:userId',userProtect,userController.userSubscriptionDetails)
router.put('/cancelUserPlan/:userId',userProtect,userController.cancelSubscriptionPlan)



//LIKE
router.post('/handleHomeLikes',userProtect,checkSubscription,userController.handleHomeLikes)
router.get("/sentLikes/:userId",userProtect,userController.getSentLikesProfiles);
router.get("/receivedLikes/:userId",userProtect, userController.getReceivedLikesProfiles);
router.get('/getReceivedLikesCount/:userId',userProtect,userController.getReceivedLikesCount)

//MATCH
router.get('/getMathProfiles/:userId',userProtect,userController.getMathProfiles)

//ADVICE
router.get('/getAdviceCategory',userProtect,userController.getCategories)
router.get('/getArticleByCategoryId/:categoryId',userProtect,userController.getArticleByCategoryId)
router.get('/getArticleById/:articleId',userProtect,userController.getArticleById)

//NOTIFICATION
router.post('/createNotification',userProtect,userController.createNotification)
router.get('/getNotifications/:userId',userProtect,userController.getNotification)
router.delete('/clearNotifications/:userId',userProtect,userController.clearNotifications)

// BlOCK&UNBLOCK
router.put('/userBlocked',userProtect,userController.userBlocked)
router.put('/userUnblocked',userProtect,userController.userUnBlocked)
router.get('/userBlockedList/:userId',userProtect,userController.fetchBlockedUserList)

//REPORT
router.post('/createReport',userController.createReport)




export default router;
