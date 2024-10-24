import express from 'express';
import {
  cancelOrder,
  createOrder,
  getOrderById,
  getOrdersByUserId,
} from '../controllers/orderController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Routes for order management
router.post('/', protect, createOrder); // Create a new order
router.get('/', protect, getOrdersByUserId); // Get all orders for the authenticated user
router.get('/:id', protect, getOrderById); // Get a specific order by ID
router.put('/:id', protect, cancelOrder); // Cancel a specific order by ID

export default router;
