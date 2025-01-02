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
exports.AdminRepository = void 0;
const inversify_1 = require("inversify");
const User_1 = __importDefault(require("../../models/User"));
const AdminModel_1 = __importDefault(require("../../models/AdminModel"));
const PaymentModel_1 = __importDefault(require("../../models/PaymentModel"));
const MatchModel_1 = __importDefault(require("../../models/MatchModel"));
let AdminRepository = class AdminRepository {
    constructor(adminModel = AdminModel_1.default, userModel = User_1.default, paymentModel = PaymentModel_1.default, matchModel = MatchModel_1.default) {
        this.adminModel = adminModel;
        this.userModel = userModel;
        this.paymentModel = paymentModel;
        this.matchModel = matchModel;
    }
    authenticate(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminModel.findOne({ email });
            }
            catch (error) {
                console.error("Error during admin authentication:", error);
                throw new Error("Error authenticating admin");
            }
        });
    }
    create(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = new this.adminModel({ email, password });
            try {
                yield admin.save();
            }
            catch (error) {
                console.error("Error creating admin:", error);
                throw new Error("Error creating admin");
            }
        });
    }
    findAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userModel
                    .find()
                    .select("name email mobileNumber subscription matches status");
            }
            catch (error) {
                console.error("Error fetching users:", error);
                throw new Error("Error fetching users");
            }
        });
    }
    updateUserStatus(userId, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield this.userModel.findByIdAndUpdate(userId, { status: newStatus }, { new: true }).select('_id name status');
                if (!updatedUser) {
                    throw new Error("User not found");
                }
                return updatedUser;
            }
            catch (error) {
                console.error("Error updating user status:", error);
                throw new Error("Error updating user status");
            }
        });
    }
    getAllPayments() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.paymentModel.find();
        });
    }
    usersCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userModel.countDocuments({ status: true });
        });
    }
    matchesCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.matchModel.countDocuments();
        });
    }
    totalRevanue() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const total = yield this.paymentModel.aggregate([
                    {
                        $group: {
                            _id: null,
                            totalAmount: { $sum: "$amount" }
                        }
                    }
                ]);
                return total.length > 0 ? total[0].totalAmount : 0;
            }
            catch (error) {
                console.error("Error calculating total revenue:", error);
                throw error;
            }
        });
    }
    premiumUsersCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = yield this.userModel.countDocuments({ "subscription.isPremium": true });
                return count;
            }
            catch (error) {
                console.error("Error fetching premium users count:", error);
                throw error;
            }
        });
    }
    // Graph
    getUserCountByTimeRange(timeRange) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            let startDate;
            switch (timeRange) {
                case 'day':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    break;
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    break;
                case 'year':
                    startDate = new Date(now.getFullYear(), 0, 1);
                    break;
            }
            return yield this.userModel.countDocuments({
                createdAt: { $gte: startDate }
            });
        });
    }
    getUserGrowthData(timeRange) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            let groupFormat;
            let startDate;
            switch (timeRange) {
                case 'day':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
                    groupFormat = '%Y-%m-%d';
                    break;
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
                    groupFormat = '%Y-%m';
                    break;
                case 'year':
                    startDate = new Date(now.getFullYear() - 5, 0, 1);
                    groupFormat = '%Y';
                    break;
            }
            const result = yield this.userModel.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]);
            return result.map(item => ({
                date: new Date(item._id),
                count: item.count
            }));
        });
    }
    getPaymentTotalByTimeRange(timeRange) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const now = new Date();
            let startDate;
            switch (timeRange) {
                case 'day':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    break;
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    break;
                case 'year':
                    startDate = new Date(now.getFullYear(), 0, 1);
                    break;
            }
            const result = yield this.paymentModel.aggregate([
                {
                    $match: {
                        date: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$amount' }
                    }
                }
            ]);
            return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
        });
    }
    getPaymentGrowthData(timeRange) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            let groupFormat;
            let startDate;
            switch (timeRange) {
                case 'day':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
                    groupFormat = '%Y-%m-%d';
                    break;
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
                    groupFormat = '%Y-%m';
                    break;
                case 'year':
                    startDate = new Date(now.getFullYear() - 5, 0, 1);
                    groupFormat = '%Y';
                    break;
            }
            const result = yield this.paymentModel.aggregate([
                {
                    $match: {
                        date: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: groupFormat, date: '$date' } },
                        amount: { $sum: '$amount' }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]);
            return result.map(item => ({
                date: new Date(item._id),
                amount: item.amount
            }));
        });
    }
};
exports.AdminRepository = AdminRepository;
exports.AdminRepository = AdminRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], AdminRepository);
