import express from "express";
import { container } from '../config/container';
import { UserController } from "../controller/user/UserController";
import { PlanController } from '../controller/plan/PlanController';
import { protect } from "../middleware/AuthMiddleware";
import { multerUploadUserProfile } from "../config/multerConfig";
import validateSignup from "../validation/userValidation";
import multer from "multer";


const upload = multer();
const router = express.Router();
const userController = container.get<UserController>('UserController')
const planController = container.get<PlanController>('PlanController');


//container User
router.post("/auth",userController.authUser);
router.post("/logoutUser",userController.logoutUser);
router.post("/register",validateSignup, userController.registerUser);
router.post("/verifyOtp", userController.verifyOTP);
router.post("/resendOtp", userController.resendOTP);
router.post("/password-reset-request", userController.requestPasswordReset);
router.post("/reset-password/:token", userController.resetPassword);
router.post("/userInfoSignUp",multerUploadUserProfile.array("profilePhotos", 4),userController.createUserInfo);
router.get("/getHomeUsersProfiles/:userId", protect, userController.getHomeUsersProfiles);
router.get("/getUserProfile/:userId",protect, userController.getUserProfile);
router.put("/updatePersonalInfo/:userId",validateSignup,upload.none(),userController.updatedPersonalInfo)
router.put("/updateDatingInfo/:userId", multerUploadUserProfile.array("profilePhotos", 4), userController.updateUserDatingInfo);

// Plan
router.get('/getUserPlans',planController.getUserPlan)
router.put('/updateUserSubscription/:userId',userController.updateUserSubscription)

export default router;
