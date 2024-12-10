// import mongoose, { Schema } from "mongoose";
// import { IAdviceSubcategory } from "../types/advice.types";

// const SubcategorySchema = new Schema<IAdviceSubcategory>({
//   name: { type: String, required: true },
//   previewPoints: { type: [String], required: true },
//   categoryId: { type: Schema.Types.ObjectId, ref: "AdviceCategory", required: true },
// });

// const AdviceSubcategory = mongoose.model<IAdviceSubcategory>(
//   "AdviceSubcategory",
//   SubcategorySchema
// );

// export default AdviceSubcategory