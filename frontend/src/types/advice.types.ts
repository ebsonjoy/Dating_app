export interface IAdviceCategory {
    _id: string;
    name: string;
    description: string;
    image: string;
    isBlock: boolean;
  }
  
  export interface IArticle {
    _id: string;
    title: string;
    content: string;
    image: string;
    categoryId: string;
    isBlock: boolean;
  }