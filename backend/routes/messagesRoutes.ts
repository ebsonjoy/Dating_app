import express from 'express';
import { container } from '../config/container';
import { MessageController } from '../controller/messages/MessageController';
import { userProtect } from "../middleware/userAuth";
import { checkSubscription } from "../middleware/checkSubscription ";




const router = express.Router();
const messageController = container.get<MessageController>('MessageController')


router.post('/messages/:userId',userProtect,checkSubscription,messageController.sendMessage);
router.get('/chat-history',userProtect, messageController.getChatHistory);
router.post('/createCallHistory',userProtect,messageController.createCallHistroy)
router.post('/mark-message-read',userProtect, messageController.markMessagesAsRead);
router.get('/message-unread-count',userProtect, messageController.getUnreadMessageCount);


export default router;
