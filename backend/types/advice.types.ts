import mongoose, { Document } from "mongoose";


export interface IAdviceCategory extends Document {
  name: string;
  image: string; // URL for category image
}


export interface IAdviceSubcategory extends Document {
    name: string;
    image: string;
    previewPoints: string[]; // Three points for preview
    categoryId: mongoose.Types.ObjectId; // Reference to parent category
  }

  export interface IArticle extends Document {
    title: string;
    image: string[];
    content: string; // Detailed explanation
    subcategoryId: mongoose.Types.ObjectId; // Reference to parent subcategory
  }