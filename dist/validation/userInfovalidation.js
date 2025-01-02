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
const joi_1 = __importDefault(require("joi"));
const userInfoSchema = joi_1.default.object({
    gender: joi_1.default.string()
        .valid('male', 'female', 'other')
        .required()
        .messages({
        'any.only': 'Gender must be male, female, or other.',
        'any.required': 'Gender is required.'
    }),
    lookingFor: joi_1.default.string()
        .valid('friendship', 'relationship', 'casual', 'serious')
        .required()
        .messages({
        'any.only': 'Looking for must be one of: friendship, relationship, casual, or serious.',
        'any.required': 'Looking for is required.'
    }),
    relationship: joi_1.default.string()
        .valid('single', 'in a relationship', 'married', 'divorced', 'widowed')
        .required()
        .messages({
        'any.only': 'Relationship status must be one of: single, in a relationship, married, divorced, or widowed.',
        'any.required': 'Relationship status is required.'
    }),
    interests: joi_1.default.array()
        .items(joi_1.default.string().trim().min(1))
        .min(1)
        .required()
        .messages({
        'array.min': 'At least one interest is required.',
        'any.required': 'Interests are required.'
    }),
    place: joi_1.default.string()
        .trim()
        .min(1)
        .required()
        .messages({
        'string.empty': 'Place is required.',
        'any.required': 'Place is required.'
    }),
    caste: joi_1.default.string()
        .trim()
        .min(1)
        .required()
        .messages({
        'string.empty': 'Caste is required.',
        'any.required': 'Caste is required.'
    }),
    occupation: joi_1.default.string()
        .trim()
        .min(1)
        .required()
        .messages({
        'string.empty': 'Occupation is required.',
        'any.required': 'Occupation is required.'
    }),
    education: joi_1.default.string()
        .trim()
        .min(1)
        .required()
        .messages({
        'string.empty': 'Education is required.',
        'any.required': 'Education is required.'
    }),
    bio: joi_1.default.string()
        .trim()
        .max(300)
        .messages({
        'string.max': 'Bio must be 300 characters or less.'
    }),
    smoking: joi_1.default.string()
        .valid('yes', 'no', 'occasionally')
        .required()
        .messages({
        'any.only': 'Smoking preference must be yes, no, or occasionally.',
        'any.required': 'Smoking preference is required.'
    }),
    drinking: joi_1.default.string()
        .valid('yes', 'no', 'occasionally')
        .required()
        .messages({
        'any.only': 'Drinking preference must be yes, no, or occasionally.',
        'any.required': 'Drinking preference is required.'
    }),
    profilePhotos: joi_1.default.array()
        .items(joi_1.default.object().keys({
        name: joi_1.default.string().required(),
        size: joi_1.default.number().max(5 * 1024 * 1024).required(),
        type: joi_1.default.string().valid('image/jpeg', 'image/png', 'image/gif').required()
    })).max(4) // Limit to 4 profile photos
        .required()
        .messages({
        'array.max': 'You can upload a maximum of 4 profile photos.',
        'any.required': 'Profile photos are required.'
    }),
    location: joi_1.default.object({
        latitude: joi_1.default.number().required().messages({
            'any.required': 'Latitude is required.'
        }),
        longitude: joi_1.default.number().required().messages({
            'any.required': 'Longitude is required.'
        })
    }).required().messages({
        'any.required': 'Location is required.'
    })
});
// Middleware for validating user info
const validateUserInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userInfoSchema.validateAsync(req.body, { abortEarly: false });
        next();
    }
    catch (error) {
        const validationError = error;
        res.status(400).json({ errors: validationError.details.map(err => err.message) });
    }
});
exports.default = validateUserInfo;
