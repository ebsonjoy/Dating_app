import express from 'express';
import { authAdmin, registerAdmin,logoutAdmin,getAllUsers,updateUserStatus } from '../controller/adminController';
import { getPlan,getPlans,createPlan,updatePlan } from '../controller/planController';
import { protect } from '../middleware/adminAuthMiddleware';

const router = express.Router();

//  admin login
router.post('/login', authAdmin);
router.post('/logoutAdmin',logoutAdmin)
router.post('/create', registerAdmin);
router.get('/getAllUsers',protect,getAllUsers)
router.put('/updateUserStatus/:userId',updateUserStatus)

// plans 

router.get('/getAllPlans',getPlans);
router.get('/getOnePlan/:planId',getPlan)
router.post('/createNewPlan',createPlan)
router.put('/updatePlan/:planId',updatePlan)

export default router;
