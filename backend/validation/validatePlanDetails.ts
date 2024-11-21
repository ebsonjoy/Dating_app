import Joi, { ValidationError } from 'joi';
import { Request, Response, NextFunction } from 'express';

const planDetailsSchema = Joi.object({
  planName: Joi.string()
    .trim()
    .regex(/^[A-Za-z\s]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Plan Name must contain only letters.',
      'string.empty': 'Plan Name is required.'
    }),

  duration: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Duration is required.'
    }),

  offerPercentage: Joi.number()
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

  actualPrice: Joi.number()
    .greater(0)
    .required()
    .messages({
      'number.base': 'Actual Price must be a number.',
      'number.greater': 'Actual Price must be a positive number.',
      'any.required': 'Actual Price is required.'
    }),

  offerPrice: Joi.number()
    .greater(0)
    .less(Joi.ref('actualPrice'))
    .required()
    .messages({
      'number.base': 'Offer Price must be a number.',
      'number.greater': 'Offer Price must be a positive number.',
      'number.less': 'Offer Price must be less than or equal to Actual Price.',
      'any.required': 'Offer Price is required.'
    }),

  offerName: Joi.string()
    .trim()
    .regex(/^[A-Za-z\s]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Offer Name must contain only letters.',
      'string.empty': 'Offer Name is required.'
    }),

    features: Joi.array()
    .items(Joi.string().trim().required().messages({
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

export const validatePlanDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await planDetailsSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const validationError = error as ValidationError;
    res.status(400).json({
      errors: validationError.details.map((err) => err.message)
    });
  }
};
