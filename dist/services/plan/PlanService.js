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
exports.PlanService = void 0;
const inversify_1 = require("inversify");
let PlanService = class PlanService {
    constructor(planRepository) {
        this.planRepository = planRepository;
    }
    fetchPlans() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.planRepository.getAll();
            }
            catch (error) {
                console.log(error);
                throw new Error('Failed to fetch plans');
            }
        });
    }
    fetchPlanById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const plan = yield this.planRepository.getById(id);
                if (!plan)
                    throw new Error('Plan not found');
                return plan;
            }
            catch (error) {
                console.log(error);
                throw new Error('Failed to fetch plan by ID');
            }
        });
    }
    addNewPlan(planData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingPlan = yield this.planRepository.findByPlanName(planData.planName);
                if (existingPlan) {
                    throw new Error(`Plan with name "${planData.planName}" already exists.`);
                }
                return yield this.planRepository.create(planData);
            }
            catch (error) {
                console.log('Error in addNewPlan:', error);
                throw error;
            }
        });
    }
    editPlan(id, planData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentPlan = yield this.planRepository.getById(id);
                if (!currentPlan) {
                    throw new Error('Plan not found');
                }
                if (planData.planName && planData.planName !== currentPlan.planName) {
                    const existingPlan = yield this.planRepository.findByPlanName(planData.planName);
                    if (existingPlan) {
                        throw new Error(`Plan with name "${planData.planName}" already exists.`);
                    }
                }
                const plan = yield this.planRepository.update(id, planData);
                if (!plan)
                    throw new Error('Plan not found');
                return plan;
            }
            catch (error) {
                console.log('Failed to edit plan', error);
                throw error;
            }
        });
    }
    togglePlanStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const plan = yield this.planRepository.updateStatus(id, status);
                if (!plan)
                    throw new Error('Plan not found');
                return plan;
            }
            catch (error) {
                console.log(error);
                throw new Error('Failed to toggle plan status');
            }
        });
    }
};
exports.PlanService = PlanService;
exports.PlanService = PlanService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IPlanRepository')),
    __metadata("design:paramtypes", [Object])
], PlanService);
