import express from 'express';
import { container } from '../config/container';
import { MessageController } from '../controller/messages/MessageController';
import { userProtect } from "../middleware/userAuth";
// import { checkSubscription } from "../middleware/checkSubscription ";




const router = express.Router();
const messageController = container.get<MessageController>('MessageController')


router.post('/messages/:userId',userProtect,messageController.sendMessage);
router.get('/chat-history', messageController.getChatHistory);
router.post('/createCallHistory',messageController.createCallHistroy)


export default router;
