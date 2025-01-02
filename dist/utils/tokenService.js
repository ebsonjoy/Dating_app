"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class TokenService {
    static generateAccessToken(userId) {
        return jsonwebtoken_1.default.sign({ userId, tokenType: 'access' }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    }
    static generateRefreshToken(userId) {
        return jsonwebtoken_1.default.sign({ userId, tokenType: 'refresh' }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    }
    static setTokenCookies(res, accessToken, refreshToken) {
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
    }
    static verifyAccessToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
            return decoded.tokenType === 'access' ? decoded : null;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    static verifyRefreshToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET);
            return decoded.tokenType === 'refresh' ? decoded : null;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
}
exports.default = TokenService;
