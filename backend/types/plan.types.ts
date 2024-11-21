import { Document } from 'mongoose';

export interface IPlan{
  planName: string;
  duration: string;
  offerPercentage: number;
  actualPrice: number;
  offerPrice: number;
  offerName: string;
  status:boolean;
  features: string[];
  }

  export interface IPlanDocument extends IPlan, Document {}