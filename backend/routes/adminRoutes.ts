import express from 'express';
import { protect } from '../middleware/adminAuthMiddleware';
import { container } from '../config/container';
import { AdminController } from '../controller/admin/AdminController';
import { PlanController } from '../controller/plan/PlanController';
import { validatePlanDetails } from '../validation/validatePlanDetails';
import { AdviceController } from '../controller/advice/AdviceController';
import { multerUploadUserImg } from "../config/multer";
const router = express.Router();


const adminControllerr = container.get<AdminController>('AdminController')
const planController = container.get<PlanController>('PlanController');
const adviceController = container.get<AdviceController>('AdviceController');



// container admin
router.get('/getAllUsers',protect,adminControllerr.getAllUsers)
router.post('/login',adminControllerr.login)
router.put('/updateUserStatus/:userId',adminControllerr.updateUserStatus)
router.post('/logoutAdmin',adminControllerr.logout)
router.post('/create',adminControllerr.register)
router.get('/paymentDetails',adminControllerr.fetchPayments)
router.get('/dashBoardMasterData',adminControllerr.getDashboardMasterData)
router.get('/dashboard/users',adminControllerr.getUserChartData)
router.get('/dashboard/payments',adminControllerr.getPaymentChartData)

//contaner Plan
router.get('/getAllPlans',planController.getPlans)
router.get('/getOnePlan/:planId',planController.getOnePlan)
router.post('/createNewPlan',validatePlanDetails,planController.createPlan)
router.put('/updatePlan/:planId',planController.updatePlan)
router.put('/updatePlanStatus/:planId',planController.updatePlanStatus)

//container Advice

//Category
router.post('/createAdviceCategory',multerUploadUserImg.single("image"),adviceController.createAdviceCategory)
router.get('/getAdviceCategories',adviceController.getAdviceCategory)
router.put('/blockAdviceCategory/:categoryId',adviceController.blockAdviceCategory)
router.get('/getSingleAdviceCategory/:categoryId',adviceController.getSingleAdviceCategory)
router.put('/updateAdviceCategory/:categoryId',multerUploadUserImg.single("image"),adviceController.updateAdviceCategory)

//Article
router.post('/createArticle',multerUploadUserImg.single("image"),adviceController.createArticle)
router.get('/getArticles',adviceController.getArticles)
router.put('/blockArticle/:articleId',adviceController.blockArticle)
router.get('/getSingleArticle/:articleId',adviceController.getSingleArticle)
router.put('/updateArticle/:articleId',multerUploadUserImg.single("image"),adviceController.updateArticle)
router.delete('/deleteArtilce/:articleId',adviceController.deleteArticle)
router.get('/fetchArtilceByCategory/:categoryId',adviceController.getArticlesByCategory)

router.get('/userReportWithMessages',adminControllerr.getUserReports)
router.put('/updateReportStatus/:reportId',adminControllerr.updateReportStatus)



export default router;
