import 'reflect-metadata';
import { Container } from 'inversify';
// plans
import Plan from '../models/PlanModel'
import { IPlanRepository } from '../interfaces/plan/IPlanRepository';
import { IPlanService } from '../interfaces/plan/IPlanService';
import { PlanRepository } from '../repositories/plan/PlanRepository';
import { PlanService } from '../services/plan/PlanService';
import { PlanController } from '../controller/plan/PlanController';

// admin
import { IAdminRepository } from '../interfaces/admin/IAdminRepository';
import { IAdminService } from '../interfaces/admin/IAdminService';
import { AdminRepository } from '../repositories/admin/AdminRepository';
import { AdminService } from '../services/admin/AdminService';
import { AdminController } from '../controller/admin/AdminController';
// import Admin from '../models/AdminModel';
// import User from '../models/User';

//User
import { IUserRepository } from '../interfaces/user/IUserRepository';
import { IUserService } from '../interfaces/user/IUserService';
import { UserRepository } from '../repositories/user/UserRepository';
import { UserService } from '../services/user/UserService';
import { UserController } from '../controller/user/UserController';
// import UserInfo from '../models/UserInfo';

//Messages
import { IMessageRepository } from '../interfaces/messages/IMessageRepository';
import { IMessageService } from '../interfaces/messages/IMessageService';
import { MessageRepository } from '../repositories/messages/messageRepository';
import { MessageService } from '../services/messages/messageService';
import { MessageController } from '../controller/messages/MessageController';
import Message from '../models/MessageModel';
import Conversation from '../models/conversationModel';
import CallHistory from '../models/videoCall';

//Advice
import { IAdviceRepository } from '../interfaces/advice/IAdviceRepository';
import { IAdviceService } from '../interfaces/advice/IAdviceService';
import { AdviceRepository } from '../repositories/advice/AdviceRepository';
import { AdviceService } from '../services/advice/AdviceService';
import { AdviceController } from '../controller/advice/AdviceController';
import AdviceCategory from '../models/AdviceCategory';
import Article from '../models/Article';

const container = new Container();

// PLAN Container
container.bind<IPlanRepository>('IPlanRepository').toDynamicValue(() => {
    return new PlanRepository(Plan);
}).inSingletonScope();
container.bind<IPlanService>('IPlanService').to(PlanService).inSingletonScope();
container.bind<PlanController>('PlanController').to(PlanController).inSingletonScope();


// Admin Container
container.bind<IAdminRepository>('IAdminRepository').toDynamicValue(() => {
    return new AdminRepository();
}).inSingletonScope();
container.bind<IAdminService>('IAdminService').to(AdminService).inSingletonScope();
container.bind<AdminController>('AdminController').to(AdminController).inSingletonScope();


// User Container
container.bind<IUserRepository>('IUserRepository').toDynamicValue(() => {
    return new UserRepository();
}).inSingletonScope();
container.bind<IUserService>('IUserService').to(UserService).inSingletonScope();
container.bind<UserController>('UserController').to(UserController).inSingletonScope();

// Message Container
container.bind<IMessageRepository>('IMessageRepository').toDynamicValue(()=>{
    return new MessageRepository(Message,Conversation,CallHistory)
}).inSingletonScope()
container.bind<IMessageService>('IMessageService').to(MessageService).inSingletonScope();
container.bind<MessageController>('MessageController').to(MessageController).inSingletonScope();

//Advice Container
container.bind<IAdviceRepository>('IAdviceRepository').toDynamicValue(() => {
    return new AdviceRepository(AdviceCategory,Article);
}).inSingletonScope();
container.bind<IAdviceService>('IAdviceService').to(AdviceService).inSingletonScope();
container.bind<AdviceController>('AdviceController').to(AdviceController).inSingletonScope();

export { container };