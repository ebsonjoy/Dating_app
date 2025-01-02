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
exports.UserRepository = void 0;
const inversify_1 = require("inversify");
const User_1 = __importDefault(require("../../models/User"));
const UserInfo_1 = __importDefault(require("../../models/UserInfo"));
const LikesModel_1 = __importDefault(require("../../models/LikesModel"));
const MatchModel_1 = __importDefault(require("../../models/MatchModel"));
const PlanModel_1 = __importDefault(require("../../models/PlanModel"));
const PaymentModel_1 = __importDefault(require("../../models/PaymentModel"));
const Notifications_1 = __importDefault(require("../../models/Notifications"));
const Article_1 = __importDefault(require("../../models/Article"));
const AdviceCategory_1 = __importDefault(require("../../models/AdviceCategory"));
let UserRepository = class UserRepository {
    constructor(UserModel = User_1.default, UserInfoModel = UserInfo_1.default, LikesModel = LikesModel_1.default, MatchModel = MatchModel_1.default, PlanModel = PlanModel_1.default, PaymentModel = PaymentModel_1.default, AdviceCategoryModel = AdviceCategory_1.default, ArticleModel = Article_1.default, NotificationModel = Notifications_1.default) {
        this.UserModel = UserModel;
        this.UserInfoModel = UserInfoModel;
        this.LikesModel = LikesModel;
        this.MatchModel = MatchModel;
        this.PlanModel = PlanModel;
        this.PaymentModel = PaymentModel;
        this.AdviceCategoryModel = AdviceCategoryModel;
        this.ArticleModel = ArticleModel;
        this.NotificationModel = NotificationModel;
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.UserModel.findOne({ email });
            }
            catch (error) {
                console.error('Error finding user by email:', error);
                throw new Error('Failed to find user by email');
            }
        });
    }
    register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = new this.UserModel(userData);
                return yield user.save();
            }
            catch (error) {
                console.error('Error registering user:', error);
                throw new Error('Failed to register user');
            }
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.UserModel.findById(userId);
            }
            catch (error) {
                console.error('Error finding user by ID:', error);
                throw new Error('Failed to find user');
            }
        });
    }
    update(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.UserModel.findByIdAndUpdate(userId, { $set: data }, { new: true });
            }
            catch (error) {
                console.error('Error updating user:', error);
                throw new Error('Failed to update user');
            }
        });
    }
    findUserInfo(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.UserInfoModel.findOne({ userId });
            }
            catch (error) {
                console.error('Error finding user info:', error);
                throw new Error('Failed to find user info');
            }
        });
    }
    createUserInfo(userInfoData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.UserInfoModel.create(userInfoData);
            }
            catch (error) {
                console.error('Error creating user info:', error);
                throw new Error('Failed to create user info');
            }
        });
    }
    updateUserInfo(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.UserInfoModel.findOneAndUpdate({ userId }, { $set: data }, { new: true });
            }
            catch (error) {
                console.error('Error updating user info:', error);
                throw new Error('Failed to update user info');
            }
        });
    }
    findMatchedUsers(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const earthRadius = 6371;
            const [longitude, latitude] = filters.location.coordinates;
            try {
                // Fetch liked user IDs
                const likedUsers = yield this.LikesModel.find({
                    likerId: filters.userId
                }).select('likedUserId');
                const likedUserIds = likedUsers.map(like => like.likedUserId);
                return yield this.UserInfoModel.find({
                    userId: { $ne: filters.userId, $nin: likedUserIds },
                    gender: filters.gender,
                    location: {
                        $geoWithin: {
                            $centerSphere: [[longitude, latitude], 80 / earthRadius],
                        },
                    },
                });
            }
            catch (error) {
                console.error('Error finding matched users:', error);
                throw new Error('Failed to find matched users');
            }
        });
    }
    getUserPlans() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activePlans = yield this.PlanModel.find({ status: true });
                return activePlans;
            }
            catch (error) {
                console.error("Error fetching active user plans:", error);
                throw new Error("Failed to retrieve active user plans");
            }
        });
    }
    findUserPlanDetailsById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.UserModel.findById(userId)
                .select('subscription')
                .populate({
                path: 'subscription.planId',
                model: 'Plan',
            });
            if (!user)
                return null;
            const subscription = user.subscription;
            const plan = user.subscription.planId;
            return { subscription, plan };
        });
    }
    userReceivedLikesCount(user1Id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = yield this.LikesModel.countDocuments({ likedUserId: user1Id, status: "pending" });
                if (!count) {
                    return 0;
                }
                return count;
            }
            catch (error) {
                console.error("Error fetching user received likes:", error);
                throw new Error("Failed to retrieve likes count");
            }
        });
    }
    findPlanById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const plan = yield this.PlanModel.findById(id).exec();
                if (!plan)
                    throw new Error("Plan not found");
                return plan;
            }
            catch (error) {
                console.error("Error fetching plan by ID:", error);
                throw new Error("Failed to retrieve plan");
            }
        });
    }
    getPlansAbovePrice(minPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.PlanModel.find({ status: true, offerPrice: { $gt: minPrice } });
            }
            catch (error) {
                console.error("Error fetching plans above price:", error);
                throw new Error("Failed to retrieve plans");
            }
        });
    }
    cancelSubscriptionPlan(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.UserModel.findByIdAndUpdate(userId, {
                $set: {
                    "subscription.isPremium": false,
                    "subscription.planId": null,
                    "subscription.planExpiryDate": null,
                    "subscription.planStartingDate": null,
                },
            }, { new: true });
        });
    }
    findExistingLike(likeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { likerId, likedUserId } = likeData;
            return yield this.LikesModel.findOne({ likerId, likedUserId });
        });
    }
    findReverseLike(likeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { likerId, likedUserId } = likeData;
            return yield this.LikesModel.findOne({ likerId: likedUserId, likedUserId: likerId });
        });
    }
    saveLike(likeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { likerId, likedUserId } = likeData;
            yield this.LikesModel.create({ likerId, likedUserId, status: "pending" });
        });
    }
    updateLikeStatus(likeData, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const { likerId, likedUserId } = likeData;
            yield this.LikesModel.updateOne({ likerId, likedUserId }, { status });
        });
    }
    findSentLikes(likerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.LikesModel.find({ likerId, status: { $ne: "matched" } });
        });
    }
    findReceivedLikes(likedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.LikesModel.find({ likedUserId, status: { $ne: "matched" } });
        });
    }
    saveMatch(matchData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.MatchModel.create(matchData);
        });
    }
    findMatchedProfileById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.MatchModel.find({
                $or: [
                    { user1Id: userId },
                    { user2Id: userId }
                ]
            });
        });
    }
    createPayment(paymentData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.PaymentModel.create(paymentData);
        });
    }
    paymentsCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.PaymentModel.countDocuments();
        });
    }
    getAdviceCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.AdviceCategoryModel.find({ isBlock: false });
        });
    }
    getArticleByCategoryId(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ArticleModel.find({ categoryId, isBlock: false }).exec();
        });
    }
    getArticleById(articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ArticleModel.findById({ articleId, isBlock: false }).exec();
        });
    }
    createNotification(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.NotificationModel.create(notification);
        });
    }
    getNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.NotificationModel.find({ userId });
        });
    }
    clearNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.NotificationModel.deleteMany({ userId });
            return result.deletedCount > 0
                ? "Notifications successfully deleted."
                : "No notifications found to delete.";
        });
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object])
], UserRepository);
