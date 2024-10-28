import { injectable } from "inversify";
import { IPlanRepository } from "../../interfaces/plan/IPlanRepository";
import { IPlanDocument } from "../../types/plan.types";
import { Model } from 'mongoose';



@injectable()
export class PlanRepository implements IPlanRepository {
    constructor(private readonly model: Model<IPlanDocument>) {}

    async getAll(): Promise<IPlanDocument[]> {
        return this.model.find();
    }

    async getById(id: string): Promise<IPlanDocument | null> {
        return this.model.findById(id);
    }

    async create(plan: Partial<IPlanDocument>): Promise<IPlanDocument> {
        return this.model.create(plan);
    }

    async update(id: string, plan: Partial<IPlanDocument>): Promise<IPlanDocument | null> {
        return this.model.findByIdAndUpdate(id, plan, { new: true });
    }

    async updateStatus(id: string, status: boolean): Promise<IPlanDocument | null> {
        return this.model.findByIdAndUpdate(id, { status }, { new: true });
    }

    async getUserPlans(): Promise<IPlanDocument[]> {
        return this.model.find({ status: true });
    }
}