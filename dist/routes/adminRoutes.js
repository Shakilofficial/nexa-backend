"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const categoryController_1 = require("../controllers/categoryController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const multerMiddleware_1 = require("../middleware/multerMiddleware");
const router = express_1.default.Router();
// User Management
router.get('/users', authMiddleware_1.protect, authMiddleware_1.admin, adminController_1.getAllUsers); // Get all users
router.get('/users/:id', authMiddleware_1.protect, authMiddleware_1.admin, adminController_1.getUserWithOrders); // Get user with order history
router.delete('/users/:id', authMiddleware_1.protect, authMiddleware_1.admin, adminController_1.deleteUser); // Delete a user
// Category Management Routes
router.get('/categories', authMiddleware_1.protect, authMiddleware_1.admin, categoryController_1.getCategories); // Get all categories
router.post('/categories', authMiddleware_1.protect, authMiddleware_1.admin, multerMiddleware_1.upload.single('icon'), adminController_1.createCategory); // Create category
router.get('/categories/:id', authMiddleware_1.protect, authMiddleware_1.admin, categoryController_1.getCategoryById); // Get all categories
router.put('/categories/:id', authMiddleware_1.protect, authMiddleware_1.admin, multerMiddleware_1.upload.single('icon'), adminController_1.updateCategory); // Update category
router.delete('/categories/:id', authMiddleware_1.protect, authMiddleware_1.admin, adminController_1.deleteCategory); // Delete category
//Product Management
router.post('/products', authMiddleware_1.protect, authMiddleware_1.admin, multerMiddleware_1.upload.array('images', 5), adminController_1.createProduct); //Create product
router.get('/products', authMiddleware_1.protect, authMiddleware_1.admin, adminController_1.getProducts); //Get All products
router.get('/products/:id', authMiddleware_1.protect, authMiddleware_1.admin, adminController_1.getProductById); //Get product by Id
router.put('/products/:id', authMiddleware_1.protect, authMiddleware_1.admin, multerMiddleware_1.upload.array('images', 5), adminController_1.updateProduct); //Update a product by Id
router.delete('/products/:id', authMiddleware_1.protect, authMiddleware_1.admin, adminController_1.deleteProduct); //Delete a product
// Order Management
router.get('/orders', authMiddleware_1.protect, authMiddleware_1.admin, adminController_1.getAllOrders); // Get all orders
router.put('/orders/:id/status', authMiddleware_1.protect, authMiddleware_1.admin, adminController_1.updateOrderStatus); // Update order status
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map