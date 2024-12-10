import { IPlanDocument } from "../../types/plan.types";

export interface IPlanService {
  fetchPlans(): Promise<IPlanDocument[]>;
  fetchPlanById(id: string): Promise<IPlanDocument>;
  addNewPlan(plan: Partial<IPlanDocument>): Promise<IPlanDocument>;
  editPlan(id: string, plan: Partial<IPlanDocument>): Promise<IPlanDocument>;
  togglePlanStatus(id: string, status: boolean): Promise<IPlanDocument>;
  
}