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
        try {
            return await this.planRepository.getAll();
        } catch (error) {
            console.log(error);
            throw new Error('Failed to fetch plans');
        }
    }
    
    async fetchUserPlans(): Promise<IPlanDocument[]> {
        try {
            return await this.planRepository.getUserPlans();
        } catch (error) {
            console.log(error);
            throw new Error('Failed to fetch user plans');
        }
    }
    

    async fetchPlanById(id: string): Promise<IPlanDocument> {
        try {
            const plan = await this.planRepository.getById(id);
            if (!plan) throw new Error('Plan not found');
            return plan;
        } catch (error) {
            console.log(error);
            throw new Error('Failed to fetch plan by ID');
        }
    }
    
    async addNewPlan(planData: Partial<IPlanDocument>): Promise<IPlanDocument> {
        try {
            return await this.planRepository.create(planData);
        } catch (error) {
            console.log(error);
            throw new Error('Failed to add new plan');
        }
    }
    
    async editPlan(id: string, planData: Partial<IPlanDocument>): Promise<IPlanDocument> {
        try {
            const plan = await this.planRepository.update(id, planData);
            if (!plan) throw new Error('Plan not found');
            return plan;
        } catch (error) {
            console.log(error);
            throw new Error('Failed to edit plan');
        }
    }
    

    async togglePlanStatus(id: string, status: boolean): Promise<IPlanDocument> {
        try {
            const plan = await this.planRepository.updateStatus(id, status);
            if (!plan) throw new Error('Plan not found');
            return plan;
        } catch (error) {
            console.log(error);
            throw new Error('Failed to toggle plan status');
        }
    }
    
}