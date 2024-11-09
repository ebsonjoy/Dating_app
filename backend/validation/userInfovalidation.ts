import Joi from 'joi';
import { Request, Response, NextFunction } from 'express'; 
import { ValidationError } from 'joi'; 

const userInfoSchema = Joi.object({
  gender: Joi.string()
    .valid('male', 'female', 'other') 
    .required()
    .messages({
      'any.only': 'Gender must be male, female, or other.',
      'any.required': 'Gender is required.'
    }),

  lookingFor: Joi.string()
    .valid('friendship', 'relationship', 'casual', 'serious') 
    .required()
    .messages({
      'any.only': 'Looking for must be one of: friendship, relationship, casual, or serious.',
      'any.required': 'Looking for is required.'
    }),

  relationship: Joi.string()
    .valid('single', 'in a relationship', 'married', 'divorced', 'widowed') 
    .required()
    .messages({
      'any.only': 'Relationship status must be one of: single, in a relationship, married, divorced, or widowed.',
      'any.required': 'Relationship status is required.'
    }),

  interests: Joi.array()
    .items(Joi.string().trim().min(1))
    .min(1) 
    .required()
    .messages({
      'array.min': 'At least one interest is required.',
      'any.required': 'Interests are required.'
    }),

  place: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'string.empty': 'Place is required.',
      'any.required': 'Place is required.'
    }),

  caste: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'string.empty': 'Caste is required.',
      'any.required': 'Caste is required.'
    }),

  occupation: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'string.empty': 'Occupation is required.',
      'any.required': 'Occupation is required.'
    }),

  education: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'string.empty': 'Education is required.',
      'any.required': 'Education is required.'
    }),

  bio: Joi.string()
    .trim()
    .max(300) 
    .messages({
      'string.max': 'Bio must be 300 characters or less.'
    }),

  smoking: Joi.string()
    .valid('yes', 'no', 'occasionally') 
    .required()
    .messages({
      'any.only': 'Smoking preference must be yes, no, or occasionally.',
      'any.required': 'Smoking preference is required.'
    }),

  drinking: Joi.string()
    .valid('yes', 'no', 'occasionally')
    .required()
    .messages({
      'any.only': 'Drinking preference must be yes, no, or occasionally.',
      'any.required': 'Drinking preference is required.'
    }),

  profilePhotos: Joi.array()
    .items(Joi.object().keys({
      name: Joi.string().required(), 
      size: Joi.number().max(5 * 1024 * 1024).required(), 
      type: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').required()
    })).max(4) // Limit to 4 profile photos
    .required()
    .messages({
      'array.max': 'You can upload a maximum of 4 profile photos.',
      'any.required': 'Profile photos are required.'
    }),

  location: Joi.object({
    latitude: Joi.number().required().messages({
      'any.required': 'Latitude is required.'
    }),
    longitude: Joi.number().required().messages({
      'any.required': 'Longitude is required.'
    })
  }).required().messages({
    'any.required': 'Location is required.'
  })
});

// Middleware for validating user info
const validateUserInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await userInfoSchema.validateAsync(req.body, { abortEarly: false }); 
    next();
  } catch (error) {
    const validationError = error as ValidationError;
    res.status(400).json({ errors: validationError.details.map(err => err.message) });
  }
};

export default validateUserInfo;
