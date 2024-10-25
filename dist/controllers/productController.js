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
exports.deleteProductReview = exports.addProductReview = exports.getProductById = exports.getProducts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Product_1 = __importDefault(require("../models/Product"));
const User_1 = __importDefault(require("../models/User"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const asyncHandler_1 = require("../utils/asyncHandler");
exports.getProducts = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.default.find().populate('category');
        res
            .status(200)
            .json(new ApiResponse_1.default(200, products, 'Products retrieved successfully'));
    }
    catch (error) {
        console.error('Error retrieving products:', error);
        throw new ApiError_1.default(500, 'Error retrieving products');
    }
}));
exports.getProductById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Product_1.default.findById(req.params.id).populate('category');
    if (!product) {
        throw new ApiError_1.default(404, 'Product not found');
    }
    res
        .status(200)
        .json(new ApiResponse_1.default(200, product, 'Product retrieved successfully'));
}));
exports.addProductReview = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    // Check if all required fields are present
    if (!rating || !comment) {
        throw new ApiError_1.default(400, 'Rating and comment are required');
    }
    // Find the product by its ID
    const product = yield Product_1.default.findById(productId);
    if (!product) {
        throw new ApiError_1.default(404, 'Product not found');
    }
    // Find the user to get the name and avatar
    const user = yield User_1.default.findById(userId);
    if (!user) {
        throw new ApiError_1.default(404, 'User not found');
    }
    // Check if the user has already reviewed the product
    const alreadyReviewed = product.reviews.some((review) => review.userId.toString() === (userId === null || userId === void 0 ? void 0 : userId.toString()));
    if (alreadyReviewed) {
        throw new ApiError_1.default(400, 'You have already reviewed this product');
    }
    // Create the review object
    const review = {
        userId,
        userName: user.name,
        userAvatar: user.avatar,
        rating,
        comment,
        createdAt: new Date(),
    };
    // Add the review to the product's reviews array
    product.reviews.push(review);
    // Save the updated product
    yield product.save();
    res
        .status(201)
        .json(new ApiResponse_1.default(201, product.reviews, 'Review added successfully'));
}));
exports.deleteProductReview = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const productId = req.params.id; // Get productId from the route parameter
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id; // Assuming this is the authenticated user's ID
    // Check if productId is valid
    if (!productId || !mongoose_1.default.Types.ObjectId.isValid(productId)) {
        throw new ApiError_1.default(400, 'Invalid product ID');
    }
    // Find the product by its ID
    const product = yield Product_1.default.findById(productId);
    if (!product) {
        throw new ApiError_1.default(404, 'Product not found');
    }
    // Find the index of the review made by the user
    const reviewIndex = product.reviews.findIndex((review) => review.userId.toString() === (userId === null || userId === void 0 ? void 0 : userId.toString()));
    // If the review is not found, throw an error
    if (reviewIndex === -1) {
        throw new ApiError_1.default(404, 'Review not found or you do not have permission to delete this review');
    }
    // Remove the review from the reviews array
    product.reviews.splice(reviewIndex, 1);
    yield product.save();
    res.status(200).json({ message: 'Review deleted successfully' });
}));
//# sourceMappingURL=productController.js.map