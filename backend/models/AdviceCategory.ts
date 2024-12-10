import mongoose, { Schema } from "mongoose";
import { IAdviceCategory } from "../types/advice.types";

const AdviceCategorySchema = new Schema<IAdviceCategory>({
  name: { type: String, required: true },
  image: { type: String, required: true },
});

const AdviceCategory = mongoose.model<IAdviceCategory>("AdviceCategory", AdviceCategorySchema);
export default AdviceCategory