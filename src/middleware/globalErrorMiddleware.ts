import path from 'path';
import dotenv from 'dotenv';

import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import ApiExceptionHandler from '../utils/ApiErrorHandler';

dotenv.config({ path: path.resolve('.env') });

const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new ApiExceptionHandler(message, 400, {});
};

const handleDuplicateFieldsDB = (err: any) => {
  // duplicate fields
  const value = err.message?.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new ApiExceptionHandler(message, 400, {
    message: value,
  });
};

const handleValidationErrorDB = (err: Error.ValidationError) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new ApiExceptionHandler(message, 400, {
    message: errors,
  });
};

const handleJWTError = () =>
  new ApiExceptionHandler('Invalid token. Please log in again!', 401, {});

const handleJWTExpiredError = () =>
  new ApiExceptionHandler(
    'Your token has expired! Please log in again.',
    401,
    {},
  );

const sendErrorDev = (
  err: ApiExceptionHandler,
  req: Request,
  res: Response,
) => {
  /** send all error to log file on dev env */

  // Logger.error({
  //   status: err.status,
  //   message: err.message,
  //   stack: err.stack,
  // });

  return res.status(err.statusCode || 500).json({
    status: err.status,
    err,
    message: err.message,
    error: err.error,
    stack: err.stack,
  });
};

const sendErrorProd = (
  err: ApiExceptionHandler,
  req: Request,
  res: Response,
) => {
  if (err.message === 'Request Validation Error') {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err.error,
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err.error,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong! please contact support',
  });
};

const globalErrorHandler = (
  err: ApiExceptionHandler,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;

  console.log({
    message: err.message,
    stack: err.stack,
    error: err,
  });

  if (process.env.NODE_ENV !== 'production') {
    return sendErrorDev(err, req, res);
  }

  let error: ApiExceptionHandler | any = {
    ...err,
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err.error,
  };

  if (error.name === 'CastError') {
    error = handleCastErrorDB(error);
  }
  if (error?.code === 11000) {
    error = handleDuplicateFieldsDB(error);
  }
  if (error.name === 'ValidationError') {
    error = handleValidationErrorDB(error);
  }
  if (error.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }
  if (error.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  return sendErrorProd(error, req, res);
};

export default globalErrorHandler;
