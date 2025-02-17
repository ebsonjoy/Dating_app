import mongoose,{ Schema } from "mongoose";
import { IPlanDocument } from '../types/plan.types'

const PlanSchema = new mongoose.Schema<IPlanDocument>(
  {
    planName: { type: String, required: true },
    duration: { type: String, required: true },
    offerPercentage: { type: Number, required: true },
    actualPrice: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    offerName: { type: String, required: true },
    status: { type: Boolean, default: true },
    features: [{ type:Schema.Types.ObjectId, ref:'PlanFeatures', required: true }],
  },
  { timestamps: true }
);

const Plan = mongoose.model<IPlanDocument>("Plan", PlanSchema);
export default Plan;
