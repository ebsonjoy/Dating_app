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
exports.UserService = void 0;
const inversify_1 = require("inversify");
const userOtp_1 = require("../../utils/userOtp");
const resetGmail_1 = require("../../utils/resetGmail");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// import Plan from "../../models/PlanModel";
const calculateAge_1 = require("../../utils/calculateAge");
const mongoose_1 = __importDefault(require("mongoose"));
const multer_1 = require("../../config/multer");
const calculateExpDate_1 = require("../../utils/calculateExpDate");
// import { IPayment,CreatePaymentInput } from "../../types/payment.types";
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    authenticateUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findByEmail(email);
                if (user && (yield user.matchPassword(password))) {
                    return user;
                }
                return null;
            }
            catch (error) {
                console.log(error);
                throw new Error('Failed to autheticate user');
            }
        });
    }
    // async registerUser(userData: IUser): Promise<IUser | null> {
    //     try {
    //         const otp = generateOTP();
    //         const otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000);
    //         const user = await this.userRepository.register({
    //             ...userData,
    //             otp,
    //             otpExpiresAt
    //         });
    //         await sendOTP(userData.email, otp);
    //         return user;
    //     } catch (error) {
    //         console.log(error);
    //         throw new Error('Failed to register user');
    //     }
    // }
    registerUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const planId = '675315d8356f388bd2d2844e';
            let dataToUpdate = null;
            try {
                const currentPlan = yield this.userRepository.findPlanById(planId);
                if (currentPlan) {
                    dataToUpdate = {
                        subscription: {
                            isPremium: false,
                            planId: currentPlan._id ? new mongoose_1.default.Types.ObjectId(planId) : null,
                            planExpiryDate: (0, calculateExpDate_1.calculateExpiryDate)(currentPlan.duration),
                            // planExpiryDate:  new Date(Date.now() + 2 * 60 * 1000),
                            planStartingDate: new Date(),
                        },
                    };
                }
                const otp = (0, userOtp_1.generateOTP)();
                const otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000);
                const user = yield this.userRepository.register(Object.assign(Object.assign({}, userData), { otp,
                    otpExpiresAt }));
                if (!user) {
                    throw new Error('User registration failed');
                }
                yield (0, userOtp_1.sendOTP)(userData.email, otp);
                if (dataToUpdate) {
                    yield this.userRepository.update(user._id.toString(), dataToUpdate);
                }
                return user;
            }
            catch (error) {
                console.error(error);
                throw new Error('Failed to register user');
            }
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findById(userId);
                if (!user) {
                    throw new Error('User not found');
                }
                return user;
            }
            catch (error) {
                console.log(error);
                throw new Error('Failed to Fetch user');
            }
        });
    }
    resendOTP(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findByEmail(email);
                if (!user) {
                    return { success: false, message: 'User not found' };
                }
                const otp = (0, userOtp_1.generateOTP)();
                const otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000);
                yield this.userRepository.update(user._id.toString(), { otp, otpExpiresAt });
                yield (0, userOtp_1.sendOTP)(email, otp);
                return { success: true, message: 'OTP sent successfully' };
            }
            catch (error) {
                console.log(error);
                return { success: false, message: 'Failed to resend OTP' };
            }
        });
    }
    verifyOTP(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findByEmail(email);
                if (!user) {
                    throw new Error('User not found');
                }
                if (user.otp !== otp) {
                    throw new Error('Invalid OTP');
                }
                if (new Date() > user.otpExpiresAt) {
                    throw new Error('OTP has expired');
                }
                return true;
            }
            catch (error) {
                console.log(error);
                throw new Error('Failed to verify OTP');
            }
        });
    }
    requestPasswordReset(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findByEmail(email);
                if (!user)
                    throw new Error('User Not Found');
                const resetToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                const expDate = new Date(Date.now() + 3600000);
                yield this.userRepository.update(user._id.toString(), { resetPassword: { token: resetToken, expDate, lastResetDate: new Date() } });
                const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
                yield (0, resetGmail_1.sendResetEmail)(user.email, resetLink);
            }
            catch (error) {
                console.log(error);
                throw new Error('Failed to request password reset');
            }
        });
    }
    resetPassword(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                const user = yield this.userRepository.findById(decoded.userId);
                if (!user || user.resetPassword.token !== token)
                    throw new Error('Invalid or expired token');
                if (user.resetPassword.expDate && user.resetPassword.expDate < new Date()) {
                    throw new Error('Reset token expired');
                }
                const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
                yield this.userRepository.update(user._id.toString(), {
                    password: hashedPassword,
                    resetPassword: Object.assign(Object.assign({}, user.resetPassword), { lastResetDate: new Date(), token: null, expDate: null }),
                });
            }
            catch (error) {
                console.log(error);
                throw new Error('Failed to reset password');
            }
        });
    }
    createUserInfo(userInfoData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.createUserInfo(userInfoData);
            }
            catch (error) {
                console.log(error);
                throw new Error('Failed to create user info');
            }
        });
    }
    getMatchedUsers(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedInUserInfo = yield this.userRepository.findUserInfo(userId);
                if (!loggedInUserInfo) {
                    return [];
                }
                const { lookingFor, location } = loggedInUserInfo;
                const matchedUserInfos = yield this.userRepository.findMatchedUsers({
                    userId: new mongoose_1.default.Types.ObjectId(userId),
                    gender: lookingFor,
                    location,
                });
                if (!matchedUserInfos) {
                    return [];
                }
                const matchedUsersWithDetails = yield Promise.all(matchedUserInfos.map((userInfo) => __awaiter(this, void 0, void 0, function* () {
                    const user = yield this.userRepository.findById(userInfo.userId.toString());
                    return {
                        userId: userInfo.userId.toString(),
                        name: (user === null || user === void 0 ? void 0 : user.name) || 'Unknown',
                        age: (0, calculateAge_1.calculateAge)((user === null || user === void 0 ? void 0 : user.dateOfBirth) ? new Date(user.dateOfBirth) : undefined),
                        gender: userInfo.gender,
                        lookingFor: userInfo.lookingFor,
                        profilePhotos: userInfo.profilePhotos,
                        relationship: userInfo.relationship,
                        interests: userInfo.interests,
                        occupation: userInfo.occupation,
                        education: userInfo.education,
                        bio: userInfo.bio,
                        smoking: userInfo.smoking,
                        drinking: userInfo.drinking,
                        place: userInfo.place,
                    };
                })));
                return matchedUsersWithDetails;
            }
            catch (error) {
                console.log(error);
                throw new Error('Failed to get matched users');
            }
        });
    }
    getUserProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findById(userId);
                const userInfo = yield this.userRepository.findUserInfo(userId);
                return { user, userInfo };
            }
            catch (error) {
                console.log(error);
                throw new Error('Failed to get user profile');
            }
        });
    }
    getUserDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findById(userId);
                if (!user) {
                    return [];
                }
                const userInfo = yield this.userRepository.findUserInfo(userId);
                if (!userInfo) {
                    return [];
                }
                const matchedUsersWithDetails = [
                    {
                        userId: userId,
                        name: user.name || 'Unknown',
                        age: (0, calculateAge_1.calculateAge)(user.dateOfBirth ? new Date(user.dateOfBirth) : undefined),
                        gender: userInfo.gender || 'Not specified',
                        lookingFor: userInfo.lookingFor,
                        profilePhotos: userInfo.profilePhotos || [],
                        relationship: userInfo.relationship || 'Not specified',
                        interests: userInfo.interests || [],
                        occupation: userInfo.occupation || 'Not specified',
                        education: userInfo.education || 'Not specified',
                        bio: userInfo.bio || 'Not specified',
                        smoking: userInfo.smoking || 'Not specified',
                        drinking: userInfo.drinking || 'Not specified',
                        place: userInfo.place || 'Not specified',
                    },
                ];
                return matchedUsersWithDetails;
            }
            catch (error) {
                console.error(error);
                throw new Error('Failed to get user details');
            }
        });
    }
    fetchUserPlans(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findById(userId);
                if (!user) {
                    throw new Error("User not found");
                }
                if (!user.subscription.isPremium || !user.subscription.planId) {
                    return yield this.userRepository.getUserPlans();
                }
                const currentPlan = yield this.userRepository.findPlanById(user.subscription.planId.toString());
                if (!currentPlan) {
                    throw new Error("Current plan not found");
                }
                return yield this.userRepository.getPlansAbovePrice(currentPlan.offerPrice);
            }
            catch (error) {
                console.log(error);
                throw new Error('Failed to fetch user plans');
            }
        });
    }
    getUserSubscriptionDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findUserPlanDetailsById(userId);
            if (!user || !user.subscription) {
                return null;
            }
            const { subscription } = user;
            const plan = subscription.planId;
            return { subscription, plan };
        });
    }
    cancelSubscriptionPlan(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.cancelSubscriptionPlan(userId);
            if (!user) {
                throw new Error("User not found or subscription cancellation failed.");
            }
            return user;
        });
    }
    updateUserPersonalInfo(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedPersonalInfo = yield this.userRepository.update(userId, data);
                if (!updatedPersonalInfo) {
                    throw new Error('Failed to update user personal Data');
                }
                return updatedPersonalInfo;
            }
            catch (error) {
                console.log(error);
                throw new Error('Failed to update user personal Data');
            }
        });
    }
    updateUserSubscription(userId, subscriptionData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataToUpdate = {
                    subscription: {
                        isPremium: subscriptionData.isPremium,
                        planId: subscriptionData.planId ? new mongoose_1.default.Types.ObjectId(subscriptionData.planId) : null,
                        planExpiryDate: subscriptionData.planExpiryDate,
                        planStartingDate: subscriptionData.planStartingDate,
                    },
                };
                const user = yield this.userRepository.findById(userId);
                if (!user) {
                    throw new Error(`User not found for ID: ${userId}`);
                }
                const plan = yield this.userRepository.findPlanById(subscriptionData.planId.toString());
                if (!plan) {
                    throw new Error(`Plan not found for ID: ${subscriptionData.planId}`);
                }
                const count = yield this.userRepository.paymentsCount();
                const paymentCount = count === null ? 0 : count;
                const paymentId = (paymentCount + 1).toString().padStart(4, '0');
                const paymentData = {
                    paymentId,
                    userName: user.name,
                    planName: plan.planName,
                    amount: plan.offerPrice,
                    userId: new mongoose_1.default.Types.ObjectId(userId),
                    planId: new mongoose_1.default.Types.ObjectId(subscriptionData.planId),
                };
                if (!paymentData.userName || !paymentData.planName || !paymentData.amount) {
                    throw new Error('Invalid payment data');
                }
                yield this.userRepository.createPayment(paymentData);
                return yield this.userRepository.update(userId, dataToUpdate);
            }
            catch (error) {
                console.log(error);
                throw new Error('Failed to update user subscription');
            }
        });
    }
    updateUserDatingInfo(userId, data, uploadedPhotos) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentUserInfo = yield this.userRepository.findUserInfo(userId);
                if (!currentUserInfo) {
                    throw new Error('User info not found');
                }
                const imgIndex = data.imgIndex && data.imgIndex.trim() !== '' ? data.imgIndex.split(',').map(Number) : [];
                if (imgIndex.length > 0) {
                    imgIndex.forEach((index, i) => {
                        (0, multer_1.deleteImageFromS3)(currentUserInfo.profilePhotos[index]);
                        currentUserInfo.profilePhotos[index] = uploadedPhotos[i].location;
                    });
                }
                imgIndex.length = 0;
                const updatedData = {
                    gender: data.gender,
                    lookingFor: data.lookingFor,
                    relationship: data.relationship,
                    interests: data.interests.toString().split(', '),
                    occupation: data.occupation,
                    education: data.education,
                    bio: data.bio,
                    smoking: data.smoking,
                    drinking: data.drinking,
                    place: data.place,
                    location: data.location,
                    caste: data.caste,
                    profilePhotos: currentUserInfo.profilePhotos,
                };
                return yield this.userRepository.updateUserInfo(userId, updatedData);
            }
            catch (error) {
                console.log(error);
                throw new Error('Failed to update user dating info');
            }
        });
    }
    handleHomeLikes(likesIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const { likerId, likedUserId } = likesIds;
            const existingLike = yield this.userRepository.findExistingLike({ likerId, likedUserId });
            if (existingLike) {
                return { match: false, message: "You have already liked this profile." };
            }
            const reverseLike = yield this.userRepository.findReverseLike({ likerId, likedUserId });
            if (reverseLike) {
                yield this.userRepository.saveLike({ likerId, likedUserId });
                yield this.userRepository.updateLikeStatus({ likerId, likedUserId }, "matched");
                yield this.userRepository.updateLikeStatus({ likerId: likedUserId, likedUserId: likerId }, "matched");
                yield this.userRepository.saveMatch({ user1Id: likerId.toString(), user2Id: likedUserId.toString(), matchDate: new Date() });
                return { match: true, message: "You have a new match!" };
            }
            else {
                yield this.userRepository.saveLike({ likerId, likedUserId });
                return { match: false, message: "You liked the profile!" };
            }
        });
    }
    getReceivedLikesCount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = yield this.userRepository.userReceivedLikesCount(userId);
                return count;
            }
            catch (error) {
                console.error("Error in LikeService:", error);
                throw new Error("Unable to fetch received likes count");
            }
        });
    }
    //..................................................
    getSentLikesProfiles(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sentLikes = yield this.userRepository.findSentLikes(userId);
            const profiles = yield Promise.all(sentLikes.map((like) => __awaiter(this, void 0, void 0, function* () {
                const user = yield this.userRepository.findById(like.likedUserId.toString());
                const userInfo = yield this.userRepository.findUserInfo(like.likedUserId.toString());
                if (user && userInfo) {
                    return {
                        id: user._id,
                        name: user.name,
                        age: user.dateOfBirth,
                        place: userInfo.place,
                        image: userInfo.profilePhotos,
                    };
                }
                return null;
            })));
            return profiles.filter((profile) => profile !== null);
        });
    }
    getReceivedLikesProfiles(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const receivedLikes = yield this.userRepository.findReceivedLikes(userId);
            const profiles = yield Promise.all(receivedLikes.map((like) => __awaiter(this, void 0, void 0, function* () {
                const user = yield this.userRepository.findById(like.likerId.toString());
                const userInfo = yield this.userRepository.findUserInfo(like.likerId.toString());
                if (user && userInfo) {
                    return {
                        id: user._id,
                        name: user.name,
                        age: user.dateOfBirth,
                        place: userInfo.place,
                        image: userInfo.profilePhotos,
                    };
                }
                return null;
            })));
            return profiles.filter((profile) => profile !== null);
        });
    }
    getmatchProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profiles = yield this.userRepository.findMatchedProfileById(userId);
            const matchedProfiles = yield Promise.all(profiles.map((match) => __awaiter(this, void 0, void 0, function* () {
                const id = match.user1Id.toString() == userId ? match.user2Id : match.user1Id;
                const user = yield this.userRepository.findById(id.toString());
                const userInfo = yield this.userRepository.findUserInfo(id.toString());
                if (user && userInfo) {
                    return {
                        id: user._id,
                        name: user.name,
                        age: user.dateOfBirth,
                        place: userInfo.place,
                        image: userInfo.profilePhotos,
                    };
                }
                return null;
            })));
            return matchedProfiles.filter((profile) => profile !== null);
        });
    }
    getAdviceCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.getAdviceCategory();
        });
    }
    getArticleByCategoryId(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.getArticleByCategoryId(categoryId);
        });
    }
    getArticleById(articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.getArticleById(articleId);
        });
    }
    createNotification(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.createNotification(notification);
        });
    }
    getNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.getNotifications(userId);
        });
    }
    clearNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.clearNotifications(userId);
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IUserRepository')),
    __metadata("design:paramtypes", [Object])
], UserService);
