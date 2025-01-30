import express from 'express';
import { container } from '../config/container';
import { AdminController } from '../controller/admin/AdminController';
import { PlanController } from '../controller/plan/PlanController';
import { validatePlanDetails } from '../validation/validatePlanDetails';
import { AdviceController } from '../controller/advice/AdviceController';
import { adminProtect } from '../middleware/adminAuth';
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
router.get('/getAllUsers',adminProtect,adminControllerr.getAllUsers)
router.put('/updateUserStatus/:userId',adminProtect,adminControllerr.updateUserStatus)
router.get('/paymentDetails',adminProtect,adminControllerr.fetchPayments)
router.get('/dashBoardMasterData',adminProtect,adminControllerr.getDashboardMasterData)
router.get('/dashboard/users',adminProtect,adminControllerr.getUserChartData)
router.get('/dashboard/payments',adminProtect,adminControllerr.getPaymentChartData)

//contaner Plan
router.get('/getAllPlans',adminProtect,planController.getPlans)
router.get('/getOnePlan/:planId',adminProtect,planController.getOnePlan)
router.post('/createNewPlan',adminProtect,validatePlanDetails,planController.createPlan)
router.put('/updatePlan/:planId',adminProtect,planController.updatePlan)
router.put('/updatePlanStatus/:planId',adminProtect,planController.updatePlanStatus)

//container Advice

//Category
router.post('/createAdviceCategory',adminProtect,upload.none(),adviceController.createAdviceCategory)
router.get('/getAdviceCategories',adminProtect,adviceController.getAdviceCategory)
router.put('/blockAdviceCategory/:categoryId',adminProtect,adviceController.blockAdviceCategory)
router.get('/getSingleAdviceCategory/:categoryId',adminProtect,adviceController.getSingleAdviceCategory)
router.put('/updateAdviceCategory/:categoryId',adminProtect,upload.none(),adviceController.updateAdviceCategory)

//admin imageSigned
router.post("/getSignedUrlsAdmin",adviceController.getPresignedUrl);

//Article
router.post('/createArticle',adminProtect,upload.none(),adviceController.createArticle)
router.get('/getArticles',adminProtect,adviceController.getArticles)
router.put('/blockArticle/:articleId',adminProtect,adviceController.blockArticle)
router.get('/getSingleArticle/:articleId',adminProtect,adviceController.getSingleArticle)
router.put('/updateArticle/:articleId',adminProtect,upload.none(),adviceController.updateArticle)
router.delete('/deleteArtilce/:articleId',adminProtect,adviceController.deleteArticle)
router.get('/fetchArtilceByCategory/:categoryId',adminProtect,adviceController.getArticlesByCategory)
//Reports
router.get('/userReportWithMessages',adminProtect,adminControllerr.getUserReports)
router.put('/updateReportStatus/:reportId',adminProtect,adminControllerr.updateReportStatus)



export default router;
