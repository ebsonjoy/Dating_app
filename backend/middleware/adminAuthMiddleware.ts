import jwt from 'jsonwebtoken';
import expressAsyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { IAdmin } from '../models/AdminModel';

// Define a type for the decoded token (customize it based on your JWT structure)
interface AdminPayload {
    user?: IAdmin | null;
  // Add any other fields that might be in the token payload
}

interface AuthenticatedAdminRequest extends Request {
  admin?: AdminPayload;
}

const protect = expressAsyncHandler(async (
  req: AuthenticatedAdminRequest, 
  res: Response, 
  next: NextFunction
) => {
  const token: string | undefined = req.cookies.admin_jwt;  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AdminPayload;
      req.admin = decoded;
      next();
    } catch (error) {
        console.log(error);
      res.status(401);
      throw new Error("Not Authorized, invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not Authorized, no token");
  }
});

export { protect };
