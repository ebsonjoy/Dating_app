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
exports.GoogleAuthService = void 0;
const google_auth_library_1 = require("google-auth-library");
const User_1 = __importDefault(require("../../models/User"));
const crypto_1 = __importDefault(require("crypto"));
class GoogleAuthService {
    constructor() {
        this.client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }
    verifyGoogleToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticket = yield this.client.verifyIdToken({
                    idToken: token,
                    audience: process.env.GOOGLE_CLIENT_ID
                });
                const payload = ticket.getPayload();
                return payload;
            }
            catch (error) {
                console.log(error);
                throw new Error('Invalid Google token');
            }
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    findOrCreateUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!(payload === null || payload === void 0 ? void 0 : payload.email)) {
                    throw new Error('No email found in Google payload');
                }
                let user = yield User_1.default.findOne({ email: payload.email });
                if (!user) {
                    user = yield User_1.default.create({
                        name: payload.name,
                        email: payload.email,
                        password: crypto_1.default.randomBytes(16).toString('hex'),
                        status: true,
                        isGoogleLogin: true,
                        googleId: payload.sub,
                        dateOfBirth: 'NA',
                        mobileNumber: 'NA'
                    });
                    return user;
                }
                user = yield User_1.default.findOneAndUpdate({ email: payload.email }, { isGoogleLogin: false }, { new: true });
                if (!user) {
                    throw new Error('Failed to update existing user');
                }
                return user;
            }
            catch (error) {
                console.error('Error in findOrCreateUser:', error);
                throw new Error('Error creating user from Google data');
            }
        });
    }
}
exports.GoogleAuthService = GoogleAuthService;
