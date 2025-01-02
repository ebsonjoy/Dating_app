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
exports.validatePlanDetails = void 0;
const joi_1 = __importDefault(require("joi"));
const planDetailsSchema = joi_1.default.object({
    planName: joi_1.default.string()
        .trim()
        .regex(/^[A-Za-z\s]+$/)
        .required()
        .messages({
        'string.pattern.base': 'Plan Name must contain only letters.',
        'string.empty': 'Plan Name is required.'
    }),
    duration: joi_1.default.string()
        .trim()
        .required()
        .messages({
        'string.empty': 'Duration is required.'
    }),
    offerPercentage: joi_1.default.number()
        .integer()
        .min(1)
        .max(100)
        .required()
        .messages({
        'number.base': 'Offer Percentage must be a number.',
        'number.min': 'Offer Percentage must be a number between 1 and 100.',
        'number.max': 'Offer Percentage must be a number between 1 and 100.',
        'any.required': 'Offer Percentage is required.'
    }),
    actualPrice: joi_1.default.number()
        .greater(0)
        .required()
        .messages({
        'number.base': 'Actual Price must be a number.',
        'number.greater': 'Actual Price must be a positive number.',
        'any.required': 'Actual Price is required.'
    }),
    offerPrice: joi_1.default.number()
        .greater(0)
        .less(joi_1.default.ref('actualPrice'))
        .required()
        .messages({
        'number.base': 'Offer Price must be a number.',
        'number.greater': 'Offer Price must be a positive number.',
        'number.less': 'Offer Price must be less than or equal to Actual Price.',
        'any.required': 'Offer Price is required.'
    }),
    offerName: joi_1.default.string()
        .trim()
        .regex(/^[A-Za-z\s]+$/)
        .required()
        .messages({
        'string.pattern.base': 'Offer Name must contain only letters.',
        'string.empty': 'Offer Name is required.'
    }),
    features: joi_1.default.array()
        .items(joi_1.default.string().trim().required().messages({
        'string.empty': 'Feature cannot be empty.',
    }))
        .required()
        .min(1)
        .messages({
        'array.base': 'Features must be an array.',
        'array.min': 'At least one feature is required.',
        'any.required': 'Features are required.'
    })
});
const validatePlanDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield planDetailsSchema.validateAsync(req.body, { abortEarly: false });
        next();
    }
    catch (error) {
        const validationError = error;
        res.status(400).json({
            errors: validationError.details.map((err) => err.message)
        });
    }
});
exports.validatePlanDetails = validatePlanDetails;
