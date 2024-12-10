import mongoose, { Schema } from 'mongoose';
import { IPayment } from '../types/payment.types';

const PaymentSchema: Schema<IPayment> = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      unique: true,
    },
    userName: { 
      type: String, 
      required: true 
    },
    planName: { 
      type: String, 
      required: true 
    },
    amount: { 
      type: Number, 
      required: true 
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: 'Plan',
      default: null,
  },
    date: { 
      type: Date, 
      default: Date.now 
    }
  },
  {
    timestamps: true
  }
);

const Payment =  mongoose.model<IPayment>('Payment', PaymentSchema);
export default Payment;