import express from "express";
import { container } from '../config/container';
import { UserController } from "../controller/user/UserController";
// import { PlanController } from '../controller/plan/PlanController';
// import { protect } from "../middleware/AuthMiddleware";
import { userProtect } from "../middleware/userAuth";
// import { multerUploadUserProfile } from "../config/multerConfig";
import { multerUploadUserImg } from "../config/multer";
import validateSignup from "../validation/userValidation";
import multer from "multer";


const upload = multer();
const router = express.Router();
const userController = container.get<UserController>('UserController')
// const planController = container.get<PlanController>('PlanController');


//container User
router.post("/auth",userController.authUser);
router.post("/logoutUser",userController.logoutUser);
router.post("/register",validateSignup, userController.registerUser);
router.post("/refresh-token", userController.refreshToken);

router.post("/verifyOtp", userController.verifyOTP);
router.post("/resendOtp", userController.resendOTP);
router.post("/password-reset-request", userController.requestPasswordReset);
router.post("/reset-password/:token", userController.resetPassword);
// router.post("/userInfoSignUp",multerUploadUserProfile.array("profilePhotos", 4),userController.createUserInfo);
router.post("/userInfoSignUp",multerUploadUserImg.array("profilePhotos", 4),userController.createUserInfo);

router.get("/getHomeUsersProfiles/:userId", userProtect, userController.getHomeUsersProfiles);
router.get("/getUserProfile/:userId",userProtect, userController.getUserProfile);
router.put("/updatePersonalInfo/:userId",userProtect,upload.none(),userController.updatedPersonalInfo)
router.put("/updateDatingInfo/:userId",userProtect, multerUploadUserImg.array("profilePhotos", 4), userController.updateUserDatingInfo);

// Plan
router.get('/getUserPlans/:userId',userProtect,userController.getUserPlan)
router.put('/updateUserSubscription/:userId',userProtect,userController.updateUserSubscription)
router.get('/getUserPlanDetails/:userId',userProtect,userController.userSubscriptionDetails)
router.put('/cancelUserPlan/:userId',userProtect,userController.cancelSubscriptionPlan)


// Google Login
router.post('/auth/google', userController.googleAuth);

//LIKE
router.post('/handleHomeLikes',userProtect,userController.handleHomeLikes)
router.get("/sentLikes/:userId",userProtect,userController.getSentLikesProfiles);
router.get("/receivedLikes/:userId",userProtect, userController.getReceivedLikesProfiles);
router.get('/getReceivedLikesCount/:userId',userProtect,userController.getReceivedLikesCount)

//MATCH

router.get('/getMathProfiles/:userId',userProtect,userController.getMathProfiles)

export default router;
