"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAdminToken = (res, adminId) => {
    const token = jsonwebtoken_1.default.sign({ adminId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
    res.cookie('admin_jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};
exports.default = generateAdminToken;
