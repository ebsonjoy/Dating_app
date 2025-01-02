"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminAuthMiddleware_1 = require("../middleware/adminAuthMiddleware");
const container_1 = require("../config/container");
const validatePlanDetails_1 = require("../validation/validatePlanDetails");
const multer_1 = require("../config/multer");
const router = express_1.default.Router();
const adminControllerr = container_1.container.get('AdminController');
const planController = container_1.container.get('PlanController');
const adviceController = container_1.container.get('AdviceController');
// container admin
router.get('/getAllUsers', adminAuthMiddleware_1.protect, adminControllerr.getAllUsers);
router.post('/login', adminControllerr.login);
router.put('/updateUserStatus/:userId', adminControllerr.updateUserStatus);
router.post('/logoutAdmin', adminControllerr.logout);
router.post('/create', adminControllerr.register);
router.get('/paymentDetails', adminControllerr.fetchPayments);
router.get('/dashBoardMasterData', adminControllerr.getDashboardMasterData);
router.get('/dashboard/users', adminControllerr.getUserChartData);
router.get('/dashboard/payments', adminControllerr.getPaymentChartData);
//contaner Plan
router.get('/getAllPlans', planController.getPlans);
router.get('/getOnePlan/:planId', planController.getOnePlan);
router.post('/createNewPlan', validatePlanDetails_1.validatePlanDetails, planController.createPlan);
router.put('/updatePlan/:planId', planController.updatePlan);
router.put('/updatePlanStatus/:planId', planController.updatePlanStatus);
//container Advice
//Category
router.post('/createAdviceCategory', multer_1.multerUploadUserImg.single("image"), adviceController.createAdviceCategory);
router.get('/getAdviceCategories', adviceController.getAdviceCategory);
router.put('/blockAdviceCategory/:categoryId', adviceController.blockAdviceCategory);
router.get('/getSingleAdviceCategory/:categoryId', adviceController.getSingleAdviceCategory);
router.put('/updateAdviceCategory/:categoryId', multer_1.multerUploadUserImg.single("image"), adviceController.updateAdviceCategory);
//Article
router.post('/createArticle', multer_1.multerUploadUserImg.single("image"), adviceController.createArticle);
router.get('/getArticles', adviceController.getArticles);
router.put('/blockArticle/:articleId', adviceController.blockArticle);
router.get('/getSingleArticle/:articleId', adviceController.getSingleArticle);
router.put('/updateArticle/:articleId', multer_1.multerUploadUserImg.single("image"), adviceController.updateArticle);
router.delete('/deleteArtilce/:articleId', adviceController.deleteArticle);
router.get('/fetchArtilceByCategory/:categoryId', adviceController.getArticlesByCategory);
exports.default = router;
