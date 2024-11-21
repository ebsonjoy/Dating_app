import express from 'express';
// import { protect } from '../middleware/adminAuthMiddleware';
import { container } from '../config/container';
import { MessageController } from '../controller/messages/MessageController';


const router = express.Router();

const messageController = container.get<MessageController>('MessageController')


router.post('/messages/:userId', messageController.sendMessage);
router.get('/chat-history', messageController.getChatHistory);
// router.post('/messages/read', messageController.markMessagesAsRead);
// router.get('/messages/unread/:userId', messageController.getUnreadMessagesCount);

export default router;
