import { injectable } from "inversify";
// import mongoose from "mongoose";
import { IAdviceRepository } from "../../interfaces/advice/IAdviceRepository";
import AdviceCategory from "../../models/AdviceCategory";
import Article from "../../models/Article";
import { IAdviceCategory, IArticle } from "../../types/advice.types";

@injectable()
export class AdviceRepository  implements IAdviceRepository {
   constructor(
    private readonly  AdviceCategoryModel = AdviceCategory,
    private readonly ArticleModel = Article,
   ){}
//category
   async createCategory(categoryData: IAdviceCategory): Promise<IAdviceCategory | null> {
       return await this.AdviceCategoryModel.create(categoryData)
   }
   async  getCategories(): Promise<IAdviceCategory[]> {
    return await this.AdviceCategoryModel.find()
   }
   async findCategoryByName(categoryName: string): Promise<IAdviceCategory | null> {
    return await this.AdviceCategoryModel.findOne({categoryName})
   }  

   async blockAdviceCategory(id: string, isBlock: boolean): Promise<IAdviceCategory | null> {
    return await this.AdviceCategoryModel.findByIdAndUpdate(id,{isBlock}, { new: true })
   }
   async  getSingleAdviceCategory(categoryId: string): Promise<IAdviceCategory | null> {
    return await this.AdviceCategoryModel.findById(categoryId).exec()
  }
   async updateAdiveCategory(id: string, category: Partial<IAdviceCategory>): Promise<IAdviceCategory | null> {
    return await this.AdviceCategoryModel.findByIdAndUpdate(id,category,{new:true})
  }
// article
   async createArticle(articleData: IArticle): Promise<IArticle | null> {
       return await this.ArticleModel.create(articleData)
   }
   async getArticles(): Promise<IArticle[]> {
       return await this.ArticleModel.find().exec()
   }
   async findArticleByTitle(title: string): Promise<IArticle | null> {
    return await this.ArticleModel.findOne({ title }).exec();
  }
  async getArticlesByCategory(categoryId: string): Promise<IArticle[]> {
    return await this.ArticleModel.find({ categoryId }).exec();
  }
  async updateArticle(
    articleId: string,
    articleData: Partial<IArticle>
  ): Promise<IArticle | null> {
    return await this.ArticleModel.findByIdAndUpdate(articleId, articleData, { new: true });
  }
  async deleteArticle(articleId: string): Promise<IArticle | null> {
    return await this.ArticleModel.findByIdAndDelete(articleId).exec();
  }
  async blockArticle(articleId: string, isBlock: boolean): Promise<IArticle | null> {
    return await this.ArticleModel.findByIdAndUpdate(articleId, { isBlock }, { new: true });
  }
   async getSingleArtilce(articleId: string): Promise<IArticle | null> {
    return await this.ArticleModel.findById(articleId).exec()
  }
 
}