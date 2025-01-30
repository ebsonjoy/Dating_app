import express from 'express';
import { container } from '../config/container';
import { MessageController } from '../controller/messages/MessageController';
import { userProtect } from "../middleware/userAuth";
import { checkSubscription } from "../middleware/checkSubscription ";
import { checkRole } from '../middleware/roleMiddleware';




const router = express.Router();
const messageController = container.get<MessageController>('MessageController')


router.post('/messages/:userId',userProtect,checkRole(['user']),checkSubscription,messageController.sendMessage);
router.get('/chat-history',userProtect,checkRole(['user']), messageController.getChatHistory);
router.post('/createCallHistory',userProtect,checkRole(['user']),messageController.createCallHistroy)
router.post('/mark-message-read',userProtect,checkRole(['user']), messageController.markMessagesAsRead);
router.get('/message-unread-count',userProtect,checkRole(['user']), messageController.getUnreadMessageCount);


export default router;
