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
const signupSchema = joi_1.default.object({
    name: joi_1.default.string()
        .pattern(/^[A-Za-z]+(\s[A-Za-z]+)*$/)
        .min(1)
        .required()
        .messages({
        'string.pattern.base': 'Name should contain only alphabets.',
        'string.empty': 'Name is required.',
        'any.required': 'Name is required.'
    }),
    email: joi_1.default.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'edu'] } })
        .required()
        .messages({
        'string.email': 'Please provide a valid email address.',
        'any.required': 'Email is required.'
    }),
    mobileNumber: joi_1.default.string()
        .pattern(/^(?!.*([0-9])\1{9})[1-9][0-9]{9}$/)
        .required()
        .messages({
        'string.pattern.base': 'Mobile number must be a 10-digit number, cannot start with 0, and cannot be all the same digit.',
        'any.required': 'Mobile number is required.'
    }),
    password: joi_1.default.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/) // At least 1 uppercase, 1 lowercase, 1 digit, 1 special character, and min length of 8
        .required()
        .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        'string.min': 'Password must be at least 8 characters long.',
        'any.required': 'Password is required.'
    }),
    confirmPassword: joi_1.default.string()
        .valid(joi_1.default.ref('password'))
        .required()
        .messages({
        'any.only': 'Passwords do not match.',
        'any.required': 'Confirm password is required.'
    }),
    dateOfBirth: joi_1.default.date()
        .less('now') // Date of birth should be before the current date
        .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18))) // Person should be 18 or older
        .required()
        .messages({
        'date.base': 'Date of birth must be a valid date.',
        'date.max': 'You must be at least 18 years old to register.',
        'any.required': 'Date of birth is required.'
    })
});
const validateSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield signupSchema.validateAsync(req.body, { abortEarly: false }); // `abortEarly: false` to gather all validation errors
        next();
    }
    catch (error) {
        const validationError = error;
        res.status(400).json({ errors: validationError.details.map(err => err.message) });
    }
});
exports.default = validateSignup;
