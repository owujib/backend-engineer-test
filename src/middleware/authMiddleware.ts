import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import User from '../models/User';
import ApiExceptionHandler from '../utils/ApiErrorHandler';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return next(
        new ApiExceptionHandler('Authorization denied. No token provided', 403),
      );
    }
    const decoded = jwt.verify(token, <any>process.env.JWT_SECRET!) as {
      userId: string;
    };

    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(new ApiExceptionHandler('Forbiden', 403));
    }
    (<any>req).user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};

export const protectProductRoute = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    (<any>req).user?.email === 'test3@example.com' ||
    (<any>req).user?.email === 'owujibfavour@gmail.com' ||
    (<any>req).user?.email === 'test@example.com'
  ) {
    return next();
  }
  return next(new ApiExceptionHandler('Forbiden', 403));
};
