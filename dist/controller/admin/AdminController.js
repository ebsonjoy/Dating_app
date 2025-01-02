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
exports.AdminController = void 0;
const inversify_1 = require("inversify");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const HttpStatusCode_1 = require("../../enums/HttpStatusCode");
const generateAdminToken_1 = __importDefault(require("../../utils/generateAdminToken"));
const StatusMessage_1 = require("../../enums/StatusMessage");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
        this.login = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const admin = yield this.adminService.authenticateAdmin(email, password);
                if (admin) {
                    (0, generateAdminToken_1.default)(res, admin._id.toString());
                    res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                        _id: admin._id,
                        email: admin.email,
                    });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({ message: StatusMessage_1.StatusMessage.UNAUTHORIZED });
                }
            }
            catch (error) {
                console.error(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.register = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                yield this.adminService.registerAdmin(email, password);
                res.status(HttpStatusCode_1.HttpStatusCode.CREATED).json({ message: StatusMessage_1.StatusMessage.CREATED_SUCCESS });
            }
            catch (error) {
                res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ message: error instanceof Error ? error.message : StatusMessage_1.StatusMessage.BAD_REQUEST });
            }
        }));
        this.logout = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.cookie("admin_jwt", "", {
                    httpOnly: true,
                    expires: new Date(0),
                });
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: StatusMessage_1.StatusMessage.SUCCESS });
            }
            catch (error) {
                console.error(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.getAllUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.adminService.getAllUsers();
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json(users);
            }
            catch (error) {
                console.error(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.updateUserStatus = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const { newStatus } = req.body;
            try {
                const updatedUser = yield this.adminService.toggleUserStatus(userId, newStatus);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: 'User status updated', user: updatedUser });
            }
            catch (error) {
                console.error(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.fetchPayments = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const payments = yield this.adminService.getPayments();
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json(payments);
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.getDashboardMasterData = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const masterData = yield this.adminService.dashBoardMasterData();
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json(masterData);
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.getUserChartData = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { timeRange } = req.query;
                if (!timeRange || !['day', 'month', 'year'].includes(timeRange)) {
                    res.status(400).json({ message: 'Invalid time range' });
                    return;
                }
                const data = yield this.adminService.getUserChartData(timeRange);
                res.status(200).json(data);
                console.log('user data', data);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching user chart data', error });
            }
        }));
        this.getPaymentChartData = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { timeRange } = req.query;
                if (!timeRange || !['day', 'month', 'year'].includes(timeRange)) {
                    res.status(400).json({ message: 'Invalid time range' });
                    return;
                }
                const data = yield this.adminService.getPaymentChartData(timeRange);
                console.log('payment data', data);
                res.status(200).json(data);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching payment chart data', error });
            }
        }));
    }
};
exports.AdminController = AdminController;
exports.AdminController = AdminController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IAdminService')),
    __metadata("design:paramtypes", [Object])
], AdminController);
