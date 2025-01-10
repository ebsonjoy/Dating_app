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
router.put('/updateUserStatus/:userId',protect,adminControllerr.updateUserStatus)
router.post('/logoutAdmin',adminControllerr.logout)
router.post('/create',adminControllerr.register)
router.get('/paymentDetails',protect,adminControllerr.fetchPayments)
router.get('/dashBoardMasterData',protect,adminControllerr.getDashboardMasterData)
router.get('/dashboard/users',protect,adminControllerr.getUserChartData)
router.get('/dashboard/payments',protect,adminControllerr.getPaymentChartData)

//contaner Plan
router.get('/getAllPlans',protect,planController.getPlans)
router.get('/getOnePlan/:planId',protect,planController.getOnePlan)
router.post('/createNewPlan',protect,validatePlanDetails,planController.createPlan)
router.put('/updatePlan/:planId',protect,planController.updatePlan)
router.put('/updatePlanStatus/:planId',protect,planController.updatePlanStatus)

//container Advice

//Category
router.post('/createAdviceCategory',protect,multerUploadUserImg.single("image"),adviceController.createAdviceCategory)
router.get('/getAdviceCategories',protect,adviceController.getAdviceCategory)
router.put('/blockAdviceCategory/:categoryId',protect,adviceController.blockAdviceCategory)
router.get('/getSingleAdviceCategory/:categoryId',protect,adviceController.getSingleAdviceCategory)
router.put('/updateAdviceCategory/:categoryId',protect,multerUploadUserImg.single("image"),adviceController.updateAdviceCategory)

//Article
router.post('/createArticle',protect,multerUploadUserImg.single("image"),adviceController.createArticle)
router.get('/getArticles',protect,adviceController.getArticles)
router.put('/blockArticle/:articleId',protect,adviceController.blockArticle)
router.get('/getSingleArticle/:articleId',protect,adviceController.getSingleArticle)
router.put('/updateArticle/:articleId',protect,multerUploadUserImg.single("image"),adviceController.updateArticle)
router.delete('/deleteArtilce/:articleId',protect,adviceController.deleteArticle)
router.get('/fetchArtilceByCategory/:categoryId',protect,adviceController.getArticlesByCategory)

router.get('/userReportWithMessages',protect,adminControllerr.getUserReports)
router.put('/updateReportStatus/:reportId',protect,adminControllerr.updateReportStatus)



export default router;
