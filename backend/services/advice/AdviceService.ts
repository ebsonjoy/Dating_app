import { inject,injectable } from "inversify";
import { IAdviceService } from "../../interfaces/advice/IAdviceService";
import { IAdviceRepository } from "../../interfaces/advice/IAdviceRepository";
import { IAdviceCategory, IArticle } from "../../types/advice.types";
import { deleteImageFromS3 } from "../../config/multer";



@injectable()
export class AdviceService implements IAdviceService {
    constructor(
        @inject('IAdviceRepository') private AdviceRepository : IAdviceRepository

    ){}

    //Category

    async createCategory(categoryData: IAdviceCategory): Promise<IAdviceCategory | null> {
        try {
            const existingCategory = await this.AdviceRepository.findCategoryByName(categoryData.name!); 
    if (existingCategory) {
      throw new Error(`Catergory with name "${categoryData.name}" already exists.`);
    }
            return await this.AdviceRepository.createCategory(categoryData);
        } catch (error) {
            console.log('Error in addNewCatergory:', error);
            throw error;
        }
    }
  
     async getCategories(): Promise<IAdviceCategory[] | null> {
        try{
            const categories =  await this.AdviceRepository.getCategories()
            if(!categories){
                return []
            }
            return categories
        }catch (error) {
            console.log('Error in addNewArticle:', error);
            throw error;
        }
    }

    async blockAdviceCategory(id: string, status: boolean): Promise<IAdviceCategory> {
        try{
            const category = await this.AdviceRepository.blockAdviceCategory(id,status)
            if (!category) throw new Error('category not found');
            return category;
        }catch (error) {
            console.log(error);
            throw new Error('Failed to toggle category status');
        }
    }

    async  getSingleAdviceCategory(categoryId: string): Promise<IAdviceCategory> {
        try{
            const category = await this.AdviceRepository.getSingleAdviceCategory(categoryId)
            if (!category) throw new Error('category not found');
            return category;
        }catch (error) {
            console.log(error);
            throw new Error('Failed to toggle category status');
        }
    }

    async updateAdiveCategory(id: string, updateData: Partial<IAdviceCategory>,file?: Express.MulterS3.File): Promise<IAdviceCategory | null> {
        try {

            const currentCategory = await this.AdviceRepository.getSingleAdviceCategory(id);
            
            if (!currentCategory) {
                throw new Error('Category not found');
            }

            if (updateData.name && updateData.name !== currentCategory.name) {
                const existingPlan = await this.AdviceRepository.findCategoryByName(updateData.name);
                if (existingPlan) {
                    throw new Error(`Category with name "${updateData.name}" already exists.`);
                }
            }

            if (file) {
                await deleteImageFromS3(currentCategory.image);
                updateData.image = file.location;
            } else {
                updateData.image = currentCategory.image;
            }

            const category = await this.AdviceRepository.updateAdiveCategory(id, updateData);
            if (!category) throw new Error('Plan not found');
            return category;
        } catch (error) {
            console.log('Failed to edit category',error);
            throw error;
        }
    }

    // Article


    async createArticle(articleData: IArticle): Promise<IArticle | null> {
        try{
        const existingArticle = await this.AdviceRepository.findArticleByTitle(articleData.title)

       if(existingArticle){
        throw new Error(`Catergory with name "${articleData.title}" already exists.`);
       }
            return await this.AdviceRepository.createArticle(articleData)
        }catch (error) {
            console.log('Error in addNewArticle:', error);
            throw error;
        }
    }

    async  getArticles(): Promise<IArticle[] | null> {
        try{
            const article =  await this.AdviceRepository.getArticles()
            if(!article){
                return []
            }
            return article
        }catch (error) {
            console.log('Error in addNewArticle:', error);
            throw error;
        }
    }


    async findArticleByTitle(title: string): Promise<IArticle | null> {
        try {
          const article = await this.AdviceRepository.findArticleByTitle(title);
          if (!article) throw new Error('Article not found');
          return article;
        } catch (error) {
          console.log('Error in findArticleByTitle:', error);
          throw error;
        }
      }
    
      async getArticlesByCategory(categoryId: string): Promise<IArticle[] | null> {
        try {
          const articles = await this.AdviceRepository.getArticlesByCategory(categoryId);
          if (!articles || articles.length === 0) {
            return [];
          }
          return articles;
        } catch (error) {
          console.log('Error in getArticlesByCategory:', error);
          throw error;
        }
      }
    
      async updateArticle(
        articleId: string,
        updateData: Partial<IArticle>,
        file?: Express.MulterS3.File
      ): Promise<IArticle | null> {
        try {
          const currentArticle = await this.AdviceRepository.getSingleArtilce(articleId);
          if(!currentArticle){
            throw new Error('Category not found');
          }
          if (updateData.title && updateData.title !== currentArticle.title) {
            const existingArticleName = await this.AdviceRepository.findArticleByTitle(updateData.title)
            if(existingArticleName){
              throw new Error(`Article with title "${updateData.title}" already exists.`);
            }
           
          }
    
          if (file) {
            await deleteImageFromS3(currentArticle?.image || '');
            updateData.image = file.location;
          }else{
            updateData.image = currentArticle?.image
          }
    
          return await this.AdviceRepository.updateArticle(articleId, updateData);
        } catch (error) {
          console.log('Error in updateArticle:', error);
          throw error;
        }
      }
    
      async deleteArticle(articleId: string): Promise<IArticle | null> {
        try {
          const article = await this.AdviceRepository.deleteArticle(articleId);
          if (!article) throw new Error('Article not found');
          if (article.image) {
            await deleteImageFromS3(article.image);
          }
          return article;
        } catch (error) {
          console.log('Error in deleteArticle:', error);
          throw error;
        }
      }
    
      async blockArticle(articleId: string, status: boolean): Promise<IArticle | null> {
        try {
          const article = await this.AdviceRepository.blockArticle(articleId, status);
          if (!article) throw new Error('Article not found');
          return article;
        } catch (error) {
          console.log('Error in blockArticle:', error);
          throw error;
        }
      }

     async getSingleArticle(articleId: string): Promise<IArticle> {
        try{
            const article = await this.AdviceRepository.getSingleArtilce(articleId)
            if (!article) throw new Error('category not found');
            return article;
        }catch (error) {
            console.log(error);
            throw new Error('Failed to toggle category status');
        }
    }
}