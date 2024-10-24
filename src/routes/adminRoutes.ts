import express from 'express';
import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  deleteUser,
  getAllOrders,
  getAllUsers,
  getProductById,
  getProducts,
  getUserWithOrders,
  updateCategory,
  updateOrderStatus,
  updateProduct,
} from '../controllers/adminController';
import {
  getCategories,
  getCategoryById,
} from '../controllers/categoryController';
import { admin, protect } from '../middleware/authMiddleware';
import { upload } from '../middleware/multerMiddleware';

const router = express.Router();

// User Management
router.get('/users', protect, admin, getAllUsers); // Get all users
router.get('/users/:id', protect, admin, getUserWithOrders); // Get user with order history
router.delete('/users/:id', protect, admin, deleteUser); // Delete a user

// Category Management Routes
router.get('/categories', protect, admin, getCategories); // Get all categories
router.post(
  '/categories',
  protect,
  admin,
  upload.single('icon'),
  createCategory,
); // Create category
router.get('/categories/:id', protect, admin, getCategoryById); // Get all categories
router.put(
  '/categories/:id',
  protect,
  admin,
  upload.single('icon'),
  updateCategory,
); // Update category
router.delete('/categories/:id', protect, admin, deleteCategory); // Delete category

//Product Management
router.post(
  '/products',
  protect,
  admin,
  upload.array('images', 5),
  createProduct,
); //Create product
router.get('/products', protect, admin, getProducts); //Get All products
router.get('/products/:id', protect, admin, getProductById); //Get product by Id
router.put(
  '/products/:id',
  protect,
  admin,
  upload.array('images', 5),
  updateProduct,
); //Update a product by Id
router.delete('/products/:id', protect, admin, deleteProduct); //Delete a product

// Order Management
router.get('/orders', protect, admin, getAllOrders); // Get all orders
router.put('/orders/:id/status', protect, admin, updateOrderStatus); // Update order status

export default router;
