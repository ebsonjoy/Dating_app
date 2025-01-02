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
exports.userProtect = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const tokenService_1 = __importDefault(require("../utils/tokenService"));
const User_1 = __importDefault(require("../models/User"));
const userProtect = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    if (accessToken) {
        const decodedAccess = tokenService_1.default.verifyAccessToken(accessToken);
        if (decodedAccess) {
            req.user = yield User_1.default.findById(decodedAccess.userId).select('-password');
            return next();
        }
    }
    if (refreshToken) {
        const decodedRefresh = tokenService_1.default.verifyRefreshToken(refreshToken);
        if (decodedRefresh) {
            const user = yield User_1.default.findById(decodedRefresh.userId);
            if (user) {
                const newAccessToken = tokenService_1.default.generateAccessToken(user._id.toString());
                tokenService_1.default.setTokenCookies(res, newAccessToken, refreshToken);
                req.user = user;
                return next();
            }
        }
    }
    res.status(401);
    throw new Error('Not authorized, invalid or expired token');
}));
exports.userProtect = userProtect;
