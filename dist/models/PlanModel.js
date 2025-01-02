"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PlanSchema = new mongoose_1.default.Schema({
    planName: { type: String, required: true },
    duration: { type: String, required: true },
    offerPercentage: { type: Number, required: true },
    actualPrice: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    offerName: { type: String, required: true },
    status: { type: Boolean, default: true },
    features: { type: [String], required: true },
}, { timestamps: true });
const Plan = mongoose_1.default.model("Plan", PlanSchema);
exports.default = Plan;
