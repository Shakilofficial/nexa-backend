import { NextFunction, Request, Response } from 'express';
import ApiError from '../utils/ApiError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  } else {
    res.status(500).json({
      message: 'Something went wrong',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
