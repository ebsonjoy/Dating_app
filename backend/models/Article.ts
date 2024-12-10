import mongoose, { Schema } from "mongoose";
import { IArticle } from "../types/advice.types"; 

const ArticleSchema = new Schema<IArticle>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  subcategoryId: { type: Schema.Types.ObjectId, ref: "AdviceSubcategory", required: true },
});

const Article = mongoose.model<IArticle>("Article", ArticleSchema);

export default Article