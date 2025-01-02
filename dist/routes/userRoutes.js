"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_1 = require("../config/container");
const userAuth_1 = require("../middleware/userAuth");
const multer_1 = require("../config/multer");
const userValidation_1 = __importDefault(require("../validation/userValidation"));
const multer_2 = __importDefault(require("multer"));
const checkSubscription_1 = require("../middleware/checkSubscription ");
const upload = (0, multer_2.default)();
const router = express_1.default.Router();
const userController = container_1.container.get('UserController');
//container User
router.post("/auth", userController.authUser);
router.post("/logoutUser", userController.logoutUser);
router.post("/register", userValidation_1.default, userController.registerUser);
router.post("/refresh-token", userController.refreshToken);
router.post("/verifyOtp", userController.verifyOTP);
router.post("/resendOtp", userController.resendOTP);
router.post("/password-reset-request", userController.requestPasswordReset);
router.post("/reset-password/:token", userController.resetPassword);
router.post("/userInfoSignUp", multer_1.multerUploadUserImg.array("profilePhotos", 4), userController.createUserInfo);
// Google Login
router.post('/auth/google', userController.googleAuth);
router.get("/getHomeUsersProfiles/:userId", userAuth_1.userProtect, userController.getHomeUsersProfiles);
router.get("/getUserProfile/:userId", userAuth_1.userProtect, userController.getUserProfile);
router.get('/getUserDetails/:userId', userAuth_1.userProtect, userController.getUserDetails);
router.put("/updatePersonalInfo/:userId", userAuth_1.userProtect, upload.none(), userController.updatedPersonalInfo);
router.put("/updateDatingInfo/:userId", userAuth_1.userProtect, multer_1.multerUploadUserImg.array("profilePhotos", 4), userController.updateUserDatingInfo);
// Plan
router.get('/getUserPlans/:userId', userAuth_1.userProtect, userController.getUserPlan);
router.put('/updateUserSubscription/:userId', userAuth_1.userProtect, userController.updateUserSubscription);
router.get('/getUserPlanDetails/:userId', userAuth_1.userProtect, userController.userSubscriptionDetails);
router.put('/cancelUserPlan/:userId', userAuth_1.userProtect, userController.cancelSubscriptionPlan);
//LIKE
router.post('/handleHomeLikes', userAuth_1.userProtect, checkSubscription_1.checkSubscription, userController.handleHomeLikes);
router.get("/sentLikes/:userId", userAuth_1.userProtect, userController.getSentLikesProfiles);
router.get("/receivedLikes/:userId", userAuth_1.userProtect, userController.getReceivedLikesProfiles);
router.get('/getReceivedLikesCount/:userId', userAuth_1.userProtect, userController.getReceivedLikesCount);
//MATCH
router.get('/getMathProfiles/:userId', userAuth_1.userProtect, userController.getMathProfiles);
//ADVICE
router.get('/getAdviceCategory', userAuth_1.userProtect, userController.getCategories);
router.get('/getArticleByCategoryId/:categoryId', userAuth_1.userProtect, userController.getArticleByCategoryId);
router.get('/getArticleById/:articleId', userAuth_1.userProtect, userController.getArticleById);
//NOTIFICATION
router.post('/createNotification', userAuth_1.userProtect, userController.createNotification);
router.get('/getNotifications/:userId', userAuth_1.userProtect, userController.getNotification);
router.delete('/clearNotifications/:userId', userAuth_1.userProtect, userController.clearNotifications);
exports.default = router;
