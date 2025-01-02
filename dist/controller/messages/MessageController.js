"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const inversify_1 = require("inversify");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const HttpStatusCode_1 = require("../../enums/HttpStatusCode");
const StatusMessage_1 = require("../../enums/StatusMessage");
const socket_1 = require("../../socket/socket");
let MessageController = class MessageController {
    constructor(messageService) {
        this.messageService = messageService;
        this.sendMessage = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const receiverId = req.params.userId;
            const _a = req.body, { senderId } = _a, messageData = __rest(_a, ["senderId"]);
            try {
                const newMessage = yield this.messageService.sendMessage(senderId, receiverId, messageData);
                // SOCKET.IO FUNCTIONALITY
                const receiverSocketId = (0, socket_1.getReceiverSocketId)(receiverId);
                if (receiverSocketId) {
                    socket_1.io.to(receiverSocketId).emit("newMessage", {
                        senderId,
                        message: newMessage.message,
                        createdAt: newMessage.createdAt,
                    });
                }
                res
                    .status(HttpStatusCode_1.HttpStatusCode.CREATED)
                    .json({ success: true, data: newMessage });
            }
            catch (error) {
                console.error(error);
                res
                    .status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
                    .json({ success: false, error: StatusMessage_1.StatusMessage.SEND_MESSAGE_FAILED });
            }
        }));
        this.getChatHistory = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId1, userId2 } = req.query;
            if (!userId1 || !userId2) {
                res
                    .status(400)
                    .json({ success: false, error: "User IDs are required" });
                return;
            }
            try {
                const messages = yield this.messageService.getChatHistory(userId1, userId2);
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, data: messages });
            }
            catch (error) {
                console.error(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: StatusMessage_1.StatusMessage.GET_CHAT_HISTORY_FAILED,
                });
            }
        }));
        this.createCallHistroy = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { callerId, receiverId, type, duration, status } = req.body;
            console.log("hissssssssssssssssssssssssssssssss", req.body);
            try {
                const callHistory = yield this.messageService.createCallHistory({
                    callerId,
                    receiverId,
                    type,
                    duration,
                    status,
                });
                res
                    .status(HttpStatusCode_1.HttpStatusCode.OK)
                    .json({ success: true, data: callHistory });
                console.log("caaaaaaaaaaaaaaaaaa", callHistory);
            }
            catch (error) {
                console.error(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: StatusMessage_1.StatusMessage.GET_CHAT_HISTORY_FAILED,
                });
            }
        }));
        this.markMessagesAsRead = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId, senderId } = req.body;
            try {
                const updatedMessages = yield this.messageService.markMessagesAsRead(userId, senderId);
                console.log(updatedMessages);
                // Emit socket event for each updated message
                //   const senderSocketId = getReceiverSocketId(senderId);
                // if (senderSocketId) {
                //   updatedMessages.forEach((message) => {
                //     io.to(senderSocketId).emit("messageRead", {
                //       messageId: message._id,
                //       readerId: userId,
                //     });
                //   });
                // }
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true });
            }
            catch (error) {
                console.error(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Failed to mark messages as read",
                });
            }
        }));
        // markMessagesAsRead = asyncHandler(
        //   async (req: Request, res: Response): Promise<void> => {
        //     const { userId, senderId } = req.body;
        //     try {
        //       await this.messageService.markMessagesAsRead(userId, senderId);
        //       res.status(HttpStatusCode.OK).json({ success: true });
        //     } catch (error) {
        //       console.error(error);
        //       res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        //         success: false,
        //         error: "Failed to mark messages as read",
        //       });
        //     }
        //   }
        // );
        this.getUnreadMessageCount = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.query;
            try {
                const unreadCounts = yield this.messageService.getUnreadMessageCount(userId);
                res
                    .status(HttpStatusCode_1.HttpStatusCode.OK)
                    .json({ success: true, data: unreadCounts });
            }
            catch (error) {
                console.error(error);
                res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Failed to get unread message count",
                });
            }
        }));
    }
};
exports.MessageController = MessageController;
exports.MessageController = MessageController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)("IMessageService")),
    __metadata("design:paramtypes", [Object])
], MessageController);
