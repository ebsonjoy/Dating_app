// import { UpdateQuery } from 'mongoose';
// import Plan from '../models/PlanModel';
// // import {IPlan} from '../models/PlanModel'
// import { IPlanDocument } from '../types/plan.types';

// class PlanRepository{

//     // Get all plans
//     async getPlans(): Promise<IPlanDocument[]>{
//         return Plan.find()
//     }

//     async getUserPlans(): Promise<IPlanDocument[]>{
//         return Plan.find({ status: true });
//     }

// // Get a single plan by ID
//     async getPlanById(planId:string): Promise<IPlanDocument| null>{
//         const plan = Plan.findById(planId)
//         if(!plan){
//             throw new Error('Plan not found');
//         }
//         return plan
//     }

//     // Add new Plan
//     async addPlan(planData:IPlanDocument): Promise<IPlanDocument>{
//         const newPlan = new Plan(planData);  
//         return await newPlan.save(); 
//     }
//     // Edit an existing plan

//     async editPlan(planId:string,updateData:UpdateQuery<IPlanDocument>):Promise<IPlanDocument | null>{
//         return Plan.findByIdAndUpdate(planId, updateData, { new: true });
//     }

    
//   async updatePlanStatus(planId: string, newStatus: boolean){
//     try{
//       const updatedPlan = await Plan.findByIdAndUpdate( planId,{status:newStatus},{new:true})
//       if (!updatedPlan) {
//         throw new Error('User not found');
//       }
//       return updatedPlan;
//     } catch (error) {
//       console.log(error);
//       throw new Error('Error updating user status');
//     }
//   }

// }

// export default new PlanRepository