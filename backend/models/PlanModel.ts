import mongoose, { Document } from "mongoose";

export interface IPlan extends Document {
  planName: string;
  duration: string;
  offerPercentage: number;
  actualPrice: number;
  offerPrice: number;
  offerName: string;
  status:boolean;
}

const PlanSchema = new mongoose.Schema<IPlan>(
  {
    planName: { type: String, required: true },
    duration: { type: String, required: true },
    offerPercentage: { type: Number, required: true },
    actualPrice: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    offerName: { type: String, required: true },
    status:{
      type:Boolean,
      default:true,
  },
  },
  { timestamps: true }
);

const Plan = mongoose.model<IPlan>("Plan", PlanSchema);
export default Plan;
