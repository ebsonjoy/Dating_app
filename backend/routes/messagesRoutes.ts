import express from 'express';

import { container } from '../config/container';
import { MessageController } from '../controller/messages/MessageController';


const router = express.Router();

const messageController = container.get<MessageController>('MessageController')


router.post('/messages/:userId', messageController.sendMessage);
router.get('/chat-history', messageController.getChatHistory);


export default router;
