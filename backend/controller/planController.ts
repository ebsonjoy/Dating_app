import  { IPlan } from "../models/PlanModel";
// import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import PlanService from "../services/planService";


class PlanController {
 getPlans = asyncHandler(async(req,res)=>{
    try{
    const plans = await PlanService.fetchPlans()
    res.status(200).json(plans);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Failed to retrieve plans' });
  }
})

 getUserPlans = asyncHandler(async(req,res)=>{
  try{
  const plans = await PlanService.fetchUserPlans()
  res.status(200).json(plans);
} catch (error) {
  console.log(error)
  res.status(500).json({ message: 'Failed to retrieve plans' });
}
})

 getPlan = asyncHandler(async(req,res)=>{
    const {planId} = req.params
    try{
        const plan = await PlanService.fetchPlanById(planId);
    res.status(200).json(plan);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error : any) {
    res.status(404).json({ message: error.message });
  }
})

 createPlan = asyncHandler(async(req,res)=>{
    const planData: IPlan = req.body;
    try {
      const newPlan = await PlanService.addNewPlan(planData);
      res.status(201).json(newPlan);
    } catch (error) {
        console.log(error);
      res.status(500).json({ message: 'Failed to create plan' });
    }
})

 updatePlan = asyncHandler(async(req,res)=>{
    const  {planId} = req.params;
    const planData: IPlan = req.body;
    try {
      const updatedPlan = await PlanService.editPlan(planId, planData);
      res.status(200).json(updatedPlan);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      res.status(404).json({ message: error.message });
    }
})
 updatePlanStatus = asyncHandler(async (req,res) => {
  const { planId } = req.params;
  const { newStatus } = req.body;  
  console.log(planId);
  console.log(newStatus);
  try {
    const updatedPlan = await PlanService.togglePlanStatus(planId, newStatus);

    res.status(200).json({ message: 'User status updated', plan: updatedPlan });
  } catch (error) {
    console.log(error);
   
    res.status(500).json({ message: 'Error updating user status' });
  }
});


}

export default new PlanController();
