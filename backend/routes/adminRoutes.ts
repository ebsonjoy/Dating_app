import express from 'express';
// import { authAdmin, registerAdmin,logoutAdmin,getAllUsers,updateUserStatus } from '../controller/adminController';
// import { getPlan,getPlans,createPlan,updatePlan,updatePlanStatus } from '../controller/planController';
import { protect } from '../middleware/adminAuthMiddleware';
import adminController from '../controller/adminController';
import planController from '../controller/planController';

const router = express.Router();

//  admin login
router.post('/login', adminController.authAdmin);
router.post('/logoutAdmin',adminController.logoutAdmin)
router.post('/create', adminController.registerAdmin);
router.get('/getAllUsers',protect,adminController.getAllUsers)
router.put('/updateUserStatus/:userId',adminController.updateUserStatus)

// plans 

router.get('/getAllPlans',planController.getPlans);
router.get('/getOnePlan/:planId',planController.getPlan)
router.post('/createNewPlan',planController.createPlan)
router.put('/updatePlan/:planId',planController.updatePlan)
router.put('/updatePlanStatus/:planId',planController.updatePlanStatus)


export default router;
