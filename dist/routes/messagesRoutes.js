"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_1 = require("../config/container");
const userAuth_1 = require("../middleware/userAuth");
const checkSubscription_1 = require("../middleware/checkSubscription ");
const router = express_1.default.Router();
const messageController = container_1.container.get('MessageController');
router.post('/messages/:userId', userAuth_1.userProtect, checkSubscription_1.checkSubscription, messageController.sendMessage);
router.get('/chat-history', messageController.getChatHistory);
router.post('/createCallHistory', messageController.createCallHistroy);
router.post('/mark-message-read', messageController.markMessagesAsRead);
router.get('/message-unread-count', messageController.getUnreadMessageCount);
exports.default = router;
