"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const HttpStatusCode_1 = require("../../enums/HttpStatusCode");
// import generateToken from '../../utils/generateToken';
const inversify_1 = require("inversify");
const StatusMessage_1 = require("../../enums/StatusMessage");
const googleAuthService_1 = require("../../services/user/googleAuthService");
const tokenService_1 = __importDefault(require("../../utils/tokenService"));
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
        this.authUser = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield this.userService.authenticateUser(email, password);
                if (!user) {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ message: StatusMessage_1.StatusMessage.NOT_FOUND });
                    return;
                }
                if (user.status === false) {
                    res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN).json({ message: StatusMessage_1.StatusMessage.ACCOUNT_BLOCKED });
                    return;
                }
                const accessToken = tokenService_1.default.generateAccessToken(user._id.toString());
                const refreshToken = tokenService_1.default.generateRefreshToken(user._id.toString());
                tokenService_1.default.setTokenCookies(res, accessToken, refreshToken);
                // generateToken(res, user._id.toString());
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                });
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.logoutUser = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.cookie('accessToken', '', {
                    httpOnly: true,
                    expires: new Date(0)
                });
                res.cookie('refreshToken', '', {
                    httpOnly: true,
                    expires: new Date(0)
                });
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.SUCCESS });
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.refreshToken = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                res.status(401).json({ message: 'No refresh token' });
                return;
            }
            const decoded = tokenService_1.default.verifyRefreshToken(refreshToken);
            if (!decoded) {
                res.status(401).json({ message: 'Invalid refresh token' });
                return;
            }
            const user = yield this.userService.getUserById(decoded.userId);
            if (!user) {
                res.status(401).json({ message: 'User not found' });
                return;
            }
            const newAccessToken = tokenService_1.default.generateAccessToken(user._id.toString());
            tokenService_1.default.setTokenCookies(res, newAccessToken, refreshToken);
            res.status(200).json({ message: 'Token refreshed successfully' });
        }));
        this.registerUser = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, mobileNumber, dateOfBirth } = req.body;
                const userExists = yield this.userService.authenticateUser(email, password);
                if (userExists) {
                    res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ message: StatusMessage_1.StatusMessage.BAD_REQUEST });
                    return;
                }
                const user = yield this.userService.registerUser({ name, email, password, mobileNumber, dateOfBirth });
                res.status(HttpStatusCode_1.HttpStatusCode.CREATED).json(user);
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.googleAuth = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { credential } = req.body;
                const googleAuthService = new googleAuthService_1.GoogleAuthService();
                const payload = yield googleAuthService.verifyGoogleToken(credential);
                if (!payload) {
                    res.status(HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({
                        message: 'Invalid Google token'
                    });
                    return;
                }
                const user = yield googleAuthService.findOrCreateUser(payload);
                if (!user.status) {
                    res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN).json({
                        message: StatusMessage_1.StatusMessage.ACCOUNT_BLOCKED
                    });
                    return;
                }
                //   generateToken(res, user._id.toString());
                const accessToken = tokenService_1.default.generateAccessToken(user._id.toString());
                const refreshToken = tokenService_1.default.generateRefreshToken(user._id.toString());
                tokenService_1.default.setTokenCookies(res, accessToken, refreshToken);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isGoogleLogin: user.isGoogleLogin,
                });
            }
            catch (error) {
                console.error('Google Auth Error:', error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                    message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR
                });
            }
        }));
        this.resendOTP = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { emailId } = req.body;
                if (!emailId) {
                    res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ message: StatusMessage_1.StatusMessage.BAD_REQUEST });
                    return;
                }
                const result = yield this.userService.resendOTP(emailId);
                res.status(result.success ? HttpStatusCode_1.HttpStatusCode.OK : HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json(result);
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.verifyOTP = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { emailId, otp } = req.body;
            if (!emailId || !otp) {
                res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ message: StatusMessage_1.StatusMessage.BAD_REQUEST });
                return;
            }
            try {
                const isVerified = yield this.userService.verifyOTP(emailId, otp);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: isVerified });
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ success: false, message: StatusMessage_1.StatusMessage.BAD_REQUEST });
            }
        }));
        this.requestPasswordReset = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            if (!email) {
                res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ message: StatusMessage_1.StatusMessage.BAD_REQUEST });
                return;
            }
            try {
                yield this.userService.requestPasswordReset(email);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.SUCCESS });
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ message: StatusMessage_1.StatusMessage.BAD_REQUEST });
            }
        }));
        this.resetPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { token } = req.params;
            const { password } = req.body;
            try {
                yield this.userService.resetPassword(token, password);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.SUCCESS });
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.createUserInfo = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const profilePhotos = req.files || [];
            if (typeof req.body.location === 'string') {
                req.body.location = JSON.parse(req.body.location);
            }
            if (!req.body.location ||
                req.body.location.type !== 'Point' ||
                !Array.isArray(req.body.location.coordinates) ||
                req.body.location.coordinates.length !== 2 ||
                isNaN(req.body.location.coordinates[0]) ||
                isNaN(req.body.location.coordinates[1])) {
                res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ message: StatusMessage_1.StatusMessage.BAD_REQUEST });
                return;
            }
            try {
                const userInfoData = Object.assign(Object.assign({}, req.body), { profilePhotos: profilePhotos.map((file) => file.location) });
                const newUserInfo = yield this.userService.createUserInfo(userInfoData);
                res.status(HttpStatusCode_1.HttpStatusCode.CREATED).json(newUserInfo);
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.getHomeUsersProfiles = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            try {
                const matchedUsers = yield this.userService.getMatchedUsers(userId);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json(matchedUsers);
                // console.log(matchedUsers)
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.getUserProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            try {
                const { user, userInfo } = yield this.userService.getUserProfile(userId);
                if (!user || !userInfo) {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ message: StatusMessage_1.StatusMessage.NOT_FOUND });
                    return;
                }
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ user, userInfo });
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.getUserDetails = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            try {
                const matchedUsers = yield this.userService.getUserDetails(userId);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json(matchedUsers);
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.updatedPersonalInfo = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const userPeronalData = req.body;
            try {
                const updatedPersonalInfo = yield this.userService.updateUserPersonalInfo(userId, userPeronalData);
                if (!updatedPersonalInfo) {
                    res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
                    return;
                }
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                    _id: updatedPersonalInfo._id,
                    name: updatedPersonalInfo.name,
                    email: updatedPersonalInfo.email,
                });
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.updateUserDatingInfo = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const uploadedPhotos = req.files || [];
            const data = req.body;
            try {
                const userInfo = yield this.userService.updateUserDatingInfo(userId, data, uploadedPhotos);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.SUCCESS, userInfo });
            }
            catch (error) {
                console.error(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.updateUserSubscription = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const { isPremium, planId, planExpiryDate, planStartingDate } = req.body;
            if (!userId || !isPremium || !planId || !planExpiryDate) {
                res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ message: StatusMessage_1.StatusMessage.BAD_REQUEST });
                return;
            }
            try {
                const updatedUser = yield this.userService.updateUserSubscription(userId, { isPremium, planId, planExpiryDate, planStartingDate });
                if (!updatedUser) {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ message: StatusMessage_1.StatusMessage.NOT_FOUND });
                    return;
                }
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: "User subscription updated successfully", user: updatedUser });
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.getUserPlan = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                const plans = yield this.userService.fetchUserPlans(userId);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json(plans);
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.userSubscriptionDetails = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                const details = yield this.userService.getUserSubscriptionDetails(userId);
                if (!details) {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ message: "User or subscription details not found" });
                    return;
                }
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json(details);
            }
            catch (error) {
                console.error(`Error fetching subscription details: ${error}`);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to retrieve user subscription details" });
            }
        }));
        this.cancelSubscriptionPlan = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                const updatedUser = yield this.userService.cancelSubscriptionPlan(userId);
                if (!updatedUser) {
                    res
                        .status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND)
                        .json({ message: 'User not found or subscription cancellation failed' });
                    return;
                }
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: 'Subscription cancelled successfully' });
            }
            catch (error) {
                console.error(`Error cancelling subscription: ${error.message}`);
                res
                    .status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
                    .json({ message: 'Failed to cancel subscription' });
            }
        }));
        this.handleHomeLikes = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { likerId, likedUserId } = req.body;
            try {
                const result = yield this.userService.handleHomeLikes({ likerId, likedUserId });
                console.log(result);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json(result);
            }
            catch (error) {
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to like user', error });
            }
        }));
        this.getSentLikesProfiles = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                const profiles = yield this.userService.getSentLikesProfiles(userId);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json(profiles);
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to retrieve sent likes profiles", error });
            }
        }));
        this.getReceivedLikesProfiles = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                const profiles = yield this.userService.getReceivedLikesProfiles(userId);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json(profiles);
            }
            catch (error) {
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to retrieve received likes profiles", error });
            }
        }));
        this.getMathProfiles = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                const mathProfiles = yield this.userService.getmatchProfile(userId);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json(mathProfiles);
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to retrieve Match profiles", error });
            }
        }));
        this.getReceivedLikesCount = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                const count = yield this.userService.getReceivedLikesCount(userId);
                res.status(200).json({ count });
            }
            catch (error) {
                console.error("Error in LikeController:", error);
                res.status(500).json({ message: "Failed to fetch received likes count" });
            }
        }));
        this.getCategories = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield this.userService.getAdviceCategory();
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json(category);
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch category" });
            }
        }));
        this.getArticleByCategoryId = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { categoryId } = req.params;
            try {
                const article = yield this.userService.getArticleByCategoryId(categoryId);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json(article);
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch article" });
            }
        }));
        this.getArticleById = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { articleId } = req.params;
            try {
                const article = yield this.userService.getArticleById(articleId);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json(article);
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch article" });
            }
        }));
        this.createNotification = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const notification = req.body;
            try {
                const noti = yield this.userService.createNotification(notification);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json(noti);
            }
            catch (err) {
                console.log(err);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to create notification" });
            }
        }));
        this.getNotification = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                const noti = yield this.userService.getNotifications(userId);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json(noti);
            }
            catch (err) {
                console.log(err);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch notification" });
            }
        }));
        this.clearNotifications = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                const noti = yield this.userService.clearNotifications(userId);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json(noti);
            }
            catch (err) {
                console.log(err);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to clear notification" });
            }
        }));
    }
};
exports.UserController = UserController;
exports.UserController = UserController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IUserService')),
    __metadata("design:paramtypes", [Object])
], UserController);
