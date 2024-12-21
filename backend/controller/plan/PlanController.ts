/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import asyncHandler from 'express-async-handler';
import { IPlanService } from '../../interfaces/plan/IPlanService';
import { HttpStatusCode } from "../../enums/HttpStatusCode";
import { IPlanDocument } from '../../types/plan.types';
import { StatusMessage } from '../../enums/StatusMessage';


@injectable()
export class PlanController {
  constructor(
    @inject("IPlanService") private readonly planService: IPlanService
  ) {}

  getPlans = asyncHandler(async (req: Request, res: Response) => {
    try {
        const plans = await this.planService.fetchPlans();
        res.status(HttpStatusCode.OK).json(plans);
    } catch (error) {
        console.log(error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
    }
});


createPlan = asyncHandler(async (req: Request, res: Response) => {
  const planData: IPlanDocument = req.body;
  console.log(planData);

  try {
    const newPlan = await this.planService.addNewPlan(planData);
    res.status(HttpStatusCode.CREATED).json(newPlan);
  } catch (error: any) {
    if (error.message.includes("already exists")) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        errors: [error.message],
      });
    } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        errors: [StatusMessage.INTERNAL_SERVER_ERROR],
      });
    }
  }
});

getOnePlan = asyncHandler(async (req: Request, res: Response) => {
  const { planId } = req.params;
  try {
      const plan = await this.planService.fetchPlanById(planId);
      if (!plan) {
           res.status(HttpStatusCode.NOT_FOUND).json({ message: StatusMessage.NOT_FOUND });
           return
      }
      res.status(HttpStatusCode.OK).json(plan);
  } catch (error) {
      console.log(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
  }
});


updatePlan = asyncHandler(async (req: Request, res: Response) => {
  const { planId } = req.params;
  const planData: IPlanDocument = req.body;
  console.log(planData)

  try {
      const updatedPlan = await this.planService.editPlan(planId, planData);
      if (!updatedPlan) {
          res.status(HttpStatusCode.NOT_FOUND).json({ message: StatusMessage.NOT_FOUND });
          return
      }
      res.status(HttpStatusCode.OK).json(updatedPlan);
  } catch (error:any) {
      console.log(error);
      if (error.message.includes("already exists")) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          errors: [error.message],
        });
      } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
      }
  }
});

updatePlanStatus = asyncHandler(async (req: Request, res: Response) => {
  const { planId } = req.params;
  const { newStatus } = req.body;
  try {
      const updatedPlan = await this.planService.togglePlanStatus(planId, newStatus);
      
      if (!updatedPlan) {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: StatusMessage.NOT_FOUND });
        return
      }
      
      res.status(HttpStatusCode.OK).json({ message: 'Plan status updated successfully', plan: updatedPlan });
  } catch (error) {
      console.log(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
  }
});
}