import { Document } from 'mongoose';

export interface IPlan{
  // _id: Types.ObjectId;
  planName: string;
  duration: string;
  offerPercentage: number;
  actualPrice: number;
  offerPrice: number;
  offerName: string;
  status:boolean;
  }

  export interface IPlanDocument extends IPlan, Document {}