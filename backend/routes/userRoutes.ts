import express from "express";
import {
  authUser,
  registerUser,
  verifyOTP,
  createUserInfo,
  resendOTP,
  getHomeUsersProfiles,
  logoutUser,
  requestPasswordReset,
  resetPassword,
  getUserProfile,
  updateUserProfile,
} from "../controller/userController";
import { multerUploadUserProfile } from "../config/multerConfig";
import { protect } from "../middleware/AuthMiddleware";

const router = express.Router();

// Public Routes
router.post("/auth", authUser); //  user authentication
router.post("/logoutUser", logoutUser);
router.post("/register", registerUser); // user registration
router.post("/verifyOtp", verifyOTP);
router.post("/resendOtp", resendOTP);
router.post("/password-reset-request", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);
// Route to create user info
router.post(
  "/userInfoSignUp",
  multerUploadUserProfile.array("profilePhotos", 4),
  createUserInfo
);
router.get("/getHomeUsersProfiles/:userId", protect, getHomeUsersProfiles);

router.get("/getUserProfile/:userId", getUserProfile);
router.put('/updateUserProfile/:userId', multerUploadUserProfile.array("profilePhotos", 4),updateUserProfile);

export default router;
