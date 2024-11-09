import Joi from 'joi';
import { Request, Response, NextFunction } from 'express'; 
import { ValidationError } from 'joi'; 

const signupSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[A-Za-z]+(\s[A-Za-z]+)*$/)
    .min(1)
    .required()
    .messages({
      'string.pattern.base': 'Name should contain only alphabets.',
      'string.empty': 'Name is required.',
      'any.required': 'Name is required.'
    }),
  
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'edu'] } }) 
    .required()
    .messages({
      'string.email': 'Please provide a valid email address.',
      'any.required': 'Email is required.'
    }),

    mobileNumber: Joi.string()
    .pattern(/^(?!.*([0-9])\1{9})[1-9][0-9]{9}$/) 
    .required()
    .messages({
      'string.pattern.base': 'Mobile number must be a 10-digit number, cannot start with 0, and cannot be all the same digit.',
      'any.required': 'Mobile number is required.'
    }),

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/) // At least 1 uppercase, 1 lowercase, 1 digit, 1 special character, and min length of 8
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      'string.min': 'Password must be at least 8 characters long.',
      'any.required': 'Password is required.'
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match.',
      'any.required': 'Confirm password is required.'
    }),

  dateOfBirth: Joi.date()
    .less('now') // Date of birth should be before the current date
    .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18))) // Person should be 18 or older
    .required()
    .messages({
      'date.base': 'Date of birth must be a valid date.',
      'date.max': 'You must be at least 18 years old to register.',
      'any.required': 'Date of birth is required.'
    })
});

const validateSignup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await signupSchema.validateAsync(req.body, { abortEarly: false }); // `abortEarly: false` to gather all validation errors
    next();
  } catch (error) {
    const validationError = error as ValidationError;
    res.status(400).json({ errors: validationError.details.map(err => err.message) });
  }
};

export default validateSignup;
