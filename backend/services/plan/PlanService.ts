import { inject, injectable } from "inversify";
import { IPlanService } from "../../interfaces/plan/IPlanService";
import { IPlanRepository } from "../../interfaces/plan/IPlanRepository";
import { IPlanDocument } from "../../types/plan.types";

@injectable()
export class PlanService implements IPlanService {
    constructor(
        @inject('IPlanRepository') private planRepository: IPlanRepository
    ) {}

    async fetchPlans(): Promise<IPlanDocument[]> {
        return this.planRepository.getAll();
    }

    async fetchUserPlans(): Promise<IPlanDocument[]> {
        return this.planRepository.getUserPlans();
    }

    async fetchPlanById(id: string): Promise<IPlanDocument> {
        const plan = await this.planRepository.getById(id);
        if (!plan) throw new Error('Plan not found');
        return plan;
    }

    async addNewPlan(planData: Partial<IPlanDocument>): Promise<IPlanDocument> {
        return this.planRepository.create(planData);
    }

    async editPlan(id: string, planData: Partial<IPlanDocument>): Promise<IPlanDocument> {
        const plan = await this.planRepository.update(id, planData);
        if (!plan) throw new Error('Plan not found');
        return plan;
    }

    async togglePlanStatus(id: string, status: boolean): Promise<IPlanDocument> {
        const plan = await this.planRepository.updateStatus(id, status);
        if (!plan) throw new Error('Plan not found');
        return plan;
    }
}