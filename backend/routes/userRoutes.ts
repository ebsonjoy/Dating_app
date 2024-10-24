import express from "express";
// import {
//   authUser,
//   registerUser,
//   verifyOTP,
//   createUserInfo,
//   resendOTP,
//   getHomeUsersProfiles,
//   logoutUser,
//   requestPasswordReset,
//   resetPassword,
//   getUserProfile,
//   updatedPersonalInfo,
//   updateUserDatingInfo,
//   updateUserSubscription,
//   // getUserPlanDetails,
// } from "../controller/userController";
import UserController from "../controller/userController";
import { multerUploadUserProfile } from "../config/multerConfig";
// import { getUserPlans } from "../controller/planController";
import { protect } from "../middleware/AuthMiddleware";
import planController from "../controller/planController";
import multer from "multer";
const upload = multer();
const router = express.Router();

// Public Routes
router.post("/auth", UserController.authUser); //  user authentication
router.post("/logoutUser", UserController.logoutUser);
router.post("/register", UserController.registerUser); // user registration
router.post("/verifyOtp", UserController.verifyOTP);
router.post("/resendOtp", UserController.resendOTP);
router.post("/password-reset-request", UserController.requestPasswordReset);
router.post("/reset-password/:token", UserController.resetPassword);
// Route to create user info
router.post(
  "/userInfoSignUp",
  multerUploadUserProfile.array("profilePhotos", 4),
  UserController.createUserInfo
);
router.get("/getHomeUsersProfiles/:userId", protect, UserController.getHomeUsersProfiles);

router.get("/getUserProfile/:userId", UserController.getUserProfile);
router.put("/updatePersonalInfo/:userId",upload.none(),UserController.updatedPersonalInfo)

router.put("/updateDatingInfo/:userId", multerUploadUserProfile.array("profilePhotos", 4), UserController.updateUserDatingInfo);

// router.put('/updateUserProfile/:userId', multerUploadUserProfile.array("profilePhotos", 4),updateUserProfile);
// fetch plans
router.get('/getUserPlans',planController.getUserPlans)
//payment
router.put('/updateUserSubscription/:userId',UserController.updateUserSubscription)

// router.get('/getUserPlanDetails/:userId',getUserPlanDetails)

export default router;
