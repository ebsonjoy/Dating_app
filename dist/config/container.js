"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
// plans
const PlanModel_1 = __importDefault(require("../models/PlanModel"));
const PlanRepository_1 = require("../repositories/plan/PlanRepository");
const PlanService_1 = require("../services/plan/PlanService");
const PlanController_1 = require("../controller/plan/PlanController");
const AdminRepository_1 = require("../repositories/admin/AdminRepository");
const AdminService_1 = require("../services/admin/AdminService");
const AdminController_1 = require("../controller/admin/AdminController");
const AdminModel_1 = __importDefault(require("../models/AdminModel"));
const User_1 = __importDefault(require("../models/User"));
const UserRepository_1 = require("../repositories/user/UserRepository");
const UserService_1 = require("../services/user/UserService");
const UserController_1 = require("../controller/user/UserController");
const UserInfo_1 = __importDefault(require("../models/UserInfo"));
const messageRepository_1 = require("../repositories/messages/messageRepository");
const messageService_1 = require("../services/messages/messageService");
const MessageController_1 = require("../controller/messages/MessageController");
const MessageModel_1 = __importDefault(require("../models/MessageModel"));
const conversationModel_1 = __importDefault(require("../models/conversationModel"));
const videoCall_1 = __importDefault(require("../models/videoCall"));
const AdviceRepository_1 = require("../repositories/advice/AdviceRepository");
const AdviceService_1 = require("../services/advice/AdviceService");
const AdviceController_1 = require("../controller/advice/AdviceController");
const AdviceCategory_1 = __importDefault(require("../models/AdviceCategory"));
const Article_1 = __importDefault(require("../models/Article"));
const container = new inversify_1.Container();
exports.container = container;
// PLAN Container
container.bind('IPlanRepository').toDynamicValue(() => {
    return new PlanRepository_1.PlanRepository(PlanModel_1.default);
}).inSingletonScope();
container.bind('IPlanService').to(PlanService_1.PlanService).inSingletonScope();
container.bind('PlanController').to(PlanController_1.PlanController).inSingletonScope();
// Admin Container
container.bind('IAdminRepository').toDynamicValue(() => {
    return new AdminRepository_1.AdminRepository(AdminModel_1.default, User_1.default);
}).inSingletonScope();
container.bind('IAdminService').to(AdminService_1.AdminService).inSingletonScope();
container.bind('AdminController').to(AdminController_1.AdminController).inSingletonScope();
// User Container
container.bind('IUserRepository').toDynamicValue(() => {
    return new UserRepository_1.UserRepository(User_1.default, UserInfo_1.default);
}).inSingletonScope();
container.bind('IUserService').to(UserService_1.UserService).inSingletonScope();
container.bind('UserController').to(UserController_1.UserController).inSingletonScope();
// Message Container
container.bind('IMessageRepository').toDynamicValue(() => {
    return new messageRepository_1.MessageRepository(MessageModel_1.default, conversationModel_1.default, videoCall_1.default);
}).inSingletonScope();
container.bind('IMessageService').to(messageService_1.MessageService).inSingletonScope();
container.bind('MessageController').to(MessageController_1.MessageController).inSingletonScope();
//Advice Container
container.bind('IAdviceRepository').toDynamicValue(() => {
    return new AdviceRepository_1.AdviceRepository(AdviceCategory_1.default, Article_1.default);
}).inSingletonScope();
container.bind('IAdviceService').to(AdviceService_1.AdviceService).inSingletonScope();
container.bind('AdviceController').to(AdviceController_1.AdviceController).inSingletonScope();
