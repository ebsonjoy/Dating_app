import express from "express";
import { container } from '../config/container';
import { UserController } from "../controller/user/UserController";
import { PlanController } from '../controller/plan/PlanController';
import { protect } from "../middleware/AuthMiddleware";
import { multerUploadUserProfile } from "../config/multerConfig";
import multer from "multer";


// import UserController from "../controller/userController";
// import { getUserPlans } from "../controller/planController";
// import planController from "../controller/planController";
// import { UserController } from "../controller/user/UserController";

const upload = multer();
const router = express.Router();
const userController = container.get<UserController>('UserController')
const planController = container.get<PlanController>('PlanController');

//container User
router.post("/auth",userController.authUser);
router.post("/logoutUser",userController.logoutUser);
router.post("/register", userController.registerUser);
router.post("/verifyOtp", userController.verifyOTP);
router.post("/resendOtp", userController.resendOTP);
router.post("/password-reset-request", userController.requestPasswordReset);
router.post("/reset-password/:token", userController.resetPassword);
router.post("/userInfoSignUp",multerUploadUserProfile.array("profilePhotos", 4),userController.createUserInfo);
router.get("/getHomeUsersProfiles/:userId", protect, userController.getHomeUsersProfiles);
router.get("/getUserProfile/:userId", userController.getUserProfile);
router.put("/updatePersonalInfo/:userId",upload.none(),userController.updatedPersonalInfo)
router.put("/updateDatingInfo/:userId", multerUploadUserProfile.array("profilePhotos", 4), userController.updateUserDatingInfo);
// Plan
router.get('/getUserPlans',planController.getUserPlan)
router.put('/updateUserSubscription/:userId',userController.updateUserSubscription)



// Public Routes
// router.post("/auth", UserController.authUser); //  user authentication
// router.post("/logoutUser", UserController.logoutUser);
// router.post("/register", UserController.registerUser); // user registration
// router.post("/verifyOtp", UserController.verifyOTP);
// router.post("/resendOtp", UserController.resendOTP);
// router.post("/password-reset-request", UserController.requestPasswordReset);
// router.post("/reset-password/:token", UserController.resetPassword);
// Route to create user info
// router.post(
//   "/userInfoSignUp",
//   multerUploadUserProfile.array("profilePhotos", 4),
//   UserController.createUserInfo
// );
// router.get("/getHomeUsersProfiles/:userId", protect, UserController.getHomeUsersProfiles);

// router.get("/getUserProfile/:userId", UserController.getUserProfile);
// router.put("/updatePersonalInfo/:userId",upload.none(),UserController.updatedPersonalInfo)

// router.put("/updateDatingInfo/:userId", multerUploadUserProfile.array("profilePhotos", 4), UserController.updateUserDatingInfo);

// router.put('/updateUserProfile/:userId', multerUploadUserProfile.array("profilePhotos", 4),updateUserProfile);
// fetch plans
// router.get('/getUserPlans',planController.getUserPlans)
//payment
// router.put('/updateUserSubscription/:userId',UserController.updateUserSubscription)

// router.get('/getUserPlanDetails/:userId',getUserPlanDetails)

export default router;
