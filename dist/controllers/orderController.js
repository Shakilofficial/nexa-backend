"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrder = exports.getOrderById = exports.getOrdersByUserId = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const asyncHandler_1 = require("../utils/asyncHandler");
// Create Order
exports.createOrder = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { products, totalAmount, deliveryAddress } = req.body;
    if (!products || !totalAmount || !deliveryAddress) {
        throw new ApiError_1.default(400, 'All fields are required');
    }
    // Check stock and update product quantities
    for (let item of products) {
        const product = yield Product_1.default.findById(item.productId);
        if (!product) {
            throw new ApiError_1.default(404, `Product not found: ${item.productId}`);
        }
        if (product.stock < item.quantity) {
            throw new ApiError_1.default(400, `Insufficient stock for product: ${product.name}`);
        }
        product.stock -= item.quantity;
        yield product.save();
    }
    const order = yield Order_1.default.create({
        userId: req.user._id,
        products,
        totalAmount,
        deliveryAddress,
    });
    res
        .status(201)
        .json(new ApiResponse_1.default(201, order, 'Order created successfully'));
}));
// Get Orders by User ID
exports.getOrdersByUserId = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield Order_1.default.find({ userId: req.user._id }).populate('products.productId');
    res
        .status(200)
        .json(new ApiResponse_1.default(200, orders, 'Orders retrieved successfully'));
}));
// Get Order by ID
exports.getOrderById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield Order_1.default.findById(req.params.id).populate('products.productId');
    if (!order) {
        throw new ApiError_1.default(404, 'Order not found');
    }
    if (order.userId.toString() !== req.user._id.toString()) {
        throw new ApiError_1.default(403, 'Not authorized to access this order');
    }
    res
        .status(200)
        .json(new ApiResponse_1.default(200, order, 'Order retrieved successfully'));
}));
// Cancel Order
exports.cancelOrder = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    // Find the order by ID
    const order = yield Order_1.default.findById(orderId);
    if (!order) {
        throw new ApiError_1.default(404, 'Order not found');
    }
    // Check if the user is authorized to cancel the order
    if (order.userId.toString() !== req.user._id.toString()) {
        throw new ApiError_1.default(403, 'Not authorized to cancel this order');
    }
    // Optionally check the status of the order to allow cancellation
    if (order.status !== 'pending') {
        throw new ApiError_1.default(400, 'Only pending orders can be canceled');
    }
    // Cancel the order
    order.status = 'canceled'; // Assuming you have a 'canceled' status
    yield order.save();
    res
        .status(200)
        .json(new ApiResponse_1.default(200, order, 'Order canceled successfully'));
}));
//# sourceMappingURL=orderController.js.map