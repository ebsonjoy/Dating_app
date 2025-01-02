"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReceiverSocketId = exports.initializeSocket = exports.io = void 0;
const socket_io_1 = require("socket.io");
const Notifications_1 = __importDefault(require("../models/Notifications"));
const userSocketMap = {};
const arr = [];
let playingArray = [];
const initializeSocket = (server) => {
    exports.io = new socket_io_1.Server(server, {
        cors: {
            origin: ["http://localhost:3001"],
            methods: ["GET", "POST"],
        },
    });
    exports.io.on("connection", (socket) => {
        console.log("A user connected", socket.id);
        const userId = socket.handshake.query.userId;
        if (userId && userId !== "undefined") {
            userSocketMap[userId] = socket.id;
        }
        // Existing online users functionality
        exports.io.emit("getOnlineUsers", Object.keys(userSocketMap));
        // Handle message read status
        socket.on("markMessageRead", ({ messageId, senderId, readerId }) => {
            const senderSocketId = userSocketMap[senderId];
            if (senderSocketId) {
                exports.io.to(senderSocketId).emit("messageRead", {
                    messageId,
                    readerId
                });
            }
        });
        // Existing messaging functionality
        socket.on("sendMessage", ({ receiverId, message }) => {
            const receiverSocketId = userSocketMap[receiverId];
            if (receiverSocketId) {
                exports.io.to(receiverSocketId).emit("receiveMessage", {
                    senderId: userId,
                    receiverId: receiverId,
                    message,
                    createdAt: new Date().toISOString(),
                });
            }
        });
        //Notification
        socket.on("notifyLike", (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, likedUserId }) {
            const receiverSocketId = (0, exports.getReceiverSocketId)(likedUserId);
            const notification = {
                userId: likedUserId,
                type: "like",
                message: `${name} liked your profile.`,
            };
            yield Notifications_1.default.create(notification);
            if (receiverSocketId) {
                exports.io.to(receiverSocketId).emit("notification", notification);
            }
        }));
        socket.on("notifyMessage", (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, likedUserId }) {
            const receiverSocketId = (0, exports.getReceiverSocketId)(likedUserId);
            const notification = {
                userId: likedUserId,
                type: "message",
                message: `${name} sent you a message:`,
            };
            yield Notifications_1.default.create(notification);
            if (receiverSocketId) {
                exports.io.to(receiverSocketId).emit("notification", notification);
            }
        }));
        socket.on("notifyMatch", (_a) => __awaiter(void 0, [_a], void 0, function* ({ user1Id, user2Id }) {
            [user1Id, user2Id].forEach((userId) => __awaiter(void 0, void 0, void 0, function* () {
                const receiverSocketId = (0, exports.getReceiverSocketId)(userId);
                const notification = {
                    userId,
                    type: "match",
                    message: `"You have a new match!"`,
                };
                yield Notifications_1.default.create(notification);
                if (receiverSocketId) {
                    exports.io.to(receiverSocketId).emit("notification", notification);
                }
            }));
        }));
        socket.on("call-user", ({ to, offer, from }) => {
            const receiverSocketId = userSocketMap[to];
            if (receiverSocketId) {
                exports.io.to(receiverSocketId).emit("incoming-call", {
                    offer,
                    from
                });
            }
        });
        socket.on("call-accepted", ({ to, answer, from }) => {
            const receiverSocketId = userSocketMap[to];
            if (receiverSocketId) {
                exports.io.to(receiverSocketId).emit("call-accepted", {
                    answer,
                    from
                });
            }
        });
        socket.on("call-rejected", ({ to }) => {
            const receiverSocketId = userSocketMap[to];
            if (receiverSocketId) {
                exports.io.to(receiverSocketId).emit("call-rejected");
            }
        });
        socket.on("ice-candidate", ({ to, candidate }) => {
            const receiverSocketId = userSocketMap[to];
            if (receiverSocketId) {
                exports.io.to(receiverSocketId).emit("ice-candidate", {
                    candidate,
                    from: socket.handshake.query.userId
                });
            }
        });
        socket.on("end-call", ({ to }) => {
            const receiverSocketId = userSocketMap[to];
            if (receiverSocketId) {
                exports.io.to(receiverSocketId).emit("call-ended");
            }
        });
        // Tic-Tac-Toe functionality
        socket.on("find", (e) => {
            console.log('uuuuuuuuuuu', e.userId);
            if (e.name) {
                arr.push(e.name);
                if (arr.length >= 2) {
                    const p1obj = {
                        p1name: arr[0],
                        p1value: "X",
                        p1move: [],
                    };
                    const p2obj = {
                        p2name: arr[1],
                        p2value: "O",
                        p2move: [],
                    };
                    const obj = {
                        p1: p1obj,
                        p2: p2obj,
                        sum: 0,
                        board: Array(9).fill(""),
                    };
                    playingArray.push(obj);
                    arr.splice(0, 2);
                    exports.io.emit("find", { allPlayers: playingArray });
                }
            }
        });
        socket.on("playing", (e) => {
            const objToCheck = playingArray.find((obj) => obj.p1.p1name === e.name || obj.p2.p2name === e.name);
            if (objToCheck) {
                const index = parseInt(e.id.replace("btn", "")) - 1;
                if (objToCheck.board[index] === "") {
                    objToCheck.board[index] = e.value;
                    objToCheck.sum++;
                }
                const winConditions = [
                    [0, 1, 2],
                    [3, 4, 5],
                    [6, 7, 8],
                    [0, 3, 6],
                    [1, 4, 7],
                    [2, 5, 8],
                    [0, 4, 8],
                    [2, 4, 6],
                ];
                let winner = null;
                for (const [a, b, c] of winConditions) {
                    if (objToCheck.board[a] &&
                        objToCheck.board[a] === objToCheck.board[b] &&
                        objToCheck.board[a] === objToCheck.board[c]) {
                        winner = objToCheck.board[a];
                        break;
                    }
                }
                if (winner) {
                    exports.io.emit("gameOver", {
                        winner: winner === "X" ? objToCheck.p1.p1name : objToCheck.p2.p2name,
                        reason: "win",
                    });
                    playingArray = playingArray.filter((obj) => obj !== objToCheck);
                }
                else if (objToCheck.sum === 9) {
                    exports.io.emit("gameOver", {
                        winner: null,
                        reason: "draw",
                    });
                    playingArray = playingArray.filter((obj) => obj !== objToCheck);
                }
                else {
                    exports.io.emit("playing", { allPlayers: playingArray });
                }
            }
        });
        socket.on("resetGame", (e) => {
            playingArray = playingArray.filter((obj) => obj.p1.p1name !== e.name && obj.p2.p2name !== e.name);
            exports.io.emit("playing", { allPlayers: playingArray });
        });
        socket.on("gameOver", (e) => {
            playingArray = playingArray.filter((obj) => obj.p1.p1name !== e.name);
        });
        socket.on("disconnect", () => {
            console.log("User disconnected", socket.id);
            if (userId) {
                delete userSocketMap[userId];
            }
            exports.io.emit("getOnlineUsers", Object.keys(userSocketMap));
        });
    });
};
exports.initializeSocket = initializeSocket;
const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};
exports.getReceiverSocketId = getReceiverSocketId;
