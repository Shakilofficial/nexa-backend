import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { errorHandler, notFound } from './middleware/errorMiddleware';
import adminRoutes from './routes/adminRoutes';
import categoryRoutes from './routes/categoryRoutes';
import orderRoutes from './routes/orderRoutes';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

app.use(cors());

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public', { maxAge: '1d' }));
app.use(cookieParser());

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Nexa API');
});

// API routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/admin', adminRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export { app };
