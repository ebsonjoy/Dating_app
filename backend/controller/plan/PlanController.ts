import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import asyncHandler from 'express-async-handler';
import { IPlanService } from '../../interfaces/plan/IPlanService';
import { HttpStatusCode } from "../../enums/HttpStatusCode";
import { IPlanDocument } from '../../types/plan.types';


@injectable()
export class PlanController {
  constructor(
    @inject("IPlanService") private readonly planService: IPlanService
  ) {}

  getPlans = asyncHandler(async (req: Request, res: Response) => {
    try {
      const plans = await this.planService.fetchPlans();
      res.status(200).json(plans);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to retrieve plans' });
    }
  });

  getUserPlan = asyncHandler(async(req:Request,res:Response)=>{
    try{
      const plans = await this.planService.fetchUserPlans();
      res.status(200).json(plans);
    }catch(error){
      console.log(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({message:'Failed'})
    }
  })

  createPlan = asyncHandler(async(req:Request, res:Response)=>{
    const planData : IPlanDocument = req.body
    try {
      const newPlan = await this.planService.addNewPlan(planData)
      res.status(HttpStatusCode.CREATED).json(newPlan);
    } catch (error) {
      console.log(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({message:'Failed'})
    }
  })

  getOnePlan = asyncHandler(async(req:Request,res:Response)=>{
    const {planId} = req.params
    try {
      const plan = await this.planService.fetchPlanById(planId)
    res.status(200).json(plan);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
    res.status(404).json({ message: error.message });
    }
  })

  updatePlan = asyncHandler(async(req,res)=>{
    const {planId} =req.params;
    const planData:IPlanDocument = req.body
    try{
      const updatedPlan = await this.planService.editPlan(planId,planData)
      res.status(HttpStatusCode.OK).json(updatedPlan)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch (error:any) {
      res.status(404).json({ message: error.message });
    }
  })

  updatePlanStatus = asyncHandler(async(req,res)=>{
    const {planId} = req.params
    const {newStatus} = req.body
    try{
      const updatedPlan = await this.planService.togglePlanStatus(planId,newStatus)
    res.status(200).json({ message: 'User status updated', plan: updatedPlan });
    }catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error updating user status' });
    }
  })

}