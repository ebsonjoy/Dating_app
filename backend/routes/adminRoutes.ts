import express from 'express';
import { container } from '../config/container';
import { AdminController } from '../controller/admin/AdminController';
import { PlanController } from '../controller/plan/PlanController';
import { validatePlanDetails } from '../validation/validatePlanDetails';
import { AdviceController } from '../controller/advice/AdviceController';
import { adminProtect } from '../middleware/adminAuth';
import { checkRole } from '../middleware/roleMiddleware';
import multer from 'multer';
const router = express.Router();
const upload = multer();


const adminControllerr = container.get<AdminController>('AdminController')
const planController = container.get<PlanController>('PlanController');
const adviceController = container.get<AdviceController>('AdviceController');



// container admin
router.post('/logoutAdmin',adminControllerr.logout)
router.post('/create',adminControllerr.register)
router.post('/login',adminControllerr.login)
router.get('/getAllUsers',adminProtect,checkRole(['admin']),adminControllerr.getAllUsers)
router.put('/updateUserStatus/:userId',adminProtect,checkRole(['admin']),adminControllerr.updateUserStatus)
router.get('/paymentDetails',adminProtect,checkRole(['admin']),adminControllerr.fetchPayments)
router.get('/dashBoardMasterData',adminProtect,checkRole(['admin']),adminControllerr.getDashboardMasterData)
router.get('/dashboard/users',adminProtect,checkRole(['admin']),adminControllerr.getUserChartData)
router.get('/dashboard/payments',adminProtect,checkRole(['admin']),adminControllerr.getPaymentChartData)

//contaner Plan
router.get('/getAllPlans',adminProtect,checkRole(['admin']),planController.getPlans)
router.get('/getOnePlan/:planId',adminProtect,checkRole(['admin']),planController.getOnePlan)
router.post('/createNewPlan',adminProtect,checkRole(['admin']),validatePlanDetails,planController.createPlan)
router.put('/updatePlan/:planId',adminProtect,checkRole(['admin']),planController.updatePlan)
router.put('/updatePlanStatus/:planId',adminProtect,checkRole(['admin']),planController.updatePlanStatus)

//container Advice

//Category
router.post('/createAdviceCategory',adminProtect,checkRole(['admin']),upload.none(),adviceController.createAdviceCategory)
router.get('/getAdviceCategories',adminProtect,checkRole(['admin']),adviceController.getAdviceCategory)
router.put('/blockAdviceCategory/:categoryId',adminProtect,checkRole(['admin']),adviceController.blockAdviceCategory)
router.get('/getSingleAdviceCategory/:categoryId',adminProtect,checkRole(['admin']),adviceController.getSingleAdviceCategory)
router.put('/updateAdviceCategory/:categoryId',adminProtect,checkRole(['admin']),upload.none(),adviceController.updateAdviceCategory)

//admin imageSigned
router.post("/getSignedUrlsAdmin",adviceController.getPresignedUrl);

//Article
router.post('/createArticle',adminProtect,checkRole(['admin']),upload.none(),adviceController.createArticle)
router.get('/getArticles',adminProtect,checkRole(['admin']),adviceController.getArticles)
router.put('/blockArticle/:articleId',adminProtect,checkRole(['admin']),adviceController.blockArticle)
router.get('/getSingleArticle/:articleId',adminProtect,checkRole(['admin']),adviceController.getSingleArticle)
router.put('/updateArticle/:articleId',adminProtect,checkRole(['admin']),upload.none(),adviceController.updateArticle)
router.delete('/deleteArtilce/:articleId',adminProtect,checkRole(['admin']),adviceController.deleteArticle)
router.get('/fetchArtilceByCategory/:categoryId',adminProtect,checkRole(['admin']),adviceController.getArticlesByCategory)
//Reports
router.get('/userReportWithMessages',adminProtect,checkRole(['admin']),adminControllerr.getUserReports)
router.put('/updateReportStatus/:reportId',adminProtect,checkRole(['admin']),adminControllerr.updateReportStatus)
router.post('/createPlanFeature',adminProtect,adminControllerr.createPlanFeature)
router.get('/fetchPlanFeatures',adminProtect,adminControllerr.getPlanFeatures)



export default router;
