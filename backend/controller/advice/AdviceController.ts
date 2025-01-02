/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import asyncHandler from 'express-async-handler';
import { StatusMessage } from '../../enums/StatusMessage';
import { HttpStatusCode } from "../../enums/HttpStatusCode";
import { IAdviceCategory,ICreateAdviceCategory } from '../../types/advice.types';
import { IArticle,ICreateArticle } from '../../types/advice.types';
import { IAdviceService } from '../../interfaces/advice/IAdviceService';



@injectable()
export class AdviceController {
  constructor(
    @inject("IAdviceService") private readonly adviceService: IAdviceService
  ) {}

  //category

  createAdviceCategory = asyncHandler(async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const file = req.file as Express.MulterS3.File;

  if (!file) {
     res.status(400).json({ error: "Image is required" });
     return
  }

  const imageUrl = file.location

  try {
    const categoryData:ICreateAdviceCategory = {
      name,
      description,
      image: imageUrl,
    };

    console.log(categoryData)

      const newCategory = await this.adviceService.createCategory(categoryData);
      res.status(HttpStatusCode.CREATED).json(newCategory);
    } catch (error:any) {
      if (error.message.includes("already exists")) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          errors: [error.message],
        });
      } else {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
          errors: [StatusMessage.INTERNAL_SERVER_ERROR],
        });
      }
    }
  });
  getAdviceCategory = asyncHandler(async(req:Request,res:Response)=>{
    console.log('hlll')
    try{
        const categories = await this.adviceService.getCategories()
        console.log(categories)
        res.status(HttpStatusCode.OK).json(categories);

    }catch (error) {
        console.log(error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
    }
  })

  
  blockAdviceCategory = asyncHandler(async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const { newStatus } = req.body;
    try {
        const updatedCategory = await this.adviceService.blockAdviceCategory(categoryId, newStatus);
        
        if (!updatedCategory) {
          res.status(HttpStatusCode.NOT_FOUND).json({ message: StatusMessage.NOT_FOUND });
          return
        }
        
        res.status(HttpStatusCode.OK).json({ message: 'Plan status updated successfully', category: updatedCategory });
    } catch (error) {
        console.log(error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
    }
  });

  getSingleAdviceCategory = asyncHandler(async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    try {
        const category = await this.adviceService.getSingleAdviceCategory(categoryId);
        if (!category) {
             res.status(HttpStatusCode.NOT_FOUND).json({ message: StatusMessage.NOT_FOUND });
             return
        }
        res.status(HttpStatusCode.OK).json(category);
    } catch (error) {
        console.log(error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
    }
  });

  updateAdviceCategory = asyncHandler(async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const updateData: IAdviceCategory = req.body;
    const file = req.file as Express.MulterS3.File;   
    try {
        const updatedCategory = await this.adviceService.updateAdiveCategory(categoryId, updateData,file);
        if (!updatedCategory) {
            res.status(HttpStatusCode.NOT_FOUND).json({ message: StatusMessage.NOT_FOUND });
            return
        }
        res.status(HttpStatusCode.OK).json(updatedCategory);
    } catch (error:any) {
        console.log(error);
        if (error.message.includes("already exists")) {
          res.status(HttpStatusCode.BAD_REQUEST).json({
            errors: [error.message],
          });
        } else {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
        }
    }
  });

  //Article

  createArticle = asyncHandler(async(req:Request,res:Response)=>{
    const {title,content,categoryId} = req.body
    const file = req.file as Express.MulterS3.File;
    if (!file) {
      res.status(400).json({ error: "Image is required" });
      return
   }
   const imageUrl = file.location
    try{
      const articleData:ICreateArticle ={
        title,
        content,
        categoryId,
        image:imageUrl
      }
        const newArticle = await this.adviceService.createArticle(articleData)
      res.status(HttpStatusCode.CREATED).json(newArticle);

    }catch (error: any) {
      if (error.message.includes("already exists")) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          errors: [error.message],
        });
      } else {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
          errors: [StatusMessage.INTERNAL_SERVER_ERROR],
        });
      }
    }
  })

  getArticles = asyncHandler(async(req:Request,res:Response)=>{
    try{
        const articles = await this.adviceService.getArticles()
        res.status(HttpStatusCode.OK).json(articles);

    }catch (error) {
        console.log(error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
    }
  })


  getArticlesByCategory = asyncHandler(async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    try {
      const articles = await this.adviceService.getArticlesByCategory(categoryId);
      res.status(HttpStatusCode.OK).json(articles);
    } catch (error) {
      console.log(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
    }
  });

  updateArticle = asyncHandler(async (req: Request, res: Response) => {
    const { articleId } = req.params;
    const updateData: Partial<IArticle> = req.body;
    const file = req.file as Express.MulterS3.File;

    try {
      const updatedArticle = await this.adviceService.updateArticle(articleId, updateData, file);
      res.status(HttpStatusCode.OK).json(updatedArticle);
    } catch (error) {
      console.log(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
    }
  });

  deleteArticle = asyncHandler(async (req: Request, res: Response) => {
    const { articleId } = req.params;
    try {
      const deletedArticle = await this.adviceService.deleteArticle(articleId);
      res.status(HttpStatusCode.OK).json({ message: 'Article deleted successfully', article: deletedArticle });
    } catch (error) {
      console.log(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
    }
  });

  blockArticle = asyncHandler(async (req: Request, res: Response) => {
    const { articleId } = req.params;
    const { newStatus } = req.body;

    try {
      const blockedArticle = await this.adviceService.blockArticle(articleId, newStatus);
      res.status(HttpStatusCode.OK).json({ message: 'Article status updated successfully', article: blockedArticle });
    } catch (error) {
      console.log(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
    }
  });

  getSingleArticle = asyncHandler(async (req: Request, res: Response) => {
    const { articleId } = req.params;
    try {
        const article = await this.adviceService.getSingleArticle(articleId);
        if (!article) {
             res.status(HttpStatusCode.NOT_FOUND).json({ message: StatusMessage.NOT_FOUND });
             return
        }
        res.status(HttpStatusCode.OK).json(article);
    } catch (error) {
        console.log(error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
    }
  });

}