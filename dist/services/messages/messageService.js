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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const inversify_1 = require("inversify");
let MessageService = class MessageService {
    constructor(messageRepository) {
        this.messageRepository = messageRepository;
    }
    sendMessage(senderId, receiverId, messageData) {
        return __awaiter(this, void 0, void 0, function* () {
            let conversation = yield this.messageRepository.findConversationByUserIds(senderId, receiverId);
            if (!conversation) {
                conversation = yield this.messageRepository.createConversation(senderId, receiverId);
            }
            const newMessage = yield this.messageRepository.createMessage(senderId, receiverId, messageData);
            if (newMessage && conversation._id) {
                yield this.messageRepository.addMessageToConversation(conversation._id.toString(), newMessage._id.toString());
            }
            return newMessage;
        });
    }
    getChatHistory(userId1, userId2) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.messageRepository.getChatHistory(userId1, userId2);
            }
            catch (error) {
                console.log(error);
                throw new Error('Failed to get chat history');
            }
        });
    }
    // Video
    createCallHistory(callHistory) {
        return __awaiter(this, void 0, void 0, function* () {
            const { callerId, receiverId, type, duration, status } = callHistory;
            console.log('in serviceeeeeee', callHistory);
            try {
                const newCallHistory = yield this.messageRepository.createCallHistory({
                    callerId,
                    receiverId,
                    type,
                    duration,
                    status,
                });
                const senderId = callerId.toString();
                const callHistoryId = newCallHistory._id.toString();
                let conversation = yield this.messageRepository.findConversationByUserIds(senderId, receiverId.toString());
                if (!conversation) {
                    conversation = yield this.messageRepository.createConversation(senderId, receiverId.toString());
                }
                let messageText = '';
                const callDuration = duration !== null && duration !== void 0 ? duration : 0;
                switch (status) {
                    case 'ended':
                        messageText = `Video call ended (${Math.floor(callDuration / 60)}:${(callDuration % 60)
                            .toString()
                            .padStart(2, '0')})`;
                        break;
                    case 'rejected':
                        messageText = 'Call rejected';
                        break;
                    case 'missed':
                        messageText = 'Missed call';
                        break;
                    default:
                        messageText = 'Video call';
                }
                const message = messageText;
                console.log('switch case', message);
                const newMessage = yield this.messageRepository.createMessageCallHistory({
                    senderId,
                    receiverId: receiverId.toString(),
                    message,
                    callHistoryId
                });
                if (newMessage && conversation._id) {
                    yield this.messageRepository.addMessageToConversation(conversation._id.toString(), newMessage._id.toString());
                }
            }
            catch (error) {
                console.error('Failed to create call history:', error);
                throw new Error('Failed to create call history');
            }
        });
    }
    // async markMessagesAsRead(userId: string, senderId: string): Promise<void> {
    //   await this.messageRepository.markMessagesAsRead(userId, senderId);
    // }
    markMessagesAsRead(userId, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield this.messageRepository.findMessage(userId, senderId, false);
            if (messages.length > 0) {
                yield this.messageRepository.updateMessage(userId, senderId, false);
            }
            return messages;
        });
    }
    getUnreadMessageCount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.messageRepository.getUnreadMessageCount(userId);
        });
    }
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IMessageRepository')),
    __metadata("design:paramtypes", [Object])
], MessageService);
