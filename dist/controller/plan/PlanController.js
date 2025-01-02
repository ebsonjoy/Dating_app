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
exports.PlanController = void 0;
const inversify_1 = require("inversify");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const HttpStatusCode_1 = require("../../enums/HttpStatusCode");
const StatusMessage_1 = require("../../enums/StatusMessage");
let PlanController = class PlanController {
    constructor(planService) {
        this.planService = planService;
        this.getPlans = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const plans = yield this.planService.fetchPlans();
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json(plans);
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.createPlan = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const planData = req.body;
            console.log(planData);
            try {
                const newPlan = yield this.planService.addNewPlan(planData);
                res.status(HttpStatusCode_1.HttpStatusCode.CREATED).json(newPlan);
            }
            catch (error) {
                if (error.message.includes("already exists")) {
                    res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({
                        errors: [error.message],
                    });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                        errors: [StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR],
                    });
                }
            }
        }));
        this.getOnePlan = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { planId } = req.params;
            try {
                const plan = yield this.planService.fetchPlanById(planId);
                if (!plan) {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ message: StatusMessage_1.StatusMessage.NOT_FOUND });
                    return;
                }
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json(plan);
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
        this.updatePlan = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { planId } = req.params;
            const planData = req.body;
            console.log(planData);
            try {
                const updatedPlan = yield this.planService.editPlan(planId, planData);
                if (!updatedPlan) {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ message: StatusMessage_1.StatusMessage.NOT_FOUND });
                    return;
                }
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json(updatedPlan);
            }
            catch (error) {
                console.log(error);
                if (error.message.includes("already exists")) {
                    res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({
                        errors: [error.message],
                    });
                }
                else {
                    res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
                }
            }
        }));
        this.updatePlanStatus = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { planId } = req.params;
            const { newStatus } = req.body;
            try {
                const updatedPlan = yield this.planService.togglePlanStatus(planId, newStatus);
                if (!updatedPlan) {
                    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ message: StatusMessage_1.StatusMessage.NOT_FOUND });
                    return;
                }
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ message: 'Plan status updated successfully', plan: updatedPlan });
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage_1.StatusMessage.INTERNAL_SERVER_ERROR });
            }
        }));
    }
};
exports.PlanController = PlanController;
exports.PlanController = PlanController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)("IPlanService")),
    __metadata("design:paramtypes", [Object])
], PlanController);
