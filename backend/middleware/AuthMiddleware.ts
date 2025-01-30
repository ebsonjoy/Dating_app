// import jwt, { JwtPayload } from "jsonwebtoken";
// import asyncHandler from "express-async-handler";
// import { Request, Response, NextFunction } from "express";
// import User from "../models/User";
// import { IUser } from '../types/user.types';

// interface AuthenticatedRequest extends Request {
//   user?: IUser | null;
// }

// const protect = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//   const  token = req.cookies.jwt;
//   if (token) {
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
//       req.user = await User.findById(decoded.userId).select("-password");

//       next();
//     } catch (error) {
//      console.log(error);
//       res.status(401);
//       throw new Error("Not authorized, invalid Token");    
//     }
//   } else {
//     res.status(401);
//     throw new Error("Not authorized, no token");
//   }
// });

// export { protect };
