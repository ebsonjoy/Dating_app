import { IPlanDocument } from "../../types/plan.types";
export interface IPlanRepository {
  getAll(): Promise<IPlanDocument[]>;
  getById(id: string): Promise<IPlanDocument | null>;
  findByPlanName(planName: string): Promise<IPlanDocument | null>;
  create(plan: Partial<IPlanDocument>): Promise<IPlanDocument>;
  update(id: string, plan: Partial<IPlanDocument>): Promise<IPlanDocument | null>;
  updateStatus(id: string, status: boolean): Promise<IPlanDocument | null>;
}