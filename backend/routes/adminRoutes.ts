import express from 'express';
import { protect } from '../middleware/adminAuthMiddleware';
import { container } from '../config/container';
import { AdminController } from '../controller/admin/AdminController';
import { PlanController } from '../controller/plan/PlanController';


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
router.post('/createNewPlan',planController.createPlan)
router.put('/updatePlan/:planId',planController.updatePlan)
router.put('/updatePlanStatus/:planId',planController.updatePlanStatus)


//  admin login
// router.post('/login', adminController.authAdmin);
// router.post('/logoutAdmin',adminController.logoutAdmin)
// router.post('/create', adminController.registerAdmin);
// router.get('/getAllUsers',protect,adminController.getAllUsers)
// router.put('/updateUserStatus/:userId',adminController.updateUserStatus)

// plans 
// router.get('/getAllPlans',planController.getPlans);
// router.get('/getOnePlan/:planId',planController.getPlan)
// router.post('/createNewPlan',planController.createPlan)
// router.put('/updatePlan/:planId',planController.updatePlan)
// router.put('/updatePlanStatus/:planId',planController.updatePlanStatus)


export default router;
