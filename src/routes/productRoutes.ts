import express from 'express';
import {
  addProductReview,
  deleteProductReview,
  getProductById,
  getProducts,
} from '../controllers/productController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/:id/review', protect, addProductReview);
router.delete('/:id/review', protect, deleteProductReview);

export default router;
