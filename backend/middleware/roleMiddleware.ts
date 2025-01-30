/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';

interface AuthenticatedRequest extends Request {
  user?: any;
  admin?: any;
}


export const checkRole = (roles: string[]) => {
  return asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user && roles.includes(req.user.role)) {
        console.log('user role checked')
      return next();
    }
    if (req.admin && roles.includes(req.admin.role)) {
        console.log('admin role checked')
      return next();
    }
    
    res.status(403);
    throw new Error('Access denied. You do not have the required permissions.');
  });
};
