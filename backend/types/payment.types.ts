import { Types,Document } from 'mongoose';

export interface IPayment extends Document {
  paymentId:string;
  userName: string;
  planName: string;
  amount: number;
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  date?: Date;
}

export interface IPaymentCreate {
  paymentId:string;
  userName: string;
  planName: string;
  amount: number;
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  date?: Date;
}
