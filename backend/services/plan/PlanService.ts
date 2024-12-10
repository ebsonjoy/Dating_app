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
            const existingPlan = await this.planRepository.findByPlanName(planData.planName!); 
    if (existingPlan) {
      throw new Error(`Plan with name "${planData.planName}" already exists.`);
    }
            return await this.planRepository.create(planData);
        } catch (error) {
            console.log('Error in addNewPlan:', error);
            throw error;
        }
    }
    
    async editPlan(id: string, planData: Partial<IPlanDocument>): Promise<IPlanDocument> {
        try {

            const currentPlan = await this.planRepository.getById(id);
            if (!currentPlan) {
                throw new Error('Plan not found');
            }

            if (planData.planName && planData.planName !== currentPlan.planName) {
                const existingPlan = await this.planRepository.findByPlanName(planData.planName);
                if (existingPlan) {
                    throw new Error(`Plan with name "${planData.planName}" already exists.`);
                }
            }

            const plan = await this.planRepository.update(id, planData);
            if (!plan) throw new Error('Plan not found');
            return plan;
        } catch (error) {
            console.log('Failed to edit plan',error);
            throw error;
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