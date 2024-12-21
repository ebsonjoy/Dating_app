import { IAdviceCategory,ICreateAdviceCategory } from "../../types/advice.types";
import { IArticle,ICreateArticle } from "../../types/advice.types";

export interface IAdviceService{
    //category
    createCategory(categoryData:ICreateAdviceCategory):Promise<IAdviceCategory | null>
    getCategories(): Promise<IAdviceCategory[] | null>
    blockAdviceCategory(id:string,status:boolean):Promise<IAdviceCategory>
    getSingleAdviceCategory(categoryId:string):Promise<IAdviceCategory>
    updateAdiveCategory(id:string,category: Partial<IAdviceCategory>,file?: Express.Multer.File) :Promise<IAdviceCategory | null>
    //Article
    createArticle(articleData:ICreateArticle): Promise<IArticle | null>
    getArticles() : Promise<IArticle[] | null>
    findArticleByTitle(title: string): Promise<IArticle | null>;
    getArticlesByCategory(categoryId: string): Promise<IArticle[] | null>;
    updateArticle(
    articleId: string,
    updateData: Partial<IArticle>,
    file?: Express.Multer.File
    ): Promise<IArticle | null>;
    deleteArticle(articleId: string): Promise<IArticle | null>;
    blockArticle(articleId: string, status: boolean): Promise<IArticle | null>;
    getSingleArticle(articleId:string):Promise<IArticle>

}