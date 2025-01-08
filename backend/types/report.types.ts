import { ObjectId } from 'mongoose';

export interface IReport {
    reporterId: ObjectId;     
    reportedId: ObjectId;     
    reason: string;           
    additionalDetails?: string; 
    status: 'Pending' | 'Reviewed' | 'Resolved'; 
    createdAt: Date;           
    updatedAt: Date; 
}
