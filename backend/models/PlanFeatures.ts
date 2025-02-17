import mongoose, { Schema } from "mongoose";
import { IPlanFeatures } from "../types/plan.types";

const PlanFeatureSchema = new Schema<IPlanFeatures>({
    code: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
});

const PlanFeatures = mongoose.model<IPlanFeatures>("PlanFeatures", PlanFeatureSchema);

export default PlanFeatures;
