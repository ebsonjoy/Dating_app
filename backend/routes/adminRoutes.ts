import express from 'express';
import { protect } from '../middleware/adminAuthMiddleware';
import { container } from '../config/container';
import { AdminController } from '../controller/admin/AdminController';
import { PlanController } from '../controller/plan/PlanController';
import { validatePlanDetails } from '../validation/validatePlanDetails';
const router = express.Router();


const adminControllerr = container.get<AdminController>('AdminController')
const planController = container.get<PlanController>('PlanController');


// container admin
router.get('/getAllUsers',protect,adminControllerr.getAllUsers)
router.post('/login',adminControllerr.login)
router.put('/updateUserStatus/:userId',adminControllerr.updateUserStatus)
router.post('/logoutAdmin',adminControllerr.logout)
router.post('/create',adminControllerr.register)

//contaner Plan
router.get('/getAllPlans',planController.getPlans)
router.get('/getOnePlan/:planId',planController.getOnePlan)
router.post('/createNewPlan',validatePlanDetails,planController.createPlan)
router.put('/updatePlan/:planId',validatePlanDetails,planController.updatePlan)
router.put('/updatePlanStatus/:planId',planController.updatePlanStatus)


export default router;
