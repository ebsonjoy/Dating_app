import mongoose, { Document } from "mongoose";


export interface IAdviceCategory extends Document {
  name: string;
  description: string;
  image: string; 
  isBlock: boolean;
}

  export interface IArticle extends Document {
    title: string;
    image: string;
    content: string; 
    categoryId: mongoose.Types.ObjectId; 
    isBlock: boolean;
  }

  export interface ICreateAdviceCategory{
    name: string;
    description: string;
    image: string; 
  }


  export interface ICreateArticle {
    title: string;
    image: string;
    content: string; 
    categoryId: mongoose.Types.ObjectId; 
  }