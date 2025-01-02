"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
exports.MessageRepository = void 0;
const inversify_1 = require("inversify");
const mongoose_1 = __importStar(require("mongoose"));
let MessageRepository = class MessageRepository {
    constructor(MessageModel, ConversationModel, CallHistoryModel) {
        this.MessageModel = MessageModel;
        this.ConversationModel = ConversationModel;
        this.CallHistoryModel = CallHistoryModel;
    }
    createMessage(senderId, receiverId, messageData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = new this.MessageModel(Object.assign(Object.assign({}, messageData), { senderId,
                    receiverId }));
                return yield message.save();
            }
            catch (error) {
                console.error('Error creating message:', error);
                throw new Error('Failed to create message');
            }
        });
    }
    getChatHistory(userId1_1, userId2_1) {
        return __awaiter(this, arguments, void 0, function* (userId1, userId2, limit = 50, skip = 0) {
            return yield this.MessageModel.find({
                $or: [
                    { senderId: userId1, receiverId: userId2 },
                    { senderId: userId2, receiverId: userId1 },
                ],
            })
                .sort({ createdAt: 1 })
                .skip(skip)
                .limit(limit);
        });
    }
    findConversationByUserIds(userId1, userId2) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ConversationModel.findOne({ participants: { $all: [userId1, userId2] } });
        });
    }
    createConversation(userId1, userId2) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ConversationModel.create({ participants: [userId1, userId2] });
        });
    }
    addMessageToConversation(conversationId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ConversationModel.findByIdAndUpdate(conversationId, {
                    $push: { messages: messageId },
                });
            }
            catch (error) {
                console.error('Error adding message to conversation:', error);
                throw new Error('Failed to add message to conversation');
            }
        });
    }
    // call
    createCallHistory(callHistory) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const history = new this.CallHistoryModel({
                    callerId: callHistory.callerId,
                    receiverId: callHistory.receiverId,
                    type: callHistory.type,
                    duration: callHistory.duration,
                    status: callHistory.status
                });
                return yield history.save();
            }
            catch (error) {
                console.error('Error creating message:', error);
                throw new Error('Failed to create message');
            }
        });
    }
    createMessageCallHistory(messageData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = new this.MessageModel({
                    message: messageData.message,
                    senderId: messageData.senderId,
                    receiverId: messageData.receiverId,
                    callHistoryId: messageData.callHistoryId,
                });
                return yield message.save();
            }
            catch (error) {
                console.error('Error creating message:', error);
                throw new Error('Failed to create message');
            }
        });
    }
    // async markMessagesAsRead(userId: string, senderId: string): Promise<void> {
    //   await this.MessageModel.updateMany(
    //     { 
    //       senderId: senderId, 
    //       receiverId: userId, 
    //       isRead: false 
    //     }, 
    //     { 
    //       $set: { isRead: true } 
    //     }
    //   );
    // }
    getUnreadMessageCount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const unreadCounts = yield this.MessageModel.aggregate([
                {
                    $match: {
                        receiverId: new mongoose_1.default.Types.ObjectId(userId),
                        isRead: false
                    }
                },
                {
                    $group: {
                        _id: "$senderId",
                        count: { $sum: 1 }
                    }
                }
            ]);
            return unreadCounts.reduce((acc, item) => {
                acc[item._id.toString()] = item.count;
                return acc;
            }, {});
        });
    }
    findMessage(userId1, userId2, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.MessageModel.find({
                receiverId: userId1,
                senderId: userId2,
                isRead: status,
            });
        });
    }
    updateMessage(userId1, senderId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.MessageModel.updateMany({
                receiverId: userId1,
                senderId: senderId,
                isRead: status,
            }, { isRead: true });
        });
    }
};
exports.MessageRepository = MessageRepository;
exports.MessageRepository = MessageRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [mongoose_1.Model, mongoose_1.Model, mongoose_1.Model])
], MessageRepository);
