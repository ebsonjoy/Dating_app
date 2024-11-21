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
import Admin from '../models/AdminModel';
import User from '../models/User';

//User
import { IUserRepository } from '../interfaces/user/IUserRepository';
import { IUserService } from '../interfaces/user/IUserService';
import { UserRepository } from '../repositories/user/UserRepository';
import { UserService } from '../services/user/UserService';
import { UserController } from '../controller/user/UserController';
import UserInfo from '../models/UserInfo';

//Messages
import { IMessageRepository } from '../interfaces/messages/IMessageRepository';
import { IMessageService } from '../interfaces/messages/IMessageService';
import { MessageRepository } from '../repositories/messages/messageRepository';
import { MessageService } from '../services/messages/messageService';
import { MessageController } from '../controller/messages/MessageController';
import Message from '../models/MessageModel';
import Conversation from '../models/conversationModel';

const container = new Container();

// PLAN Container


container.bind<IPlanRepository>('IPlanRepository').toDynamicValue(() => {
    return new PlanRepository(Plan);
}).inSingletonScope();
container.bind<IPlanService>('IPlanService').to(PlanService).inSingletonScope();
container.bind<PlanController>('PlanController').to(PlanController).inSingletonScope();


// Admin Container

container.bind<IAdminRepository>('IAdminRepository').toDynamicValue(() => {
    return new AdminRepository(Admin, User);
}).inSingletonScope();
container.bind<IAdminService>('IAdminService').to(AdminService).inSingletonScope();
container.bind<AdminController>('AdminController').to(AdminController).inSingletonScope();


// User Container
container.bind<IUserRepository>('IUserRepository').toDynamicValue(() => {
    return new UserRepository(User, UserInfo);
}).inSingletonScope();
container.bind<IUserService>('IUserService').to(UserService).inSingletonScope();
container.bind<UserController>('UserController').to(UserController).inSingletonScope();

// Message Container

container.bind<IMessageRepository>('IMessageRepository').toDynamicValue(()=>{
    return new MessageRepository(Message,Conversation)
}).inSingletonScope()
container.bind<IMessageService>('IMessageService').to(MessageService).inSingletonScope();
container.bind<MessageController>('MessageController').to(MessageController).inSingletonScope();

export { container };