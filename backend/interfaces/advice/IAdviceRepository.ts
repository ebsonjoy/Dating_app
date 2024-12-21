import { IAdviceCategory } from "../../types/advice.types";
import { IArticle } from "../../types/advice.types";

export interface IAdviceRepository{
    //category
    createCategory(categoryData:IAdviceCategory):Promise<IAdviceCategory | null>
    getCategories(): Promise<IAdviceCategory[]>
    findCategoryByName(categoryName:string):Promise<IAdviceCategory | null>
    blockAdviceCategory(id: string, status: boolean): Promise<IAdviceCategory | null>;
    getSingleAdviceCategory(categoryId:string):Promise<IAdviceCategory | null>
    updateAdiveCategory(id:string,category: Partial<IAdviceCategory>) :Promise<IAdviceCategory | null>
    //article
    createArticle(articleData:IArticle): Promise<IArticle | null>
    getArticles() : Promise<IArticle[]>
    findArticleByTitle(title: string): Promise<IArticle | null>;
    getArticlesByCategory(categoryId: string): Promise<IArticle[]>;
    updateArticle(
    articleId: string,
    articleData: Partial<IArticle>
    ): Promise<IArticle | null>;
    deleteArticle(articleId: string): Promise<IArticle | null>;
    blockArticle(articleId: string, status: boolean): Promise<IArticle | null>;
    getSingleArtilce(articleId:string):Promise<IArticle | null>



}