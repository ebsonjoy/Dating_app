import { injectable } from "inversify";
import { IPlanRepository } from "../../interfaces/plan/IPlanRepository";
import { IPlanDocument } from "../../types/plan.types";
import { Model } from "mongoose";

@injectable()
export class PlanRepository implements IPlanRepository {
  constructor(private readonly model: Model<IPlanDocument>) {}

  async getAll(): Promise<IPlanDocument[]> {
    try {
      return await this.model.find().exec();
    } catch (error) {
      console.error("Error fetching all plans:", error);
      throw new Error("Failed to retrieve plans");
    }
  }

  async getById(id: string): Promise<IPlanDocument | null> {
    try {
      const plan = await this.model.findById(id).exec();
      if (!plan) throw new Error("Plan not found");
      return plan;
    } catch (error) {
      console.error("Error fetching plan by ID:", error);
      throw new Error("Failed to retrieve plan");
    }
  }
  async findByPlanName(planName: string): Promise<IPlanDocument | null> {
    try {
      return await this.model.findOne({ planName });
    } catch (error) {
      console.error("Error fetching plan by name:", error);
      throw new Error("Failed to retrieve plan by name");
    }
  }

  async create(plan: Partial<IPlanDocument>): Promise<IPlanDocument> {
    try {
      return await this.model.create(plan);
    } catch (error) {
      console.error("Error creating plan:", error);
      throw new Error("Failed to create plan");
    }
  }

  async update(
    id: string,
    plan: Partial<IPlanDocument>
  ): Promise<IPlanDocument | null> {
    try {
      const updatedPlan = await this.model.findByIdAndUpdate(id, plan, {
        new: true,
      });
      if (!updatedPlan) throw new Error("Plan not found");
      return updatedPlan;
    } catch (error) {
      console.error("Error updating plan:", error);
      throw new Error("Failed to update plan");
    }
  }
  async updateStatus(
    id: string,
    status: boolean
  ): Promise<IPlanDocument | null> {
    try {
      const updatedPlan = await this.model.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      ).select('_id planName status')
      if (!updatedPlan) {
        throw new Error("Plan not found");
      }
      return updatedPlan;
    } catch (error) {
      console.error("Error updating plan status:", error);
      throw new Error("Failed to update plan status");
    }
  }

}
