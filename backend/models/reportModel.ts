import { Schema, model } from 'mongoose';
import {IReport} from '../types/report.types'

const ReportSchema = new Schema<IReport>({
    reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reportedId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true},
    additionalDetails: { type: String },
    status: { 
        type: String, 
        enum: ['Pending', 'Reviewed', 'Resolved'], 
        default: 'Pending' 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true 
});

const Report = model<IReport>('Report', ReportSchema);

export default Report;
