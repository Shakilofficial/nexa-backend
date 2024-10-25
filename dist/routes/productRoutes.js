"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', productController_1.getProducts);
router.get('/:id', productController_1.getProductById);
router.post('/:id/review', authMiddleware_1.protect, productController_1.addProductReview);
router.delete('/:id/review', authMiddleware_1.protect, productController_1.deleteProductReview);
exports.default = router;
//# sourceMappingURL=productRoutes.js.map