// import PlanRepository from "../repositories/planRepository";
// // import { IPlan } from "../models/PlanModel";
// import { IPlanDocument } from "../types/plan.types";

// class PlanService {
//   async fetchPlans(): Promise<IPlanDocument[] | null> {
//     return PlanRepository.getPlans();
//   }

//   async fetchUserPlans(): Promise<IPlanDocument[] | null> {
//     return PlanRepository.getUserPlans();
//   }

//   async fetchPlanById(planId: string): Promise<IPlanDocument> {
//     const plan = await PlanRepository.getPlanById(planId);
//     if (!plan) {
//       throw new Error("Plan not found");
//     }
//     return plan;
//   }
//   async addNewPlan(planData:IPlanDocument): Promise<IPlanDocument>{
//     return PlanRepository.addPlan(planData)
//   }

//   // Edit an existing plan

//   async editPlan(planId:string,planData:IPlanDocument): Promise<IPlanDocument>{
//     const updatedPlan = await PlanRepository.editPlan(planId, planData);
//   if (!updatedPlan) {
//     throw new Error('Failed to update plan');
//   }
//   return updatedPlan;
//   }

//   async togglePlanStatus(planId: string, newStatus: boolean){
//     try{
//       const updatePlan = await PlanRepository.updatePlanStatus(planId,newStatus)
//       return updatePlan;
//     } catch (error) {
//       console.log(error);
//       throw new Error('Failed to toggle user status');
//     }
//   }
// }

// export default new PlanService();
