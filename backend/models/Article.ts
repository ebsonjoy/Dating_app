import mongoose, { Schema } from "mongoose";
import { IArticle } from "../types/advice.types"; 

const ArticleSchema = new Schema<IArticle>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: "AdviceCategory", required: true },
  isBlock: {
    type: Boolean,
    default: false,
},
});

const Article = mongoose.model<IArticle>("Article", ArticleSchema);

export default Article