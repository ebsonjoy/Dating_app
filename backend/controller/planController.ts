import  { IPlan } from "../models/PlanModel";
// import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import PlanService from "../services/planService";

const getPlans = asyncHandler(async(req,res)=>{
    try{
    const plans = await PlanService.fetchPlans()
    res.status(200).json(plans);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Failed to retrieve plans' });
  }
})

const getPlan = asyncHandler(async(req,res)=>{
    const {planId} = req.params
    try{
        const plan = await PlanService.fetchPlanById(planId);
    res.status(200).json(plan);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error : any) {
    res.status(404).json({ message: error.message });
  }
})

const createPlan = asyncHandler(async(req,res)=>{
    const planData: IPlan = req.body;
    try {
      const newPlan = await PlanService.addNewPlan(planData);
      res.status(201).json(newPlan);
    } catch (error) {
        console.log(error);
      res.status(500).json({ message: 'Failed to create plan' });
    }
})

const updatePlan = asyncHandler(async(req,res)=>{
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


export {
    getPlans,
    getPlan,
    createPlan,
    updatePlan

}