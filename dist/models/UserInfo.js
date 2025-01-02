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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userInfoSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    gender: {
        type: String,
        required: true,
    },
    lookingFor: {
        type: String,
        required: true,
    },
    profilePhotos: {
        type: [String],
        required: true,
    },
    relationship: {
        type: String,
        required: true,
    },
    interests: {
        type: [String],
        required: true,
    },
    occupation: {
        type: String,
        required: true,
    },
    education: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: true,
    },
    smoking: {
        type: String,
        required: true,
    },
    drinking: {
        type: String,
        required: true,
    },
    place: {
        type: String,
        required: true,
    },
    caste: {
        type: String,
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
});
userInfoSchema.index({ location: '2dsphere' });
const UserInfo = mongoose_1.default.model('UserInfo', userInfoSchema);
exports.default = UserInfo;
