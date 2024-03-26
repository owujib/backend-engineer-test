import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';

import productRoute from './routes/products.routes';
import userRoute from './routes/user.routes';
import globalErrorHandler from './middleware/globalErrorMiddleware';
import mongoose from 'mongoose';
import ApiExceptionHandler from './utils/ApiErrorHandler';
process.env.TZ = 'Africa/Lagos';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.set('PORT', process.env.PORT || 5500);

//set up response interceptors
app.use((req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;
  res.json = function (body: any) {
    body.timestamp = Date.now();
    body.success ? body.success : (body.success = true);
    return originalJson.call(this, body);
  };
  return next();
});

app.use('/api/product', productRoute);
app.use('/api/user', userRoute);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ data: 'Hello world' });
});

app.get('*', (req: Request, res: Response, next: NextFunction) => {
  return next(new ApiExceptionHandler('Route not found or has been moved'));
});

app.use(globalErrorHandler);

mongoose
  .connect(process.env.DB_URL!)
  .then(() => console.log('db connection successful'))
  .catch((err) => console.log('Error %s', err));

export default app;
