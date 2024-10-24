import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import ApiError from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

interface JwtPayload {
  id: string;
  tokenVersion: number;
}

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    // Extract the token from the authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Not authorized, token not found');
    }

    try {
      // Verify the JWT token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      ) as JwtPayload;

      // Find the user by the decoded token's user ID
      const user = await User.findById(decoded.id);

      if (!user || user.tokenVersion !== decoded.tokenVersion) {
        throw new ApiError(401, 'Not authorized, invalid token');
      }

      req.user = user;
      next();
    } catch (err) {
      const error = err as Error;

      console.error('Token verification failed:', error);
      if (error.name === 'TokenExpiredError') {
        throw new ApiError(401, 'Token expired, please log in again');
      } else {
        throw new ApiError(401, 'Not authorized, token failed');
      }
    }
  },
);

// Admin Authorization Middleware
export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    throw new ApiError(403, 'Not authorized as admin');
  }
};
