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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanRepository = void 0;
const inversify_1 = require("inversify");
const mongoose_1 = require("mongoose");
let PlanRepository = class PlanRepository {
    constructor(model) {
        this.model = model;
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.find().exec();
            }
            catch (error) {
                console.error("Error fetching all plans:", error);
                throw new Error("Failed to retrieve plans");
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const plan = yield this.model.findById(id).exec();
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
    findByPlanName(planName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findOne({ planName });
            }
            catch (error) {
                console.error("Error fetching plan by name:", error);
                throw new Error("Failed to retrieve plan by name");
            }
        });
    }
    create(plan) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.create(plan);
            }
            catch (error) {
                console.error("Error creating plan:", error);
                throw new Error("Failed to create plan");
            }
        });
    }
    update(id, plan) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedPlan = yield this.model.findByIdAndUpdate(id, plan, {
                    new: true,
                });
                if (!updatedPlan)
                    throw new Error("Plan not found");
                return updatedPlan;
            }
            catch (error) {
                console.error("Error updating plan:", error);
                throw new Error("Failed to update plan");
            }
        });
    }
    updateStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedPlan = yield this.model.findByIdAndUpdate(id, { status }, { new: true }).select('_id planName status');
                if (!updatedPlan) {
                    throw new Error("Plan not found");
                }
                return updatedPlan;
            }
            catch (error) {
                console.error("Error updating plan status:", error);
                throw new Error("Failed to update plan status");
            }
        });
    }
};
exports.PlanRepository = PlanRepository;
exports.PlanRepository = PlanRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [mongoose_1.Model])
], PlanRepository);
