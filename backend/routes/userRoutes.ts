import express from "express";
import { container } from '../config/container';
import { UserController } from "../controller/user/UserController";
// import { PlanController } from '../controller/plan/PlanController';
import { protect } from "../middleware/AuthMiddleware";
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
router.post("/verifyOtp", userController.verifyOTP);
router.post("/resendOtp", userController.resendOTP);
router.post("/password-reset-request", userController.requestPasswordReset);
router.post("/reset-password/:token", userController.resetPassword);
// router.post("/userInfoSignUp",multerUploadUserProfile.array("profilePhotos", 4),userController.createUserInfo);
router.post("/userInfoSignUp",multerUploadUserImg.array("profilePhotos", 4),userController.createUserInfo);

router.get("/getHomeUsersProfiles/:userId", protect, userController.getHomeUsersProfiles);
router.get("/getUserProfile/:userId",protect, userController.getUserProfile);
router.put("/updatePersonalInfo/:userId",upload.none(),userController.updatedPersonalInfo)
router.put("/updateDatingInfo/:userId", multerUploadUserImg.array("profilePhotos", 4), userController.updateUserDatingInfo);

// Plan
router.get('/getUserPlans/:userId',userController.getUserPlan)
router.put('/updateUserSubscription/:userId',userController.updateUserSubscription)
router.get('/getUserPlanDetails/:userId',userController.userSubscriptionDetails)
router.put('/cancelUserPlan/:userId',userController.cancelSubscriptionPlan)


// Google Login
router.post('/auth/google', userController.googleAuth);

//LIKE
router.post('/handleHomeLikes',userController.handleHomeLikes)
router.get("/sentLikes/:userId", userController.getSentLikesProfiles);
router.get("/receivedLikes/:userId", userController.getReceivedLikesProfiles);

//MATCH

router.get('/getMathProfiles/:userId',userController.getMathProfiles)

export default router;
