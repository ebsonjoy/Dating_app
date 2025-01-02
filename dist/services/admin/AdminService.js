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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const inversify_1 = require("inversify");
let AdminService = class AdminService {
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    authenticateAdmin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield this.adminRepository.authenticate(email);
                if (admin && (yield admin.matchPassword(password))) {
                    return admin;
                }
                return null;
            }
            catch (error) {
                console.log(error);
                throw new Error("Failed to auth admin");
            }
        });
    }
    registerAdmin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.adminRepository.create(email, password);
            }
            catch (error) {
                console.log(error);
                throw new Error("Failed to register admin");
            }
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepository.findAllUsers();
            }
            catch (error) {
                console.log(error);
                throw new Error("Failed to retrieve users");
            }
        });
    }
    toggleUserStatus(userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepository.updateUserStatus(userId, status);
            }
            catch (error) {
                console.log(error);
                throw new Error("Failed to toggle user status");
            }
        });
    }
    getPayments() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepository.getAllPayments();
            }
            catch (error) {
                console.log(error);
                throw new Error("Failed to get payments status");
            }
        });
    }
    dashBoardMasterData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userCount, matchesCount, totalRevanue, premiumUsers] = yield Promise.all([
                    this.adminRepository.usersCount().catch(() => 0),
                    this.adminRepository.matchesCount().catch(() => 0),
                    this.adminRepository.totalRevanue().catch(() => 0),
                    this.adminRepository.premiumUsersCount().catch(() => 0),
                ]);
                const masterData = {
                    userCount: userCount !== null && userCount !== void 0 ? userCount : 0,
                    matchesCount: matchesCount !== null && matchesCount !== void 0 ? matchesCount : 0,
                    totalRevanue: totalRevanue !== null && totalRevanue !== void 0 ? totalRevanue : 0,
                    premiumUsers: premiumUsers !== null && premiumUsers !== void 0 ? premiumUsers : 0,
                };
                return masterData;
            }
            catch (error) {
                console.error("Error fetching dashboard master data:", error);
                throw error;
            }
        });
    }
    getUserChartData(timeRange) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalUsers = yield this.adminRepository.getUserCountByTimeRange(timeRange);
            const userGrowthData = yield this.adminRepository.getUserGrowthData(timeRange);
            return {
                totalUsers,
                userGrowthData,
            };
        });
    }
    getPaymentChartData(timeRange) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalPayments = yield this.adminRepository.getPaymentTotalByTimeRange(timeRange);
            const paymentGrowthData = yield this.adminRepository.getPaymentGrowthData(timeRange);
            return {
                totalPayments,
                paymentGrowthData
            };
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)("IAdminRepository")),
    __metadata("design:paramtypes", [Object])
], AdminService);
