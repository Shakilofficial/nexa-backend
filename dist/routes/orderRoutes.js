"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Routes for order management
router.post('/', authMiddleware_1.protect, orderController_1.createOrder); // Create a new order
router.get('/', authMiddleware_1.protect, orderController_1.getOrdersByUserId); // Get all orders for the authenticated user
router.get('/:id', authMiddleware_1.protect, orderController_1.getOrderById); // Get a specific order by ID
router.put('/:id', authMiddleware_1.protect, orderController_1.cancelOrder); // Cancel a specific order by ID
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map