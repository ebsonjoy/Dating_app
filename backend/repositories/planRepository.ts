import { UpdateQuery } from 'mongoose';
import Plan from '../models/PlanModel';
import {IPlan} from '../models/PlanModel'

class PlanRepository{

    // Get all plans
    async getPlans(): Promise<IPlan[]>{
        return Plan.find()
    }

    async getUserPlans(): Promise<IPlan[]>{
        return Plan.find({ status: true });
    }

// Get a single plan by ID
    async getPlanById(planId:string): Promise<IPlan| null>{
        const plan = Plan.findById(planId)
        if(!plan){
            throw new Error('Plan not found');
        }
        return plan
    }

    // Add new Plan
    async addPlan(planData:IPlan): Promise<IPlan>{
        const newPlan = new Plan(planData);  
        return await newPlan.save(); 
    }
    // Edit an existing plan

    async editPlan(planId:string,updateData:UpdateQuery<IPlan>):Promise<IPlan | null>{
        return Plan.findByIdAndUpdate(planId, updateData, { new: true });
    }

    
  async updatePlanStatus(planId: string, newStatus: boolean){
    try{
      const updatedPlan = await Plan.findByIdAndUpdate( planId,{status:newStatus},{new:true})
      if (!updatedPlan) {
        throw new Error('User not found');
      }
      return updatedPlan;
    } catch (error) {
      console.log(error);
      throw new Error('Error updating user status');
    }
  }

}

export default new PlanRepository